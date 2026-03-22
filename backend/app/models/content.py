import uuid
import enum
from sqlalchemy import (
    Column, Integer, String, Text, ForeignKey, DateTime, Enum, Boolean, Float
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.models.base import Base


class QuizQuestionType(str, enum.Enum):
    mcq = "mcq"
    true_false = "true_false"
    short_answer = "short_answer"
    match_the_following = "match_the_following"
    comprehensive = "comprehensive"
    fill_in_blank = "fill_in_blank"


class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False, unique=True)

    title = Column(String(500), nullable=False)
    description = Column(Text)
    pass_score = Column(Float, default=60.0)  # Percentage to pass
    time_limit_minutes = Column(Integer, nullable=True)  # None = unlimited
    max_attempts = Column(Integer, default=3)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    lesson = relationship("Lesson", back_populates="quiz")
    questions = relationship("QuizQuestion", back_populates="quiz", cascade="all, delete-orphan", order_by="QuizQuestion.order")
    attempts = relationship("QuizAttempt", back_populates="quiz", cascade="all, delete-orphan")


class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)

    question_text = Column(Text, nullable=False)
    question_type = Column(Enum(QuizQuestionType), default=QuizQuestionType.mcq, nullable=False)
    options = Column(JSONB, nullable=True)  # e.g. [{"key": "a", "text": "Option A"}, ...]
    correct_answer = Column(String(500), nullable=False)  # key or answer text
    explanation = Column(Text, nullable=True)
    image_id = Column(Integer, ForeignKey("media_files.id"), nullable=True)
    order = Column(Integer, default=0)
    points = Column(Integer, default=1)
    shuffle_options = Column(Boolean, default=True)

    quiz = relationship("Quiz", back_populates="questions")
    image = relationship("MediaFile")
    matching_pairs = relationship("MatchingPair", back_populates="question", cascade="all, delete-orphan")


class MatchingPair(Base):
    __tablename__ = "matching_pairs"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("quiz_questions.id", ondelete="CASCADE"), nullable=False)
    
    source_text = Column(String(500), nullable=True)
    target_text = Column(String(500), nullable=True)
    source_image_id = Column(Integer, ForeignKey("media_files.id"), nullable=True)
    target_image_id = Column(Integer, ForeignKey("media_files.id"), nullable=True)

    question = relationship("QuizQuestion", back_populates="matching_pairs")
    source_image = relationship("MediaFile", foreign_keys=[source_image_id])
    target_image = relationship("MediaFile", foreign_keys=[target_image_id])


class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    answers = Column(JSONB, nullable=True)  # {question_id: answer}
    score = Column(Float, nullable=True)
    passed = Column(Boolean, nullable=True)
    attempt_number = Column(Integer, default=1)
    time_taken_seconds = Column(Integer, nullable=True)
    result_detail = Column(JSONB, nullable=True)  # list of {q_id, is_correct, etc.}

    started_at = Column(DateTime(timezone=True), server_default=func.now())
    submitted_at = Column(DateTime(timezone=True), nullable=True)

    quiz = relationship("Quiz", back_populates="attempts")


class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False, unique=True)

    title = Column(String(500), nullable=False)
    description = Column(Text)
    due_days = Column(Integer, default=7)  # Days after enrollment
    max_score = Column(Integer, default=100)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    lesson = relationship("Lesson", back_populates="assignment")
    submissions = relationship("AssignmentSubmission", back_populates="assignment", cascade="all, delete-orphan")


class AssignmentSubmission(Base):
    __tablename__ = "assignment_submissions"

    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    media_file_id = Column(Integer, ForeignKey("media_files.id"), nullable=True)

    submission_text = Column(Text, nullable=True)
    score = Column(Integer, nullable=True)
    feedback = Column(Text, nullable=True)

    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    reviewed_at = Column(DateTime(timezone=True), nullable=True)

    assignment = relationship("Assignment", back_populates="submissions")
