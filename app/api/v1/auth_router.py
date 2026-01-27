from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import logging

from app.api.deps import get_db
from app.schemas.auth import LoginRequest, LoginResponse, Token
from app.services.auth_services import AuthService
from app.models.user import User

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=LoginResponse)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    logger.info(f"Tentativa de login: {login_data.email}")

    user = AuthService.authenticate_user(
        db,
        login_data.email,
        login_data.password
    )

    if not user:
        logger.warning(f"Credenciais invalidas para {login_data.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token_data = {"sub": str(user.id), "email": user.email}
    access_token = AuthService.create_access_token(token_data)

    logger.info(f"Login bem-sucedido para {user.email}")

    return LoginResponse(
        user_id=user.id,
        name=user.name,
        email=user.email,
        token=Token(access_token=access_token)
    )

@router.get("/me")
def read_users_me(
    current_user: User = Depends(get_current_user)
):
    return {
        "user_id": current_user.id,
        "name": current_user.name,
        "email": current_user.email
    }