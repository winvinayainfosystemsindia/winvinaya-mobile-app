from typing import List, Optional, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.repositories.base import BaseRepository
from app.models.content import Quiz, QuizQuestion, MatchingPair, Assignment, QuizAttempt
from app.schemas.content import (
    QuizCreate, QuizUpdate,
    QuizQuestionCreate, QuizQuestionUpdate,
    MatchingPairCreate, # No update for matching pair needed separately usually
    AssignmentCreate, AssignmentUpdate,
    QuizAttemptCreate, # No update needed for attempt
)

class QuizRepository(BaseRepository[Quiz, QuizCreate, QuizUpdate]):
    async def get(self, db: AsyncSession, id: Any) -> Optional[Quiz]:
        result = await db.execute(
            select(self.model)
            .filter(self.model.id == id)
            .options(selectinload(self.model.questions).selectinload(QuizQuestion.matching_pairs))
        )
        return result.scalars().first()

    async def get_by_lesson(self, db: AsyncSession, lesson_id: int) -> Optional[Quiz]:
        result = await db.execute(
            select(self.model)
            .filter(self.model.lesson_id == lesson_id)
            .options(selectinload(self.model.questions).selectinload(QuizQuestion.matching_pairs))
        )
        quiz = result.scalars().first()
        return quiz

class QuizQuestionRepository(BaseRepository[QuizQuestion, QuizQuestionCreate, QuizQuestionUpdate]):
    async def get_by_quiz(self, db: AsyncSession, quiz_id: int) -> List[QuizQuestion]:
        result = await db.execute(
            select(self.model)
            .filter(self.model.quiz_id == quiz_id)
            .options(selectinload(self.model.matching_pairs))
            .order_by(self.model.order)
        )
        return result.scalars().all()

class MatchingPairRepository(BaseRepository[MatchingPair, MatchingPairCreate, MatchingPairCreate]):
    async def get_by_question(self, db: AsyncSession, question_id: int) -> List[MatchingPair]:
        result = await db.execute(select(self.model).filter(self.model.question_id == question_id))
        return result.scalars().all()

class AssignmentRepository(BaseRepository[Assignment, AssignmentCreate, AssignmentUpdate]):
    async def get_by_lesson(self, db: AsyncSession, lesson_id: int) -> Optional[Assignment]:
        result = await db.execute(select(self.model).filter(self.model.lesson_id == lesson_id))
        return result.scalars().first()

class QuizAttemptRepository(BaseRepository[QuizAttempt, QuizAttemptCreate, QuizAttemptCreate]):
    async def get_user_attempts(self, db: AsyncSession, quiz_id: int, user_id: int) -> List[QuizAttempt]:
        result = await db.execute(
            select(self.model)
            .filter(self.model.quiz_id == quiz_id, self.model.user_id == user_id)
            .order_by(self.model.attempt_number.desc())
        )
        return result.scalars().all()

    async def get_latest_attempt(self, db: AsyncSession, quiz_id: int, user_id: int) -> Optional[QuizAttempt]:
        result = await db.execute(
            select(self.model)
            .filter(self.model.quiz_id == quiz_id, self.model.user_id == user_id)
            .order_by(self.model.attempt_number.desc())
            .limit(1)
        )
        return result.scalars().first()

quiz_repository = QuizRepository(Quiz)
quiz_question_repository = QuizQuestionRepository(QuizQuestion)
matching_pair_repository = MatchingPairRepository(MatchingPair)
assignment_repository = AssignmentRepository(Assignment)
quiz_attempt_repository = QuizAttemptRepository(QuizAttempt)
