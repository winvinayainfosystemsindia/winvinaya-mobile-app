from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.course import CourseResponse, CourseCreate, ModuleResponse
from app.services.course import course_service

router = APIRouter()

@router.get("/", response_model=List[CourseResponse])
async def read_courses(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve courses.
    """
    courses = await course_service.get_courses(db, skip=skip, limit=limit)
    return courses

@router.post("/", response_model=CourseResponse)
async def create_course(
    *,
    db: AsyncSession = Depends(get_db),
    course_in: CourseCreate,
) -> Any:
    """
    Create new course. (Instructor ID would normally come from auth)
    """
    # Hardcoding instructor_id for now until auth is fully integrated
    course = await course_service.create_course(db, course_in=course_in, instructor_id=1)
    return course

@router.get("/{course_id}", response_model=CourseResponse)
async def read_course(
    *,
    db: AsyncSession = Depends(get_db),
    course_id: int,
) -> Any:
    """
    Get course by ID.
    """
    course = await course_service.get_course(db, course_id=course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course
