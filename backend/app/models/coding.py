from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.models.base import Base


class CodingExercise(Base):
    __tablename__ = "coding_exercises"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False, unique=True)
    
    language = Column(String(50), nullable=False, default='python')  # python|js|java|cpp|...
    starter_code = Column(Text)
    solution_code = Column(Text)
    instructions = Column(Text)
    test_cases = Column(JSONB)  # [{input, expected_output, is_hidden}]
    
    time_limit_ms = Column(Integer, default=5000)
    memory_limit_mb = Column(Integer, default=128)

    # Relationships
    lesson = relationship("Lesson")


class CodeSubmission(Base):
    __tablename__ = "code_submissions"

    id = Column(Integer, primary_key=True, index=True)
    exercise_id = Column(Integer, ForeignKey("coding_exercises.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    code = Column(Text, nullable=False)
    language = Column(String(50))
    status = Column(String(50))  # accepted|wrong_answer|time_limit|runtime_error
    output = Column(Text)
    score = Column(Integer, default=0)
    
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    exercise = relationship("CodingExercise")
    user = relationship("User")
