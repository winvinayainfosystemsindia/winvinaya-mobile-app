"""
Admin endpoint — dashboard stats, user management.

Caching:
  - GET /stats     → Redis cache, TTL 2 min (invalidated on enrollment changes)
  - GET /users     → paginated with OffsetPage

Rate limiting uses the global default (200 req/min).
"""
from typing import List, Optional

from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.cache import cache, TTL_ADMIN_STATS
from app.core.dependencies import require_role
from app.db.session import get_db
from app.models.enrollment import Enrollment, EnrollmentStatus
from app.models.media import MediaFile
from app.models.user import User, UserRole
from app.models.course import Course
from app.repositories.user import user_repository
from app.schemas.pagination import OffsetPage, clamp_page_size, offset_from
from app.schemas.user import UserResponse

router = APIRouter()

STATS_CACHE_KEY = "admin:stats"


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
    """
    Aggregated stats for the admin dashboard.
    Cached in Redis for 2 minutes — cache is invalidated by enrollment mutations.
    """
    cached = await cache.get(STATS_CACHE_KEY)
    if cached:
        return StatsResponse(**cached)

    total_users = (await db.execute(select(func.count(User.id)))).scalar()
    total_courses = (await db.execute(select(func.count(Course.id)))).scalar()
    total_enrollments = (await db.execute(select(func.count(Enrollment.id)))).scalar()
    total_completions = (await db.execute(
        select(func.count(Enrollment.id)).filter(Enrollment.status == EnrollmentStatus.completed)
    )).scalar()
    total_storage = (await db.execute(
        select(func.coalesce(func.sum(MediaFile.size_bytes), 0))
    )).scalar()

    result = StatsResponse(
        total_users=total_users,
        total_courses=total_courses,
        total_enrollments=total_enrollments,
        total_completions=total_completions,
        total_storage_bytes=total_storage,
    )
    await cache.set(STATS_CACHE_KEY, result.model_dump(), ttl=TTL_ADMIN_STATS)
    return result


@router.get("/users", response_model=OffsetPage[UserResponse], summary="List all users (admin) — paginated")
async def list_users(
    page: int = 1,
    page_size: int = 20,
    db: AsyncSession = Depends(get_db),
    _=Depends(require_role("admin")),
):
    """Returns a paginated list of all users."""
    page_size = clamp_page_size(page_size)
    skip = offset_from(page, page_size)

    total_result = await db.execute(select(func.count(User.id)))
    total = total_result.scalar() or 0

    users_result = await db.execute(
        select(User).offset(skip).limit(page_size).order_by(User.created_at.desc())
    )
    users = users_result.scalars().all()

    return OffsetPage[UserResponse].create(
        items=[UserResponse.model_validate(u) for u in users],
        total=total,
        page=page,
        page_size=page_size,
    )


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
    updated = await user_repository.update(db, db_obj=user, obj_in={"role": payload.role})
    # Invalidate stats cache — role changes affect counts
    await cache.delete(STATS_CACHE_KEY)
    return updated


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
