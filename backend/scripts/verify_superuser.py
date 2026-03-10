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
from app.models.user import User

async def verify_superuser():
    email = "dharanidaran.a@winvinaya.com"
    
    async with SessionLocal() as session:
        result = await session.execute(select(User).where(User.email == email))
        user = result.scalars().first()
        
        if user:
            print(f"VERIFICATION SUCCESS: User {email} exists.")
            print(f"Name: {user.full_name}")
            print(f"Role: {user.role}")
            print(f"Is Superuser: {user.is_superuser}")
            print(f"Is Active: {user.is_active}")
            print(f"Is Verified: {user.is_verified}")
        else:
            print(f"VERIFICATION FAILED: User {email} does not exist.")

if __name__ == "__main__":
    asyncio.run(verify_superuser())
