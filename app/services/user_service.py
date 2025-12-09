from sqlalchemy.orm import Session
from sqlalchemy import select
from fastapi import HTTPException, status

from app.models.user import User
from app.schemas.user import UserCreateSchema, UserReadSchema
from app.core.security import hash_password

class UserService:

    @staticmethod
    def create_user(db: Session, data: UserCreateSchema) -> UserReadSchema:

        query = select(User).where(User.email == data.email)
        existing = db.execute(query).scalar_one_or_none()

        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email já está em uso."
            )

        hashed = hash_password(data.password)

        new_user = User(
            name=data.name,
            email=data.email,
            password_hash=hashed
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return UserReadSchema.model_validate(new_user)
