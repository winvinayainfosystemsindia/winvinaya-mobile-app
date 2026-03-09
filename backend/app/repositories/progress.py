from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.progress import LessonProgress, CourseProgress
from app.schemas.progress import LessonProgressCreate, LessonProgressUpdate
from app.repositories.base import BaseRepository


class ProgressRepository(BaseRepository[LessonProgress, LessonProgressCreate, LessonProgressUpdate]):

    async def get_lesson_progress(
        self, db: AsyncSession, user_id: int, lesson_id: int
    ) -> Optional[LessonProgress]:
        result = await db.execute(
            select(LessonProgress).filter(
                LessonProgress.user_id == user_id,
                LessonProgress.lesson_id == lesson_id,
            )
        )
        return result.scalars().first()

    async def get_course_progress(
        self, db: AsyncSession, user_id: int, course_id: int
    ) -> Optional[CourseProgress]:
        result = await db.execute(
            select(CourseProgress).filter(
                CourseProgress.user_id == user_id,
                CourseProgress.course_id == course_id,
            )
        )
        return result.scalars().first()


progress_repository = ProgressRepository(LessonProgress)
