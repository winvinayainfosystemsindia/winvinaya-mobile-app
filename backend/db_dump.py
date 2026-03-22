import sys
import os
from sqlalchemy import create_engine, text

# Add current dir to path
sys.path.append(os.getcwd())

from app.core.config import settings

def dump_db():
    print(f"Dumping database: {settings.SYNC_DATABASE_URL}")
    engine = create_engine(settings.SYNC_DATABASE_URL)
    with engine.connect() as conn:
        # Check tables
        result = conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
        print(f"Tables: {[r[0] for r in result]}")

        # Check lessons
        result = conn.execute(text("SELECT id, title FROM lessons"))
        print(f"Lessons: {result.all()}")

        # Check quizzes
        result = conn.execute(text("SELECT id, lesson_id, title FROM quizzes"))
        print(f"Quizzes: {result.all()}")

if __name__ == "__main__":
    dump_db()
