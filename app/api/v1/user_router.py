from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.user import UserCreateSchema, UserReadSchema
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=UserReadSchema, status_code=201)
def create_user(data: UserCreateSchema, db: Session = Depends(get_db)):
    user = UserService.create_user(db, data)
    return user