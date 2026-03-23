from typing import List, Any, Dict
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.schemas.content import (
    QuizCreate, QuizUpdate, QuizResponse, QuizQuestionCreate, QuizQuestionResponse,
    QuizAttemptCreate, QuizAttemptResponse
)
from app.services.content import quiz_service
from app.services.ppt_service import ppt_service
from app.services.code_runner_service import code_runner_service
from app.services.storage import storage_service
from app.models.coding import CodingExercise
from app.models.interaction import InteractiveVideoMarker
from app.models.discussion import LessonDiscussion
from app.repositories.content import quiz_repository, quiz_attempt_repository

router = APIRouter()

@router.post("/", response_model=QuizResponse)
async def create_quiz(
    quiz_in: QuizCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Verify user is instructor/admin if needed
    return await quiz_service.create_quiz(db, quiz_in)

@router.get("/{quiz_id}", response_model=QuizResponse)
async def get_quiz(
    quiz_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    quiz = await quiz_repository.get(db, quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz

@router.get("/lesson/{lesson_id}", response_model=QuizResponse)
async def get_quiz_by_lesson(
    lesson_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    quiz = await quiz_repository.get_by_lesson(db, lesson_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found for this lesson")
    return quiz

@router.patch("/{quiz_id}", response_model=QuizResponse)
async def update_quiz(
    quiz_id: int,
    quiz_in: QuizUpdate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return await quiz_service.update_quiz(db, quiz_id, quiz_in)

@router.post("/{quiz_id}/questions", response_model=QuizQuestionResponse)
async def add_question(
    quiz_id: int,
    question_in: QuizQuestionCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return await quiz_service.add_question(db, quiz_id, question_in)

@router.post("/{quiz_id}/submit", response_model=QuizAttemptResponse)
async def submit_quiz(
    quiz_id: int,
    attempt_in: QuizAttemptCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return await quiz_service.submit_attempt(db, current_user.id, attempt_in)

@router.get("/{quiz_id}/attempts", response_model=List[QuizAttemptResponse])
async def get_my_attempts(
    quiz_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return await quiz_attempt_repository.get_user_attempts(db, quiz_id, current_user.id)


@router.get("/lesson/{lesson_id}/slides", response_model=List[Any])
async def get_lesson_slides(
    lesson_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Fetch all slides for a PPT lesson."""
    slides = await ppt_service.get_slides_by_lesson(db, lesson_id)
    # Enhance with image URLs
    result = []
    for s in slides:
        result.append({
            "id": s.id,
            "slide_no": s.slide_no,
            "notes": s.notes,
            "image_url": storage_service.get_url(s.image.storage_path) if s.image else None
        })
    return result


@router.get("/lesson/{lesson_id}/coding", response_model=Any)
async def get_lesson_coding_exercise(
    lesson_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Fetch coding exercise detail for a lesson."""
    stmt = await db.execute(select(CodingExercise).where(CodingExercise.lesson_id == lesson_id))
    exercise = stmt.scalar_one_or_none()
    if not exercise:
        raise HTTPException(status_code=404, detail="Coding exercise not found")
    return exercise


@router.post("/coding/{exercise_id}/submit", response_model=Any)
async def submit_code(
    exercise_id: int,
    payload: Dict[str, Any] = Body(...),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Execute code against test cases and return result."""
    code = payload.get("code", "")
    return await code_runner_service.evaluate_submission(db, current_user.id, exercise_id, code)


@router.get("/lesson/{lesson_id}/markers", response_model=List[Any])
async def get_video_markers(
    lesson_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Fetch all interactive markers for a video lesson."""
    result = await db.execute(
        select(InteractiveVideoMarker)
        .where(InteractiveVideoMarker.lesson_id == lesson_id)
        .options(selectinload(InteractiveVideoMarker.quiz_question))
        .order_by(InteractiveVideoMarker.timestamp_sec)
    )
    return result.scalars().all()


@router.get("/lesson/{lesson_id}/discussions", response_model=List[Any])
async def get_lesson_discussions(
    lesson_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Fetch top-level discussions for a lesson."""
    result = await db.execute(
        select(LessonDiscussion)
        .where(LessonDiscussion.lesson_id == lesson_id, LessonDiscussion.parent_id == None)
        .options(
            selectinload(LessonDiscussion.user),
            selectinload(LessonDiscussion.replies).selectinload(LessonDiscussion.user)
        )
        .order_by(LessonDiscussion.created_at.desc())
    )
    return result.scalars().all()


@router.post("/lesson/{lesson_id}/discussions", response_model=Any)
async def create_discussion(
    lesson_id: int,
    payload: Dict[str, Any] = Body(...),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Post a new comment or reply."""
    body = payload.get("body", "")
    parent_id = payload.get("parent_id")
    
    discussion = LessonDiscussion(
        lesson_id=lesson_id,
        user_id=current_user.id,
        parent_id=parent_id,
        body=body
    )
    db.add(discussion)
    try:
        await db.commit()
        await db.refresh(discussion)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    
    # Reload with user info
    stmt = await db.execute(
        select(LessonDiscussion)
        .where(LessonDiscussion.id == discussion.id)
        .options(selectinload(LessonDiscussion.user))
    )
    return stmt.scalar_one()
