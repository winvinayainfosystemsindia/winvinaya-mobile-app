from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.course import (
    CourseResponse, CourseCreate, 
    ModuleResponse, ModuleCreate,
    LessonResponse, LessonCreate
)
from app.services.course import course_service
from app.core.dependencies import get_current_user
from app.models.user import User

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
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Create new course.
    """
    course = await course_service.create_course(db, course_in=course_in, instructor_id=current_user.id)
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

@router.post("/{course_id}/modules", response_model=ModuleResponse)
async def create_course_module(
    *,
    db: AsyncSession = Depends(get_db),
    course_id: int,
    module_in: ModuleCreate,
) -> Any:
    """
    Add a module to a course.
    """
    module = await course_service.add_module(db, course_id=course_id, title=module_in.title, order=module_in.order)
    return module

@router.post("/modules/{module_id}/lessons", response_model=LessonResponse)
async def create_module_lesson(
    *,
    db: AsyncSession = Depends(get_db),
    module_id: int,
    lesson_in: LessonCreate,
) -> Any:
    """
    Add a lesson to a module.
    """
    if lesson_in.module_id != module_id:
        raise HTTPException(status_code=400, detail="Module ID mismatch")
    lesson = await course_service.create_lesson(db, lesson_in=lesson_in)
    return lesson

@router.get("/{course_id}/structure", response_model=CourseResponse)
async def read_course_structure(
    *,
    db: AsyncSession = Depends(get_db),
    course_id: int,
) -> Any:
    """
    Get course with all modules and lessons.
    """
    course = await course_service.get_course_structure(db, course_id=course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course
