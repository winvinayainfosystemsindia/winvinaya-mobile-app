from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from app.models.progress import LessonProgressStatus


class LessonProgressCreate(BaseModel):
    user_id: int
    lesson_id: int
    status: LessonProgressStatus = LessonProgressStatus.not_started


class LessonProgressUpdate(BaseModel):
    status: Optional[LessonProgressStatus] = None
    watch_duration_seconds: Optional[int] = None
    score: Optional[float] = None
    completed_at: Optional[datetime] = None


class LessonProgressResponse(BaseModel):
    id: int
    user_id: int
    lesson_id: int
    status: LessonProgressStatus
    watch_duration_seconds: int
    score: Optional[float]
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True


class CourseProgressResponse(BaseModel):
    user_id: int
    course_id: int
    percent_complete: float
    lessons_completed: int
    total_lessons: int
    last_accessed_at: Optional[datetime]

    class Config:
        from_attributes = True
