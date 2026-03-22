from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from app.models.content import QuizQuestionType

# Matching Pair Schemas
class MatchingPairBase(BaseModel):
    source_text: Optional[str] = None
    target_text: Optional[str] = None
    source_image_id: Optional[int] = None
    target_image_id: Optional[int] = None

class MatchingPairCreate(MatchingPairBase):
    pass

class MatchingPairResponse(MatchingPairBase):
    id: int
    question_id: int
    class Config:
        from_attributes = True

# Quiz Question Schemas
class QuizQuestionBase(BaseModel):
    question_text: str
    question_type: QuizQuestionType = QuizQuestionType.mcq
    options: Optional[List[Dict[str, Any]]] = None # e.g. [{"key": "a", "text": "Option A"}]
    correct_answer: str
    explanation: Optional[str] = None
    image_id: Optional[int] = None
    order: int = 0
    points: int = 1

class QuizQuestionCreate(QuizQuestionBase):
    matching_pairs: Optional[List[MatchingPairCreate]] = None

class QuizQuestionUpdate(BaseModel):
    question_text: Optional[str] = None
    question_type: Optional[QuizQuestionType] = None
    options: Optional[List[Dict[str, Any]]] = None
    correct_answer: Optional[str] = None
    explanation: Optional[str] = None
    image_id: Optional[int] = None
    order: Optional[int] = None
    points: Optional[int] = None
    matching_pairs: Optional[List[MatchingPairCreate]] = None

class QuizQuestionResponse(QuizQuestionBase):
    id: int
    quiz_id: int
    matching_pairs: List[MatchingPairResponse] = []
    class Config:
        from_attributes = True

# Quiz Schemas
class QuizBase(BaseModel):
    title: str
    description: Optional[str] = None
    pass_score: float = 60.0
    time_limit_minutes: Optional[int] = None
    max_attempts: int = 3

class QuizCreate(QuizBase):
    lesson_id: int
    questions: Optional[List[QuizQuestionCreate]] = None

class QuizUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    pass_score: Optional[float] = None
    time_limit_minutes: Optional[int] = None
    max_attempts: Optional[int] = None
    questions: Optional[List[QuizQuestionCreate]] = None

class QuizResponse(QuizBase):
    id: int
    lesson_id: int
    questions: List[QuizQuestionResponse] = []
    created_at: datetime
    updated_at: Optional[datetime] = None
    class Config:
        from_attributes = True

# Quiz Attempt Schemas
class QuizAttemptBase(BaseModel):
    answers: Dict[int, Any] # question_id: user_answer

class QuizAttemptCreate(QuizAttemptBase):
    quiz_id: int

class QuizAttemptResponse(BaseModel):
    id: int
    quiz_id: int
    user_id: int
    answers: Optional[Dict[str, Any]] = None
    score: Optional[float] = None
    passed: Optional[bool] = None
    attempt_number: int
    result_detail: Optional[List[Dict[str, Any]]] = None
    started_at: datetime
    submitted_at: Optional[datetime] = None
    class Config:
        from_attributes = True

# Assignment Schemas
class AssignmentBase(BaseModel):
    title: str
    description: Optional[str] = None
    due_days: int = 7
    max_score: int = 100

class AssignmentCreate(AssignmentBase):
    lesson_id: int

class AssignmentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_days: Optional[int] = None
    max_score: Optional[int] = None

class AssignmentResponse(AssignmentBase):
    id: int
    lesson_id: int
    created_at: datetime
    class Config:
        from_attributes = True
