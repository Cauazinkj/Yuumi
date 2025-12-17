from sqlalchemy.orm import Session
from sqlalchemy import select
from fastapi import HTTPException, status
import logging

logger = logging.getLogger(__name__)

from app.models.user import User
from app.schemas.user import UserCreateSchema, UserReadSchema
from app.core.security import hash_password

class UserService:

    @staticmethod
    def create_user(db: Session, data: UserCreateSchema) -> UserReadSchema:
        try:
            logger.info(f"Tentando criar usuário com email: {data.email}")
            
            query = select(User).where(User.email == data.email)
            existing = db.execute(query).scalar_one_or_none()

            if existing:
                logger.warning(f"Email já em uso: {data.email}")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email já está em uso."
                )

            hashed = hash_password(data.password)
            logger.info("Senha hash gerada com sucesso")

            new_user = User(
                name=data.name,
                email=data.email,
                password_hash=hashed
            )

            db.add(new_user)
            db.commit()
            db.refresh(new_user)
            
            logger.info(f"Usuário criado com ID: {new_user.id}")
            
            return UserReadSchema.model_validate(new_user)
            
        except Exception as e:
            logger.error(f"Erro ao criar usuário: {str(e)}", exc_info=True)
            db.rollback()
            raise