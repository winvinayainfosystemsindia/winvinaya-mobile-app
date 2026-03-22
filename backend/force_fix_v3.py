import sys
import os
from sqlalchemy import create_engine, text

# Add current dir to path
sys.path.append(os.getcwd())

from app.core.config import settings

def force_fix_v3():
    print(f"Force fixing lesson 4 on: {settings.SYNC_DATABASE_URL}")
    engine = create_engine(settings.SYNC_DATABASE_URL)
    with engine.connect() as conn:
        # 1. Delete existing quiz 4
        conn.execute(text("DELETE FROM quiz_attempts WHERE quiz_id IN (SELECT id FROM quizzes WHERE lesson_id = 4)"))
        conn.execute(text("DELETE FROM quiz_questions WHERE quiz_id IN (SELECT id FROM quizzes WHERE lesson_id = 4)"))
        conn.execute(text("DELETE FROM quizzes WHERE lesson_id = 4"))
        conn.commit()
        print("Deleted existing quiz for lesson 4.")

        # 2. Re-insert
        conn.execute(text("INSERT INTO quizzes (lesson_id, title, pass_score, max_attempts) VALUES (4, 'Lesson 4 Final Quiz', 80, 3)"))
        conn.commit()
        
        # Get new id
        result = conn.execute(text("SELECT id FROM quizzes WHERE lesson_id = 4"))
        quiz_id = result.scalar()
        print(f"Created new quiz with ID: {quiz_id}")

        # 3. Add a question
        conn.execute(text(f"INSERT INTO quiz_questions (quiz_id, question_text, question_type, correct_answer, points, \"order\", shuffle_options) VALUES ({quiz_id}, 'Is it fixed?', 'true_false', 'true', 1, 0, true)"))
        conn.commit()
        print("Added question.")

if __name__ == "__main__":
    force_fix_v3()
