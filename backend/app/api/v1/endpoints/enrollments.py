"""
Enrollment endpoint — enroll, unenroll, and list learners.
"""
from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user, get_current_instructor
from app.core.exceptions import ConflictError, NotFoundError
from app.db.session import get_db
from app.repositories.course import course_repository
from app.repositories.enrollment import enrollment_repository
from app.schemas.enrollment import EnrollmentCreate, EnrollmentResponse

router = APIRouter()


@router.post("/", response_model=EnrollmentResponse, status_code=status.HTTP_201_CREATED,
             summary="Enroll the current user in a course")
async def enroll(
    course_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    course = await course_repository.get(db, course_id)
    if not course:
        raise NotFoundError("Course")

    existing = await enrollment_repository.get_by_user_and_course(db, current_user.id, course_id)
    if existing:
        raise ConflictError("Already enrolled in this course.")

    enrollment_in = EnrollmentCreate(user_id=current_user.id, course_id=course_id)
    return await enrollment_repository.create(db, obj_in=enrollment_in)


@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT,
               summary="Unenroll current user from a course")
async def unenroll(
    course_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    enrollment = await enrollment_repository.get_by_user_and_course(db, current_user.id, course_id)
    if not enrollment:
        raise NotFoundError("Enrollment")
    await enrollment_repository.remove(db, id=enrollment.id)


@router.get("/my", response_model=List[EnrollmentResponse], summary="List my active enrollments")
async def my_enrollments(
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return await enrollment_repository.get_user_enrollments(db, current_user.id, skip=skip, limit=limit)


@router.get("/{course_id}/learners", response_model=List[EnrollmentResponse],
            summary="List learners enrolled in a course (instructor/admin)")
async def course_learners(
    course_id: int,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_instructor),
):
    return await enrollment_repository.get_course_learners(db, course_id, skip=skip, limit=limit)
