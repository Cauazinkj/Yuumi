from fastapi import APIRouter
from app.api.v1.user_router import router as user_router
from app.api.v1.auth_router import router as auth_router

router = APIRouter()

router.include_router(user_router)
router.include_router(auth_router)
