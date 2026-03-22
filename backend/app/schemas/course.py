from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from uuid import UUID

from app.models.course import CourseLevel, CourseStatus

class LessonBase(BaseModel):
    title: str
    content_type: str
    media_file_id: Optional[int] = None
    text_content: Optional[str] = None
    content_url: Optional[str] = None
    order: int = 0

class LessonCreate(LessonBase):
    module_id: int

class LessonUpdate(BaseModel):
    title: Optional[str] = None
    content_type: Optional[str] = None
    media_file_id: Optional[int] = None
    text_content: Optional[str] = None
    content_url: Optional[str] = None
    order: Optional[int] = None

class LessonResponse(LessonBase):
    id: int
    module_id: int
    class Config:
        from_attributes = True

class ModuleBase(BaseModel):
    title: str
    order: int = 0

class ModuleCreate(ModuleBase):
    pass

class ModuleUpdate(BaseModel):
    title: Optional[str] = None
    order: Optional[int] = None

class ModuleResponse(ModuleBase):
    id: int
    course_id: int
    lessons: List[LessonResponse] = []
    class Config:
        from_attributes = True

class CourseBase(BaseModel):
    title: str
    description: Optional[str] = None
    short_description: Optional[str] = None
    category: Optional[str] = None
    level: Optional[CourseLevel] = CourseLevel.beginner
    language: str = "en"
    tags: Optional[str] = None
    is_free: bool = False
    price: int = 0
    require_sequential: Optional[bool] = False
    expiry_days: Optional[int] = None
    passing_score: Optional[float] = 0.0

class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    status: Optional[CourseStatus] = None
    category: Optional[str] = None
    level: Optional[CourseLevel] = None
    tags: Optional[str] = None
    is_featured: Optional[bool] = None
    is_free: Optional[bool] = None
    price: Optional[int] = None

class CourseCreate(CourseBase):
    instructor_id: Optional[int] = None

class CourseResponse(CourseBase):
    id: int
    public_id: UUID
    slug: Optional[str] = None
    status: CourseStatus
    thumbnail_url: Optional[str] = None
    duration_minutes: int
    instructor_id: int
    is_featured: bool
    rating_avg: Optional[float] = 0.0
    rating_count: Optional[int] = 0
    created_at: datetime
    modules: List[ModuleResponse] = []
    class Config:
        from_attributes = True
