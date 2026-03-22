from sqlalchemy import Column, Integer, ForeignKey, Text
from sqlalchemy.orm import relationship

from app.models.base import Base


class PPTSlide(Base):
    __tablename__ = "ppt_slides"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    
    slide_no = Column(Integer, nullable=False)
    image_id = Column(Integer, ForeignKey("media_files.id"), nullable=False)
    notes = Column(Text)

    # Relationships
    lesson = relationship("Lesson")
    image = relationship("MediaFile")
