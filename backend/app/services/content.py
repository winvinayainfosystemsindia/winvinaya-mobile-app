from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.models.content import Quiz, QuizQuestion, MatchingPair, QuizAttempt, QuizQuestionType
from app.repositories.content import (
    quiz_repository, quiz_question_repository, 
    matching_pair_repository, quiz_attempt_repository
)
from app.schemas.content import (
    QuizCreate, QuizUpdate, QuizQuestionCreate, QuizAttemptCreate
)

class QuizService:
    async def create_quiz(self, db: AsyncSession, quiz_in: QuizCreate) -> Quiz:
        return await quiz_repository.create(db, obj_in=quiz_in)

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
        await db.refresh(question)
        return question

    async def submit_attempt(self, db: AsyncSession, user_id: int, attempt_in: QuizAttemptCreate) -> QuizAttempt:
        quiz = await quiz_repository.get(db, attempt_in.quiz_id)
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")

        # 1. Calculate Score
        questions = await quiz_question_repository.get_by_quiz(db, quiz.id)
        total_points = sum(q.points for q in questions)
        earned_points = 0.0
        
        # We'll store a detailed feedback object in the attempt or return it
        # For now, we'll just store the score
        for question in questions:
            user_answer = attempt_in.answers.get(str(question.id)) or attempt_in.answers.get(question.id)
            if not user_answer:
                continue

            is_correct = False
            if question.question_type in [QuizQuestionType.mcq, QuizQuestionType.true_false]:
                is_correct = str(user_answer).strip().lower() == str(question.correct_answer).strip().lower()
            
            elif question.question_type == QuizQuestionType.match_the_following:
                # user_answer: {source_id: target_id/text} or list of pairs
                # Logic: Compare vs MatchingPair table
                pairs = await matching_pair_repository.get_by_question(db, question.id)
                correct_count = 0
                for pair in pairs:
                    # Assuming user_answer is a dict {source_text: target_text} or {pair_id: target_text}
                    # For simplicity, let's assume {source_text: target_text}
                    if user_answer.get(pair.source_text) == pair.target_text:
                        correct_count += 1
                
                # Full points only if all match (or partial credit logic)
                if correct_count == len(pairs):
                    is_correct = True
                else:
                    # Partial credit (optional)
                    earned_points += (correct_count / len(pairs)) * question.points
                    continue

            if is_correct:
                earned_points += question.points

        score_percent = (earned_points / total_points * 100) if total_points > 0 else 0
        passed = score_percent >= quiz.pass_score

        # 2. Determine Attempt Number
        prev_attempts = await quiz_attempt_repository.get_user_attempts(db, quiz.id, user_id)
        attempt_number = (prev_attempts[0].attempt_number + 1) if prev_attempts else 1

        # 4. Update Lesson Progress if passed
        if passed:
            from app.repositories.progress import progress_repository
            from app.models.progress import LessonProgress, LessonProgressStatus
            
            lp = await progress_repository.get_lesson_progress(db, user_id, quiz.lesson_id)
            if not lp:
                lp = LessonProgress(user_id=user_id, lesson_id=quiz.lesson_id)
                db.add(lp)
            
            lp.status = LessonProgressStatus.completed
            lp.score = score_percent
            if not lp.completed_at:
                from datetime import datetime
                lp.completed_at = datetime.utcnow()
            
            # Recompute course progress
            from app.api.v1.endpoints.progress import _recompute_course_progress
            await _recompute_course_progress(db, user_id, quiz.lesson.module.course_id)

        await db.commit()
        await db.refresh(attempt)
        return attempt

quiz_service = QuizService()
