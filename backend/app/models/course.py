import uuid
import enum
from sqlalchemy import (
    Column, Integer, String, Text, ForeignKey, DateTime, Enum, Boolean, Float
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.models.base import Base


class CourseStatus(str, enum.Enum):
    draft = "draft"
    published = "published"
    archived = "archived"


class CourseLevel(str, enum.Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    advanced = "advanced"


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    public_id = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True, index=True, nullable=False)

    title = Column(String(500), index=True, nullable=False)
    slug = Column(String(500), unique=True, index=True)
    description = Column(Text)
    short_description = Column(String(500))

    status = Column(Enum(CourseStatus), default=CourseStatus.draft, nullable=False)
    level = Column(Enum(CourseLevel), default=CourseLevel.beginner, nullable=False)
    language = Column(String(10), default="en")
    category = Column(String(100), index=True)
    tags = Column(String(500))  # comma-separated

    thumbnail_url = Column(String(500))
    duration_minutes = Column(Integer, default=0)  # auto-computed by Celery task

    instructor_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    is_featured = Column(Boolean, default=False)
    is_free = Column(Boolean, default=False)
    price = Column(Integer, default=0)  # in paisa/cents

    # NEW: Advanced settings
    expiry_days = Column(Integer, nullable=True)  # NULL = infinite
    require_sequential = Column(Boolean, default=False)
    passing_score = Column(Float, default=60.0)
    rating_avg = Column(Float, default=0.0)
    rating_count = Column(Integer, default=0)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    instructor = relationship("User", back_populates="courses_taught", foreign_keys=[instructor_id])
    modules = relationship("Module", back_populates="course", cascade="all, delete-orphan", order_by="Module.order")
    enrollments = relationship("Enrollment", back_populates="course", cascade="all, delete-orphan")
    course_progress = relationship("CourseProgress", back_populates="course", cascade="all, delete-orphan")
    certificates = relationship("Certificate", back_populates="course", cascade="all, delete-orphan")
    announcements = relationship("Announcement", back_populates="course", cascade="all, delete-orphan")


class Module(Base):
    __tablename__ = "modules"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), index=True, nullable=False)
    description = Column(Text)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    order = Column(Integer, default=0)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    course = relationship("Course", back_populates="modules")
    lessons = relationship("Lesson", back_populates="module", cascade="all, delete-orphan", order_by="Lesson.order")


class LessonContentType(str, enum.Enum):
    video = "video"
    document = "document"
    quiz = "quiz"
    assignment = "assignment"
    text = "text"
    ppt = "ppt"
    code = "code"
    interactive_video = "interactive_video"


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    public_id = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True, index=True, nullable=False)

    title = Column(String(500), index=True, nullable=False)
    description = Column(Text)
    module_id = Column(Integer, ForeignKey("modules.id"), nullable=False)
    content_type = Column(Enum(LessonContentType), default=LessonContentType.video, nullable=False)

    # For video/document lessons — FK to MediaFile
    media_file_id = Column(Integer, ForeignKey("media_files.id"), nullable=True)
    # For text lessons — inline content
    text_content = Column(Text, nullable=True)
    # For external/legacy links
    content_url = Column(String(500), nullable=True)

    duration_seconds = Column(Integer, default=0)  # populated by Celery after upload
    is_free_preview = Column(Boolean, default=False)
    order = Column(Integer, default=0)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    module = relationship("Module", back_populates="lessons")
    media_file = relationship("MediaFile", foreign_keys=[media_file_id])
    quiz = relationship("Quiz", back_populates="lesson", uselist=False, cascade="all, delete-orphan")
    assignment = relationship("Assignment", back_populates="lesson", uselist=False, cascade="all, delete-orphan")
    progress_records = relationship("LessonProgress", back_populates="lesson", cascade="all, delete-orphan")
