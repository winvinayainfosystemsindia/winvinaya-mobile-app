from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException
from app.models.content import Quiz, QuizQuestion, MatchingPair, QuizAttempt, QuizQuestionType
from app.repositories.content import (
    quiz_repository, quiz_question_repository, 
    matching_pair_repository, quiz_attempt_repository
)
from app.schemas.content import (
    QuizCreate, QuizUpdate, QuizQuestionCreate, QuizAttemptCreate
)
from app.services.quiz_eval import QuizEvalService

class QuizService:
    async def create_quiz(self, db: AsyncSession, quiz_in: QuizCreate) -> Quiz:
        # 1. Create Quiz metadata
        quiz_data = quiz_in.model_dump(exclude={"questions"})
        quiz = Quiz(**quiz_data)
        db.add(quiz)
        await db.flush()

        # 2. Add Questions if any
        if quiz_in.questions:
            for q_in in quiz_in.questions:
                await self.add_question(db, quiz.id, q_in)

        await db.commit()
        # Return re-fetched quiz with all relations loaded
        return await quiz_repository.get(db, quiz.id)

    async def add_question(self, db: AsyncSession, quiz_id: int, question_in: QuizQuestionCreate) -> QuizQuestion:
        # 1. Create Question
        question_data = question_in.model_dump(exclude={"matching_pairs"})
        question_data["quiz_id"] = quiz_id
        question = QuizQuestion(**question_data)
        db.add(question)
        await db.flush()

        # 2. Add Matching Pairs if any
        if question_in.question_type == QuizQuestionType.match_the_following and question_in.matching_pairs:
            for pair_in in question_in.matching_pairs:
                pair = MatchingPair(**pair_in.model_dump(), question_id=question.id)
                db.add(pair)
        
        await db.commit()
        # Re-fetch to load matching_pairs if any
        result = await db.execute(
            select(QuizQuestion)
            .where(QuizQuestion.id == question.id)
            .options(selectinload(QuizQuestion.matching_pairs))
        )
        return result.scalars().first()

    async def submit_attempt(self, db: AsyncSession, user_id: int, attempt_in: QuizAttemptCreate) -> QuizAttempt:
        quiz = await quiz_repository.get(db, attempt_in.quiz_id)
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")

        # Use new QuizEvalService for robust scoring
        eval_result = await QuizEvalService.evaluate_attempt(db, quiz, attempt_in.answers or {})
        score_percent = eval_result["score"]
        passed = eval_result["passed"]

        # 2. Determine Attempt Number
        prev_attempts = await quiz_attempt_repository.get_user_attempts(db, quiz.id, user_id)
        attempt_number = (prev_attempts[0].attempt_number + 1) if prev_attempts else 1

        # 3. Create Attempt Record
        attempt = QuizAttempt(
            quiz_id=quiz.id,
            user_id=user_id,
            answers=attempt_in.answers,
            score=score_percent,
            passed=passed,
            attempt_number=attempt_number,
            result_detail=eval_result["detail"] # Store the detailed feedback
        )
        db.add(attempt)
        await db.flush()

        # 4. Update Lesson Progress if passed
        if passed:
            from app.services.progress import ProgressService
            await ProgressService.mark_lesson_complete(db, user_id, quiz.lesson_id, score=score_percent)

        await db.commit()
        await db.refresh(attempt)
        return attempt

    async def update_quiz(self, db: AsyncSession, quiz_id: int, quiz_in: QuizUpdate) -> Quiz:
        quiz = await quiz_repository.get(db, id=quiz_id)
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")

        # 1. Update Quiz metadata
        update_data = quiz_in.model_dump(exclude={"questions"}, exclude_unset=True)
        for field, value in update_data.items():
            setattr(quiz, field, value)

        # 2. Sync Questions if provided
        if quiz_in.questions is not None:
            from sqlalchemy import delete
            # Clear existing questions (simple sync for Phase 1)
            await db.execute(delete(QuizQuestion).where(QuizQuestion.quiz_id == quiz_id))
            
            for q_in in quiz_in.questions:
                # Type cast/convert to QuizQuestionCreate for add_question
                # (Assuming they are compatible enough for this flow)
                q_create = QuizQuestionCreate(**q_in.model_dump(exclude_unset=True))
                await self.add_question(db, quiz_id, q_create)

        await db.commit()
        # Return re-fetched quiz with all relations loaded
        return await quiz_repository.get(db, quiz_id)

quiz_service = QuizService()
