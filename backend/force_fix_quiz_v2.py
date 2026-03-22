import asyncio
import sys
import os

# Add current dir to path to import app
sys.path.append(os.getcwd())

from sqlalchemy import select
from app.db.session import SessionLocal
from app.models.course import Lesson
from app.models.content import Quiz, QuizQuestion, QuizQuestionType

async def force_fix():
    print("Connecting to DB...")
    async with SessionLocal() as db:
        try:
            # 1. List all lessons to see what's there
            result = await db.execute(select(Lesson.id, Lesson.title))
            lessons = result.all()
            print(f"Available lessons: {lessons}")

            # 2. Check if lesson 4 exists
            result = await db.execute(select(Lesson).filter(Lesson.id == 4))
            lesson = result.scalars().first()
            if not lesson:
                print("ERROR: Lesson with ID 4 not found!")
                # Try lesson 1 if it exists
                if lessons:
                   target_id = lessons[0].id
                   print(f"I see lesson {target_id}. I'll use that for the fix if you prefer, but I'll stop for now.")
                return

            print(f"Found lesson 4: {lesson.title}")

            # 3. Create or Update Quiz
            result = await db.execute(select(Quiz).filter(Quiz.lesson_id == 4))
            quiz = result.scalars().first()
            if not quiz:
                print("Creating new quiz for lesson 4...")
                quiz = Quiz(
                    lesson_id=4,
                    title="Manual Fix Quiz",
                    description="Forcefully created",
                    pass_score=80
                )
                db.add(quiz)
                await db.flush()
            else:
                print("Quiz already exists, updating...")
            
            # 4. Add a question
            # Clear existing logic if needed or just add one
            question = QuizQuestion(
                quiz_id=quiz.id,
                question_text="Is the API working now?",
                question_type=QuizQuestionType.true_false,
                correct_answer="true",
                points=1,
                order=0
            )
            db.add(question)
            
            await db.commit()
            print(f"DONE. Quiz ID {quiz.id} is now linked to Lesson 4.")
            
        except Exception as e:
            print(f"EXCEPTION: {str(e)}")
            await db.rollback()

if __name__ == "__main__":
    asyncio.run(force_fix())
