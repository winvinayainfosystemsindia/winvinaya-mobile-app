"""
Alembic migration: add_performance_indexes_and_oauth_columns

Adds (all with IF NOT EXISTS to be idempotent):
  1. Targeted indexes on high-traffic FK and filter columns
  2. Composite indexes on (enrollments.user_id, enrollments.course_id) etc.
  3. OAuth columns on users (oauth_provider, oauth_provider_id)
  4. Make users.hashed_password nullable (for OAuth-only users)
"""
from alembic import op
import sqlalchemy as sa

revision = "a1b2c3d4e5f6"
down_revision = "5b9572c93398"
branch_labels = None
depends_on = None


def _create_index(name, table, columns, unique=False):
    """Create index only if it doesn't already exist."""
    op.execute(
        f"CREATE {'UNIQUE ' if unique else ''}INDEX IF NOT EXISTS {name} ON {table} ({', '.join(columns)})"
    )


def upgrade() -> None:

    # ── Users: OAuth columns ───────────────────────────────────────────────────
    # Use raw SQL with IF NOT EXISTS for column additions (safe to re-run)
    op.execute("ALTER TABLE users ALTER COLUMN hashed_password DROP NOT NULL")
    op.execute("""
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                           WHERE table_name='users' AND column_name='oauth_provider') THEN
                ALTER TABLE users ADD COLUMN oauth_provider VARCHAR(50);
            END IF;
        END $$;
    """)
    op.execute("""
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                           WHERE table_name='users' AND column_name='oauth_provider_id') THEN
                ALTER TABLE users ADD COLUMN oauth_provider_id VARCHAR(255);
            END IF;
        END $$;
    """)
    _create_index("ix_users_oauth_provider", "users", ["oauth_provider"])
    _create_index("ix_users_oauth_provider_id", "users", ["oauth_provider_id"])

    # ── Courses ────────────────────────────────────────────────────────────────
    _create_index("ix_courses_category", "courses", ["category"])
    _create_index("ix_courses_status", "courses", ["status"])
    _create_index("ix_courses_instructor_id", "courses", ["instructor_id"])
    _create_index("ix_courses_is_featured", "courses", ["is_featured"])
    _create_index("ix_courses_status_category", "courses", ["status", "category"])

    # ── Modules ────────────────────────────────────────────────────────────────
    _create_index("ix_modules_course_id", "modules", ["course_id"])
    _create_index("ix_modules_order", "modules", ['"order"'])

    # ── Lessons ────────────────────────────────────────────────────────────────
    _create_index("ix_lessons_module_id", "lessons", ["module_id"])
    _create_index("ix_lessons_content_type", "lessons", ["content_type"])
    _create_index("ix_lessons_media_file_id", "lessons", ["media_file_id"])
    _create_index("ix_lessons_module_preview", "lessons", ["module_id", "is_free_preview"])

    # ── Enrollments ────────────────────────────────────────────────────────────
    _create_index("ix_enrollments_user_id", "enrollments", ["user_id"])
    _create_index("ix_enrollments_course_id", "enrollments", ["course_id"])
    _create_index("ix_enrollments_status", "enrollments", ["status"])
    _create_index("ix_enrollments_user_course", "enrollments", ["user_id", "course_id"], unique=True)

    # ── Media files ────────────────────────────────────────────────────────────
    _create_index("ix_media_files_uploaded_by", "media_files", ["uploaded_by"])
    _create_index("ix_media_files_media_type", "media_files", ["media_type"])
    _create_index("ix_media_files_status", "media_files", ["status"])
    _create_index("ix_media_files_type_status", "media_files", ["media_type", "status"])

    # ── Progress ───────────────────────────────────────────────────────────────
    _create_index("ix_lesson_progress_user_id", "lesson_progress", ["user_id"])
    _create_index("ix_lesson_progress_lesson_id", "lesson_progress", ["lesson_id"])
    _create_index("ix_lesson_progress_user_lesson", "lesson_progress", ["user_id", "lesson_id"], unique=True)
    _create_index("ix_course_progress_user_id", "course_progress", ["user_id"])
    _create_index("ix_course_progress_course_id", "course_progress", ["course_id"])


def downgrade() -> None:
    # Drop in reverse order – all use DROP INDEX IF EXISTS
    for idx in [
        "ix_course_progress_course_id", "ix_course_progress_user_id",
        "ix_lesson_progress_user_lesson", "ix_lesson_progress_lesson_id", "ix_lesson_progress_user_id",
        "ix_media_files_type_status", "ix_media_files_status", "ix_media_files_media_type", "ix_media_files_uploaded_by",
        "ix_enrollments_user_course", "ix_enrollments_status", "ix_enrollments_course_id", "ix_enrollments_user_id",
        "ix_lessons_module_preview", "ix_lessons_media_file_id", "ix_lessons_content_type", "ix_lessons_module_id",
        "ix_modules_order", "ix_modules_course_id",
        "ix_courses_status_category", "ix_courses_is_featured", "ix_courses_instructor_id",
        "ix_courses_status", "ix_courses_category",
        "ix_users_oauth_provider_id", "ix_users_oauth_provider",
    ]:
        op.execute(f"DROP INDEX IF EXISTS {idx}")

    op.execute("""
        DO $$
        BEGIN
            IF EXISTS (SELECT 1 FROM information_schema.columns
                       WHERE table_name='users' AND column_name='oauth_provider_id') THEN
                ALTER TABLE users DROP COLUMN oauth_provider_id;
            END IF;
        END $$;
    """)
    op.execute("""
        DO $$
        BEGIN
            IF EXISTS (SELECT 1 FROM information_schema.columns
                       WHERE table_name='users' AND column_name='oauth_provider') THEN
                ALTER TABLE users DROP COLUMN oauth_provider;
            END IF;
        END $$;
    """)
