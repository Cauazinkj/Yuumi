from sqlalchemy.orm import Session
from sqlalchemy import select
from fastapi import HTTPException, status
import logging

logger = logging.getLogger(__name__)

from app.models.user import User
from app.schemas.user import UserCreateSchema, UserReadSchema, UserUpdateSchema
from app.core.security import hash_password

class UserService:

    ## criar usuario
    @staticmethod
    def create_user(db: Session, 
                    data: UserCreateSchema
                    ) -> UserReadSchema:
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
    
    ## deletar usuario
    @staticmethod
    def delete_user(db: Session, 
                    user_id: int
                    ) -> None:

        try:
            logger.info(f"Buscando usuario com id {user_id} para exclusao...")
            user = db.query(User).filter(User.id == user_id).first()

            if not user:
                logger.warning(f"Usuario com id {user_id} nao encontrado para exclusao.")

                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"User with ID {user_id} not found."
                )
            
            # Adiciono aqui mais verificações se necessário, como dependências ou relacionamentos

            logger.info(f"✅ Usuário encontrado: {user.name} ({user.email})")

            db.delete(user)
            logger.info(f"Marcado para deleção, fazendo commit...")

            db.commit()
            logger.info(f"Usuário ID {user_id} deletado com sucesso!")

        except Exception as e:
            logger.error(f"Erro ao deletar usuario com ID {user_id}: {str(e)}", exc_info=True)
            db.rollback()

            if not isinstance(e, HTTPException):
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Erro interno ao deletar usuario com ID {user_id}"
                )
            raise e

        except Exception as e:
            logger.error(f"Erro ao deletar usuario com ID {user_id}: {str(e)}", exc_info=True)
            db.rollback()

            if not isinstance(e, HTTPException):
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Erro interno ao deletar usuario com ID {user_id}"
                )
            raise e
        
    ## buscar usuarios
    @staticmethod
    def get_user(db: Session,
                skip: int = 0, 
                limit: int = 100
                ) -> list[UserReadSchema]:
        
        try: 
            logger.info(f"Listando usuarios (skip={skip}, limit={limit})")

            users = db.query(User).offset(skip).limit(limit).all()
            logger.info(f"✅ Encontrados {len(users)} usuário(s)")

            return [UserReadSchema.model_validate(user) for user in users]
        
        except Exception as e:
            logger.error(f"Erro ao listar usuarios: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro interno ao listar usuarios: {str(e)}"
            )
        
    ## buscar usuario por id
    @staticmethod
    def get_user_by_id(db: Session, 
                       user_id: int
                       ) -> UserReadSchema:
        try:
            logger.info(f"Buscando usuario com id {user_id}...")
            
            user = db.query(User).filter(User.id == user_id).first()

            if not user:
                logger.warning(f"Usuario com id {user_id} nao encontrado.")
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Usuario com ID {user_id} nao encontrado."
                )
            
            logger.info(f"✅ Usuário encontrado: {user.name} ({user.email})")
            return UserReadSchema.model_validate(user)
        
        except HTTPException as e:
            raise
        except Exception as e:
            logger.error(f"Erro ao buscar usuario com ID {user_id}: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro interno ao buscar usuario: {str(e)}"
            )

    @staticmethod
    def update_user(db: Session, 
                    user_id: int,
                    user_data: UserUpdateSchema
                    ) -> UserReadSchema:
        try:
            logger.info(f"Iniciado atualizacoes do usuario de ID: {user_id}")
            logger.info(f"Dados recebidos: {user_data.model_dump(exclude_unset=True)}")

            user_to_update = db.query(User).filter(User.id == user_id).first()

            if not user_to_update:
                logger.warning(f"Usuario com ID {user_id} nao encontrado para atualizacao.")
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Usuario com ID {user_id} nao encontrado."
                )
            
            logger.info(f"Usuario encontrado: {user_to_update.name} ({user_to_update.email})")

            if user_data.email is not None and user_data.email != user_to_update.email:
                logger.info(f"validando novo email: {user_data.email}")

                existing_user = db.query(User).filter(
                    User.email == user_data.email,
                    User.id != user_id
                ).first()

                if existing_user:
                    logger.warning(f"Email {user_data.email} ja esta em uso por outro usuario ID {existing_user.id}")
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"O email {user_data.email} ja esta em uso por outro usuario."
                    )
            update_data = user_data.model_dump(exclude_unset=True)
            logger.info(f"Campo a atualizar: {list(update_data.keys())}")

            if "name" in update_data:
                old_name = user_to_update.name
                user_to_update.name = update_data["name"]
                logger.info(f"Nome: {old_name} -> {user_to_update.name}")

            if "email" in update_data:
                old_email = user_to_update.email
                user_to_update.email = update_data["email"]
                logger.info(f"Email: {old_email} -> {user_to_update.email}")
            
            if "password" in update_data:
                hashed_password = hash_password(update_data["password"])
                user_to_update.password_hash = hashed_password
                logger.info(f"Senha atualizada com sucesso para o usuario ID {user_id}")
        
            db.commit()
            db.refresh(user_to_update)

            logger.info(f"Usuario com ID {user_id} atualizado com sucesso!")

            return UserReadSchema.model_validate(user_to_update)

        except HTTPException:
            logger.error(f"Erro HTTP durante atualizacao do usuario {user_id}")
            db.rollback()
            raise

        except Exception as e:
            logger.error(f"Erro inesperado ao atualizar usuario com ID {user_id}: {str(e)}", exc_info=True)
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro interno ao atualizar usuario: {str(e)}"
            )
