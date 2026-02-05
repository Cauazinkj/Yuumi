from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import Optional

class ReviewBase(BaseModel):
    recipe_id: int = Field(..., gt=0, description="ID da receita")
    rating: int = Field(..., ge=1, le=5, description="Avaliacao de 1 a 5 estrelas")
    comment: Optional[str] = Field(None, max_length=500, description="Comentario Opcional")

class ReviewCreate(ReviewBase):
    pass

class ReviewUpdate(BaseModel):
    rating: Optional[int] = Field(None, ge=1, le=5, description="Avaliacao de 1 a 5 estrelas")
    comment: Optional[str] = Field(None, max_length=500, description="Comentario opcional")

class ReviewInDBBase(ReviewBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class Review(ReviewInDBBase):
    pass

class ReviewWithUser(Review):
    user_username: str

    class Config:
        from_attributes = True