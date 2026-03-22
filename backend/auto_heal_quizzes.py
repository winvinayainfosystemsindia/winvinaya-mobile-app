import sys
import os
from sqlalchemy import create_engine, text

# Add current dir to path
sys.path.append(os.getcwd())

from app.core.config import settings

def auto_heal_quizzes():
    print(f"Auto-healing quizzes on: {settings.SYNC_DATABASE_URL}")
    engine = create_engine(settings.SYNC_DATABASE_URL)
    with engine.connect() as conn:
        # 1. Find lessons of type 'quiz' that have no quiz record
        query = text("""
            SELECT l.id, l.title 
            FROM lessons l 
            LEFT JOIN quizzes q ON l.id = q.lesson_id 
            WHERE l.content_type = 'quiz' AND q.id IS NULL
        """)
        result = conn.execute(query)
        missing = result.all()
        
        if not missing:
            print("No missing quizzes found. System is healthy.")
            return

        print(f"Found {len(missing)} lessons missing quizzes: {missing}")

        for lesson_id, title in missing:
            print(f"Repairing lesson {lesson_id} ('{title}')...")
            conn.execute(text(f"INSERT INTO quizzes (lesson_id, title, pass_score, max_attempts) VALUES ({lesson_id}, 'Quiz: {title}', 80, 3)"))
            conn.commit()
            
            # Get new id
            res = conn.execute(text(f"SELECT id FROM quizzes WHERE lesson_id = {lesson_id}"))
            quiz_id = res.scalar()
            
            # Add a welcome question
            conn.execute(text(f"INSERT INTO quiz_questions (quiz_id, question_text, question_type, correct_answer, points, \"order\", shuffle_options) VALUES ({quiz_id}, 'Welcome to the quiz! Is this lesson ready?', 'true_false', 'true', 1, 0, true)"))
            conn.commit()
            print(f"Created default quiz for lesson {lesson_id} (Quiz ID: {quiz_id})")

if __name__ == "__main__":
    auto_heal_quizzes()
