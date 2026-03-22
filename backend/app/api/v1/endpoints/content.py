from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.schemas.content import (
    QuizCreate, QuizResponse, QuizQuestionCreate, QuizQuestionResponse,
    QuizAttemptCreate, QuizAttemptResponse
)
from app.services.content import quiz_service
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
    if quiz_id != attempt_in.quiz_id:
        raise HTTPException(status_code=400, detail="Quiz ID mismatch")
    return await quiz_service.submit_attempt(db, current_user.id, attempt_in)

@router.get("/{quiz_id}/attempts", response_model=List[QuizAttemptResponse])
async def get_my_attempts(
    quiz_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return await quiz_attempt_repository.get_user_attempts(db, quiz_id, current_user.id)
