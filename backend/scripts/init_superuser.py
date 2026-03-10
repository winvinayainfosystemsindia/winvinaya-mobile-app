import asyncio
import sys
import os

# Add the project root to sys.path to allow imports from app
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(project_root)

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv(os.path.join(project_root, ".env"))

from sqlalchemy import select
from app.db.session import SessionLocal
from app.models.user import User, UserRole
from app.core.security import hash_password

async def create_superuser():
    email = "dharanidaran.a@winvinaya.com"
    password = "Testpass@123"
    full_name = "Dharanidaran Annadurai"
    
    async with SessionLocal() as session:
        # Check if user already exists
        result = await session.execute(select(User).where(User.email == email))
        user = result.scalars().first()
        
        if user:
            print(f"User with email {email} already exists.")
            # Update to superuser if not already
            if not user.is_superuser or user.role != UserRole.admin:
                user.is_superuser = True
                user.role = UserRole.admin
                user.full_name = full_name
                user.is_active = True
                user.is_verified = True
                await session.commit()
                print(f"Updated existing user {email} to superuser/admin.")
            return

        # Create new superuser
        new_user = User(
            email=email,
            hashed_password=hash_password(password),
            full_name=full_name,
            role=UserRole.admin,
            is_superuser=True,
            is_active=True,
            is_verified=True
        )
        
        session.add(new_user)
        try:
            await session.commit()
            print(f"Superuser created successfully: {email}")
        except Exception as e:
            await session.rollback()
            print(f"Error creating superuser: {e}")

if __name__ == "__main__":
    asyncio.run(create_superuser())
