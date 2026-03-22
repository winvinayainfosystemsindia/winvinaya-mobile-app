from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.models.base import Base


class InteractiveVideoMarker(Base):
    __tablename__ = "interactive_video_markers"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    
    marker_type = Column(String(50), nullable=False)  # 'chapter' | 'question' | 'pause'
    timestamp_sec = Column(Integer, nullable=False)
    title = Column(String(500))
    
    quiz_question_id = Column(Integer, ForeignKey("quiz_questions.id"), nullable=True)
    order = Column(Integer, default=0)

    # Relationships
    lesson = relationship("Lesson")
    quiz_question = relationship("QuizQuestion")
