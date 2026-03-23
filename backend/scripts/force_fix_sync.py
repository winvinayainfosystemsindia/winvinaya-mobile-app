import sys
import os
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker

# Add current dir to path
sys.path.append(os.getcwd())

from app.core.config import settings
from app.models.course import Lesson
from app.models.content import Quiz, QuizQuestion, QuizQuestionType

def force_fix_sync():
    print(f"Connecting to: {settings.SYNC_DATABASE_URL}")
    engine = create_engine(settings.SYNC_DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        # 1. Check lesson
        lesson = session.query(Lesson).filter(Lesson.id == 4).first()
        if not lesson:
            print("ERROR: Lesson 4 not found in sync session.")
            # List some lessons
            others = session.query(Lesson).limit(5).all()
            print(f"Other lessons: {[(l.id, l.title) for l in others]}")
            return

        print(f"Found lesson 4: {lesson.title}")

        # 2. Check quiz
        quiz = session.query(Quiz).filter(Quiz.lesson_id == 4).first()
        if not quiz:
            print("Creating quiz...")
            quiz = Quiz(
                lesson_id=4,
                title="Force Fixed Quiz",
                pass_score=80
            )
            session.add(quiz)
            session.flush()
        else:
            print(f"Quiz already exists (ID: {quiz.id})")

        # 3. Add question if none
        if not quiz.questions:
            print("Adding question...")
            question = QuizQuestion(
                quiz_id=quiz.id,
                question_text="Synchronous fix successful?",
                question_type=QuizQuestionType.true_false,
                correct_answer="true",
                points=1
            )
            session.add(question)
        
        session.commit()
        print("SUCCESS: Lesson 4 quiz is now ready.")

    except Exception as e:
        print(f"EXCEPTION: {str(e)}")
        session.rollback()
    finally:
        session.close()

if __name__ == "__main__":
    force_fix_sync()
