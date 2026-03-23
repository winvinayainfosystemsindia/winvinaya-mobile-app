from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from app.models.enrollment import EnrollmentStatus


class EnrollmentCreate(BaseModel):
    user_id: int
    course_id: int


class EnrollmentUpdate(BaseModel):
    status: Optional[EnrollmentStatus] = None
    progress_percent: Optional[float] = None
    completed_at: Optional[datetime] = None


from app.schemas.course import CourseResponse


class EnrollmentResponse(BaseModel):
    id: int
    user_id: int
    course_id: int
    status: EnrollmentStatus
    progress_percent: float
    enrolled_at: datetime
    completed_at: Optional[datetime]
    course: Optional[CourseResponse] = None

    class Config:
        from_attributes = True
