from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models.enrollment import Enrollment
from app.repositories.base import BaseRepository
from app.schemas.enrollment import EnrollmentCreate, EnrollmentUpdate


class EnrollmentRepository(BaseRepository[Enrollment, EnrollmentCreate, EnrollmentUpdate]):

    async def get_by_user_and_course(
        self, db: AsyncSession, user_id: int, course_id: int
    ) -> Optional[Enrollment]:
        result = await db.execute(
            select(Enrollment).filter(
                Enrollment.user_id == user_id,
                Enrollment.course_id == course_id,
            )
        )
        return result.scalars().first()

    async def get_multi(
        self, db: AsyncSession, *, skip: int = 0, limit: int = 100
    ) -> List[Enrollment]:
        from app.models.course import Course, Module
        result = await db.execute(
            select(Enrollment)
            .options(
                selectinload(Enrollment.user),
                selectinload(Enrollment.course).selectinload(Course.modules).selectinload(Module.lessons)
            )
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    async def get_user_enrollments(
        self, db: AsyncSession, user_id: int, skip: int = 0, limit: int = 50
    ) -> List[Enrollment]:
        from app.models.course import Course, Module
        result = await db.execute(
            select(Enrollment)
            .options(
                selectinload(Enrollment.course).selectinload(Course.modules).selectinload(Module.lessons)
            )
            .filter(Enrollment.user_id == user_id)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    async def get_course_learners(
        self, db: AsyncSession, course_id: int, skip: int = 0, limit: int = 100
    ) -> List[Enrollment]:
        from app.models.course import Course, Module
        result = await db.execute(
            select(Enrollment)
            .options(
                selectinload(Enrollment.user),
                selectinload(Enrollment.course).selectinload(Course.modules).selectinload(Module.lessons)
            )
            .filter(Enrollment.course_id == course_id)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()


enrollment_repository = EnrollmentRepository(Enrollment)
