from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.schemas.user import UserCreateSchema
from app.core.security import hash_password

class UserService:

    @staticmethod
    async def create_user(db: AsyncSession, data: UserCreateSchema) -> UserCreateSchema:

        query = select(User).where(User.email == data.email)
        result = await db.execute(query)
        existing = result.scalar_one_or_none()

        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email ja esta em uso."
            )
        
        hashed = hash_password(data.password)

        new_user = User(
            name=data.name,
            email=data.email,
            password_hash=hashed
        )

        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)

        return UserReadSchema.model_validate(new_user)