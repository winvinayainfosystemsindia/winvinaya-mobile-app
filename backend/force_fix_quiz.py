import asyncio
from sqlalchemy import select
from app.db.session import SessionLocal
from app.models.course import Lesson
from app.models.content import Quiz, QuizQuestion, QuizQuestionType

async def force_fix():
    async with SessionLocal() as db:
        # 1. Check if lesson 4 exists
        result = await db.execute(select(Lesson).filter(Lesson.id == 4))
        lesson = result.scalars().first()
        if not lesson:
            print("ERROR: Lesson with ID 4 not found!")
            return

        print(f"Found lesson: {lesson.title}")

        # 2. Check if quiz already exists
        result = await db.execute(select(Quiz).filter(Quiz.lesson_id == 4))
        quiz = result.scalars().first()
        if quiz:
            print(f"Quiz already exists for lesson 4 (ID: {quiz.id})")
            return

        # 3. Create Quiz
        quiz = Quiz(
            lesson_id=4,
            title="Lesson 4 Quiz",
            description="Manually created quiz to fix 404",
            pass_score=80,
            max_attempts=3
        )
        db.add(quiz)
        await db.flush()

        # 4. Add a dummy question
        question = QuizQuestion(
            quiz_id=quiz.id,
            question_text="Is Phase 1 complete?",
            question_type=QuizQuestionType.true_false,
            correct_answer="true",
            points=1,
            order=0
        )
        db.add(question)
        
        await db.commit()
        print(f"SUCCESS: Created quiz for lesson 4 (Quiz ID: {quiz.id})")

if __name__ == "__main__":
    asyncio.run(force_fix())
