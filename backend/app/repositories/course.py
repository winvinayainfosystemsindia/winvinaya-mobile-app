from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.course import Course, Module, Lesson
from app.repositories.base import BaseRepository

# We can keep standard CRUD in BaseRepository and add specific ones here if needed
class CourseRepository(BaseRepository[Course, Any, Any]): # Using Any for now since I'll create schemas next
    async def get_with_modules(self, db: AsyncSession, course_id: int) -> Optional[Course]:
        # Implementation with joinedload would go here for optimization
        result = await db.execute(select(Course).filter(Course.id == course_id))
        return result.scalars().first()

course_repository = CourseRepository(Course)
