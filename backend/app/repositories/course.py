from typing import List, Optional, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload, joinedload

from app.models.course import Course, Module, Lesson
from app.models.enrollment import Enrollment
from app.repositories.base import BaseRepository
from app.schemas.course import CourseCreate, CourseUpdate


class CourseRepository(BaseRepository[Course, CourseCreate, CourseUpdate]):
    async def get(self, db: AsyncSession, id: Any) -> Optional[Course]:
        result = await db.execute(
            select(Course)
            .options(joinedload(Course.modules).selectinload(Module.lessons))
            .filter(Course.id == id)
        )
        return result.unique().scalars().first()

    async def get_multi(self, db: AsyncSession, *, skip: int = 0, limit: int = 100) -> List[Course]:
        result = await db.execute(
            select(Course)
            .options(joinedload(Course.modules).selectinload(Module.lessons))
            .offset(skip)
            .limit(limit)
        )
        return result.unique().scalars().all()

    async def get_with_modules(self, db: AsyncSession, course_id: int) -> Optional[Course]:
        result = await db.execute(
            select(Course)
            .options(joinedload(Course.modules).selectinload(Module.lessons))
            .filter(Course.id == course_id)
        )
        return result.unique().scalars().first()

    async def get_by_slug(self, db: AsyncSession, slug: str) -> Optional[Course]:
        result = await db.execute(select(Course).filter(Course.slug == slug))
        return result.scalars().first()

    async def get_published(self, db: AsyncSession, *, skip: int = 0, limit: int = 20) -> List[Course]:
        from app.models.course import CourseStatus
        result = await db.execute(
            select(Course)
            .options(joinedload(Course.modules).selectinload(Module.lessons))
            .filter(Course.status == CourseStatus.published)
            .offset(skip)
            .limit(limit)
        )
        return result.unique().scalars().all()

    async def get_by_instructor(self, db: AsyncSession, instructor_id: int) -> List[Course]:
        result = await db.execute(
            select(Course)
            .options(joinedload(Course.modules).selectinload(Module.lessons))
            .filter(Course.instructor_id == instructor_id)
        )
        return result.unique().scalars().all()


course_repository = CourseRepository(Course)
