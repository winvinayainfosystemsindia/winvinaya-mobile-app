"""
Progress endpoint — track lesson completion and course progress.
"""
from datetime import datetime
from typing import Optional, List

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
    lesson_result = await db.execute(
        select(Lesson).filter(Lesson.id == lesson_id)
    )
    lesson = lesson_result.scalars().first()
    if not lesson:
        raise NotFoundError("Lesson")

    # Enforce Sequence: Check for previous lesson completion
    # 1. Find the previous lesson by order (or id if order is 0)
    prev_lesson_result = await db.execute(
        select(Lesson)
        .join(Module, Module.id == Lesson.module_id)
        .filter(
            Module.course_id == lesson.module.course_id,
            Lesson.order < lesson.order
        )
        .order_by(Lesson.order.desc())
        .limit(1)
    )
    prev_lesson = prev_lesson_result.scalars().first()
    
    if prev_lesson:
        # 2. Check if user has completed it
        prev_lp = await progress_repository.get_lesson_progress(db, current_user.id, prev_lesson.id)
        if not prev_lp or prev_lp.status != LessonProgressStatus.completed:
            from app.core.exceptions import ValidationError
            raise ValidationError(f"Previous lesson '{prev_lesson.title}' must be completed first.")

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
    # Fetch lesson progress records first
    lp_result = await db.execute(
        select(LessonProgress)
        .join(Lesson, Lesson.id == LessonProgress.lesson_id)
        .join(Module, Module.id == Lesson.module_id)
        .filter(
            Module.course_id == course_id,
            LessonProgress.user_id == current_user.id
        )
    )
    lesson_progress = lp_result.scalars().all()

    cp = await progress_repository.get_course_progress(db, current_user.id, course_id)
    if cp:
        # Attach lesson_progress to the object for pydantic
        cp.lesson_progress = lesson_progress
        return cp

    # If no progress record, check if enrolled
    enr_result = await db.execute(
        select(Enrollment).filter(
            Enrollment.user_id == current_user.id,
            Enrollment.course_id == course_id,
            Enrollment.status != EnrollmentStatus.dropped
        )
    )
    enr = enr_result.scalars().first()
    if not enr:
        raise NotFoundError("Course enrollment not found")

    # Fetch total lessons to return a skeleton progress
    total_result = await db.execute(
        select(func.count(Lesson.id))
        .join(Module, Module.id == Lesson.module_id)
        .filter(Module.course_id == course_id)
    )
    total = total_result.scalar() or 0

    return {
        "user_id": current_user.id,
        "course_id": course_id,
        "total_lessons": total,
        "lessons_completed": 0,
        "percent_complete": 0.0,
        "last_accessed_at": None,
        "lesson_progress": lesson_progress
    }
