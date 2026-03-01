from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.course import course_repository
from app.schemas.course import CourseCreate
from app.models.course import Course, Module, Lesson

class CourseService:
    async def create_course(self, db: AsyncSession, *, course_in: CourseCreate, instructor_id: int) -> Course:
        db_obj = Course(
            **course_in.model_dump(),
            instructor_id=instructor_id
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_courses(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Course]:
        return await course_repository.get_multi(db, skip=skip, limit=limit)

    async def get_course(self, db: AsyncSession, course_id: int) -> Optional[Course]:
        return await course_repository.get(db, id=course_id)

    async def add_module(self, db: AsyncSession, *, course_id: int, title: str, order: int = 0) -> Module:
        db_obj = Module(title=title, course_id=course_id, order=order)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

course_service = CourseService()
