"""
Admin endpoint — dashboard stats, user management.
"""
from typing import List

from fastapi import APIRouter, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.dependencies import require_role
from app.db.session import get_db
from app.models.user import User, UserRole
from app.models.course import Course
from app.models.enrollment import Enrollment
from app.models.media import MediaFile
from app.repositories.user import user_repository
from app.schemas.user import UserResponse

router = APIRouter()


class StatsResponse(BaseModel):
    total_users: int
    total_courses: int
    total_enrollments: int
    total_completions: int
    total_storage_bytes: int


class RoleUpdateRequest(BaseModel):
    role: UserRole


@router.get("/stats", response_model=StatsResponse, summary="Dashboard statistics (admin)")
async def dashboard_stats(
    db: AsyncSession = Depends(get_db),
    _=Depends(require_role("admin")),
):
    total_users = (await db.execute(select(func.count(User.id)))).scalar()
    total_courses = (await db.execute(select(func.count(Course.id)))).scalar()
    total_enrollments = (await db.execute(select(func.count(Enrollment.id)))).scalar()

    from app.models.enrollment import EnrollmentStatus
    total_completions = (await db.execute(
        select(func.count(Enrollment.id)).filter(Enrollment.status == EnrollmentStatus.completed)
    )).scalar()

    total_storage = (await db.execute(select(func.coalesce(func.sum(MediaFile.size_bytes), 0)))).scalar()

    return StatsResponse(
        total_users=total_users,
        total_courses=total_courses,
        total_enrollments=total_enrollments,
        total_completions=total_completions,
        total_storage_bytes=total_storage,
    )


@router.get("/users", response_model=List[UserResponse], summary="List all users (admin)")
async def list_users(
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
    _=Depends(require_role("admin")),
):
    return await user_repository.get_multi(db, skip=skip, limit=limit)


@router.patch("/users/{user_id}/role", response_model=UserResponse, summary="Change user role (admin)")
async def change_user_role(
    user_id: int,
    payload: RoleUpdateRequest,
    db: AsyncSession = Depends(get_db),
    _=Depends(require_role("admin")),
):
    from app.core.exceptions import NotFoundError
    user = await user_repository.get(db, user_id)
    if not user:
        raise NotFoundError("User")
    return await user_repository.update(db, db_obj=user, obj_in={"role": payload.role})


@router.get("/media/usage", summary="Storage usage by media type (admin)")
async def storage_usage(
    db: AsyncSession = Depends(get_db),
    _=Depends(require_role("admin")),
):
    result = await db.execute(
        select(MediaFile.media_type, func.count(MediaFile.id), func.sum(MediaFile.size_bytes))
        .group_by(MediaFile.media_type)
    )
    rows = result.all()
    return [
        {"media_type": row[0], "count": row[1], "total_bytes": row[2] or 0}
        for row in rows
    ]
