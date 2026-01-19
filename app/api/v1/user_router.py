from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.user import UserCreateSchema, UserReadSchema, UserUpdateSchema
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["Users"])

# Cria novo usuario
@router.post("/new", response_model=UserReadSchema, status_code=201)
def create_user(data: UserCreateSchema, db: Session = Depends(get_db)):
    user = UserService.create_user(db, data)
    return user

# Deleta usuario pelo ID
@router.delete("/{user_id}", status_code=204)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    UserService.delete_user(db, user_id)
    return None

# Lista todos os usuarios
@router.get("/", response_model=list[UserReadSchema])
def get_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    users = UserService.get_user(db, skip=skip, limit=limit)
    return users

# Lista o usuario pelo ID
@router.get("/{user_id}", response_model=UserReadSchema)
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    user = UserService.get_user_by_id(db, user_id)
    return user

@router.put("/{user_id}", response_model=UserReadSchema)
def update_user(
    user_id: int,
    data: UserUpdateSchema,
    db: Session = Depends(get_db)    
):
    update_user = UserService.update_user(db, user_id, data)
    return update_user