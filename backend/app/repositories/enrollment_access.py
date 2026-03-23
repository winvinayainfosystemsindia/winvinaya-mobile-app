from typing import Optional, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.enrollment_access import UserCourseAccess
from app.repositories.base import BaseRepository

class UserCourseAccessRepository(BaseRepository[UserCourseAccess, Any, Any]):
    async def get_by_user_and_course(
        self, db: AsyncSession, user_id: int, course_id: int
    ) -> Optional[UserCourseAccess]:
        result = await db.execute(
            select(UserCourseAccess).filter(
                UserCourseAccess.user_id == user_id,
                UserCourseAccess.course_id == course_id,
            )
        )
        return result.scalars().first()

user_course_access_repository = UserCourseAccessRepository(UserCourseAccess)
