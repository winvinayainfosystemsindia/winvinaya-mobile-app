from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.db.session import get_db
from app.models.rating import CourseRating
from app.schemas.course import (
    CourseResponse, CourseCreate, CourseUpdate,
    ModuleResponse, ModuleCreate, ModuleUpdate,
    LessonResponse, LessonCreate, LessonUpdate
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

@router.patch("/{course_id}", response_model=CourseResponse)
async def update_course(
    *,
    db: AsyncSession = Depends(get_db),
    course_id: int,
    course_in: CourseUpdate,
) -> Any:
    """
    Update a course.
    """
    course = await course_service.update_course(db, course_id=course_id, course_in=course_in)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@router.patch("/modules/{module_id}", response_model=ModuleResponse)
async def update_course_module(
    *,
    db: AsyncSession = Depends(get_db),
    module_id: int,
    module_in: ModuleUpdate,
) -> Any:
    """
    Update a module.
    """
    module = await course_service.update_module(db, module_id=module_id, module_in=module_in)
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    return module

@router.patch("/lessons/{lesson_id}", response_model=LessonResponse)
async def update_module_lesson(
    *,
    db: AsyncSession = Depends(get_db),
    lesson_id: int,
    lesson_in: LessonUpdate,
) -> Any:
    """
    Update a lesson.
    """
    lesson = await course_service.update_lesson(db, lesson_id=lesson_id, lesson_in=lesson_in)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return lesson
