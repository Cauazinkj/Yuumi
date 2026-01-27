from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from fastapi import HTTPException, status
import logging
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import verify_password
from app.models.user import User
from app.schemas.auth import TokenData

logger = logging.getLogger(__name__)


class AuthService:

    @staticmethod
    def authenticate_user(
        db: Session,
        email: str,
        password: str
    ) -> Optional[User]:
        
        try:
            logger.info(f"Tentando autenticar usuario: {email}")
            
            user = db.query(User).filter(User.email == email).first()

            if not user:
                logger.warning(f"Usuario com email {email} nao encontrado")
                return None
            
            if not verify_password(password, user.password_hash):
                logger.warning(f"Senha incorreta para usuario {email}")
                return None
            
            logger.info(f"Usuario {email} autenticado com sucesso")
            return user
        
        except Exception as e:
            logger.error(f"Erro na autenticacao: {str(e)}", exc_info=True)
            return None
        
    @staticmethod
    def create_access_token(data: dict) -> str:
        try:
            to_encode = data.copy()

            expire = datetime.utcnow() + timedelta(
                minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
            )
            to_encode.update({"exp": expire})

            encoded_jwt = jwt.encode(
                to_encode,
                settings.SECRET_KEY,
                algorithm=settings.ALGORITHM
            )

            logger.debug(f"Token criado com expiracao: {expire}")
            return encoded_jwt
        
        except Exception as e:
            logger.error(f"Erro ao criar token: {str(e)}", exc_info=True)
            raise
    
    @staticmethod
    def verify_token(token: str) -> Optional[TokenData]:
        try:
            logger.debug(f"Verificando token: {token[:20]}...")

            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=[settings.ALGORITHM]
            )

            user_id = payload.get("sub")
            if user_id is None:
                logger.warning("Token nao contem 'sub' (user_id)")
                return None
            
            email = payload.get("email")

            logger.debug(f"Token valido para user_id: {user_id}")
            return TokenData(user_id=int(user_id), email=email)
        
        except JWTError as e:
            logger.warning(f"Token invalido: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Erro ao verificar token: {str(e)}", exc_info=True)
            return None