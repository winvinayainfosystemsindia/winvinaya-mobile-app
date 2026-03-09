"""
Progress endpoint — track lesson completion and course progress.
"""
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.dependencies import get_current_user
from app.core.exceptions import NotFoundError
from app.db.session import get_db
from app.models.course import Course, Module, Lesson
from app.models.enrollment import Enrollment, EnrollmentStatus
from app.models.progress import LessonProgress, CourseProgress, LessonProgressStatus
from app.repositories.progress import progress_repository
from app.schemas.progress import LessonProgressUpdate, LessonProgressResponse, CourseProgressResponse

router = APIRouter()


@router.post("/lesson/{lesson_id}", response_model=LessonProgressResponse,
             summary="Update lesson progress (mark complete or update watch time)")
async def update_lesson_progress(
    lesson_id: int,
    payload: LessonProgressUpdate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # Verify lesson exists
    lesson_result = await db.execute(select(Lesson).filter(Lesson.id == lesson_id))
    lesson = lesson_result.scalars().first()
    if not lesson:
        raise NotFoundError("Lesson")

    # Upsert lesson progress
    lp = await progress_repository.get_lesson_progress(db, current_user.id, lesson_id)
    if not lp:
        lp = LessonProgress(user_id=current_user.id, lesson_id=lesson_id)
        db.add(lp)

    if payload.status:
        lp.status = payload.status
    if payload.watch_duration_seconds is not None:
        lp.watch_duration_seconds = payload.watch_duration_seconds
    if payload.score is not None:
        lp.score = payload.score
    if payload.status == LessonProgressStatus.completed and not lp.completed_at:
        lp.completed_at = datetime.utcnow()

    await db.commit()
    await db.refresh(lp)

    # Recompute course progress asynchronously
    module_result = await db.execute(select(Module).filter(Module.id == lesson.module_id))
    module = module_result.scalars().first()
    if module:
        from app.tasks.video_processing import compute_course_duration
        # Fire course progress recomputation inline
        await _recompute_course_progress(db, current_user.id, module.course_id)

    return lp


async def _recompute_course_progress(db: AsyncSession, user_id: int, course_id: int):
    """Recalculate and upsert a user's CourseProgress record."""
    # Total lessons in course
    total_result = await db.execute(
        select(func.count(Lesson.id))
        .join(Module, Module.id == Lesson.module_id)
        .filter(Module.course_id == course_id)
    )
    total = total_result.scalar() or 0

    # Completed lessons
    completed_result = await db.execute(
        select(func.count(LessonProgress.id))
        .join(Lesson, Lesson.id == LessonProgress.lesson_id)
        .join(Module, Module.id == Lesson.module_id)
        .filter(
            Module.course_id == course_id,
            LessonProgress.user_id == user_id,
            LessonProgress.status == LessonProgressStatus.completed,
        )
    )
    completed = completed_result.scalar() or 0
    percent = round((completed / total * 100) if total else 0, 2)

    # Upsert CourseProgress
    cp = await progress_repository.get_course_progress(db, user_id, course_id)
    if not cp:
        cp = CourseProgress(user_id=user_id, course_id=course_id)
        db.add(cp)
    cp.total_lessons = total
    cp.lessons_completed = completed
    cp.percent_complete = percent

    # Update enrollment progress_percent
    enr_result = await db.execute(
        select(Enrollment).filter(
            Enrollment.user_id == user_id, Enrollment.course_id == course_id
        )
    )
    enr = enr_result.scalars().first()
    if enr:
        enr.progress_percent = percent
        if percent >= 100.0:
            enr.status = EnrollmentStatus.completed
            enr.completed_at = datetime.utcnow()

    await db.commit()


@router.get("/course/{course_id}", response_model=CourseProgressResponse,
            summary="Get my progress for a course")
async def get_course_progress(
    course_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    cp = await progress_repository.get_course_progress(db, current_user.id, course_id)
    if not cp:
        raise NotFoundError("Progress record (not enrolled or no lessons started)")
    return cp
