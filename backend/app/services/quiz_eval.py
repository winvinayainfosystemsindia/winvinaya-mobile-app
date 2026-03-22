from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.content import Quiz, QuizQuestion, QuizQuestionType


class QuizEvalService:
    @staticmethod
    async def evaluate_attempt(db: AsyncSession, quiz: Quiz, user_answers: Dict[int, Any]) -> Dict[str, Any]:
        """
        Evaluates a quiz attempt and returns score and detailed results.
        user_answers: {question_id: answer_content}
        """
        results = []
        total_points = 0
        earned_points = 0

        # Fetch questions if not loaded
        # Note: assuming quiz.questions is already pre-fetched or using select
        stmt = select(QuizQuestion).filter(QuizQuestion.quiz_id == quiz.id)
        result = await db.execute(stmt)
        questions = result.scalars().all()

        for q in questions:
            total_points += q.points
            user_answer = user_answers.get(str(q.id)) or user_answers.get(q.id)
            
            is_correct = False
            points_earned = 0
            
            if user_answer is not None:
                is_correct, points_earned = await QuizEvalService._score_question(db, q, user_answer)
            
            earned_points += points_earned
            
            results.append({
                "question_id": q.id,
                "user_answer": user_answer,
                "correct_answer": q.correct_answer,
                "is_correct": is_correct,
                "points_earned": points_earned,
                "explanation": q.explanation
            })

        score_percent = (earned_points / total_points * 100) if total_points > 0 else 0
        passed = score_percent >= (quiz.pass_score or 0)

        return {
            "score": score_percent,
            "passed": passed,
            "earned_points": earned_points,
            "total_points": total_points,
            "detail": results
        }

    @staticmethod
    async def _score_question(db: AsyncSession, question: QuizQuestion, user_answer: Any) -> (bool, int):
        q_type = question.question_type
        correct = question.correct_answer
        
        # 1. MCQ or True/False
        if q_type in [QuizQuestionType.mcq, QuizQuestionType.true_false]:
            if str(user_answer).strip().lower() == str(correct).strip().lower():
                return True, question.points
        
        # 2. Fill in the Blank (FIB)
        elif q_type == QuizQuestionType.fill_in_blank:
            if str(user_answer).strip().lower() == str(correct).strip().lower():
                return True, question.points

        # 3. Match the Following
        elif q_type == QuizQuestionType.match_the_following:
            import json
            try:
                correct_map = json.loads(correct) if isinstance(correct, str) else correct
                if user_answer == correct_map:
                    return True, question.points
            except:
                pass

        # 4. Comprehensive
        elif q_type == QuizQuestionType.comprehensive:
            if str(user_answer).strip().lower() == str(correct).strip().lower():
                return True, question.points

        return False, 0
