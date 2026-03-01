from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user import user_repository
from app.schemas.user import UserCreate, UserUpdate
from app.models.user import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password: str) -> str:
        return pwd_context.hash(password)

    async def get_user(self, db: AsyncSession, user_id: int) -> Optional[User]:
        return await user_repository.get(db, id=user_id)

    async def get_users(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[User]:
        return await user_repository.get_multi(db, skip=skip, limit=limit)

    async def create_user(self, db: AsyncSession, *, user_in: UserCreate) -> User:
        user_in.password = self.get_password_hash(user_in.password)
        # We need to handle the mapping manually if the schema names differ from model names
        # But here they match pretty well, just need to rename password to hashed_password
        user_data = user_in.model_dump(exclude={"password"})
        user_data["hashed_password"] = user_in.password
        
        db_obj = User(**user_data)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

user_service = UserService()
