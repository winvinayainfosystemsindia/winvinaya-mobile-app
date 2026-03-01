from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class LessonBase(BaseModel):
    title: str
    content_type: str
    content_url: Optional[str] = None
    order: int = 0

class LessonCreate(LessonBase):
    pass

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

class ModuleResponse(ModuleBase):
    id: int
    course_id: int
    lessons: List[LessonResponse] = []
    class Config:
        from_attributes = True

class CourseBase(BaseModel):
    title: str
    description: Optional[str] = None

class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None

class CourseCreate(CourseBase):
    pass

class CourseResponse(CourseBase):
    id: int
    instructor_id: Optional[int]
    created_at: datetime
    modules: List[ModuleResponse] = []
    class Config:
        from_attributes = True
