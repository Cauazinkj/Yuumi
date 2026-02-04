from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import logging

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.review import Review, ReviewCreate, ReviewUpdate, ReviewWithUser
from app.services.review import ReviewService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/review", tags=["Review"])

@router.post("/", response_model=Review, status_code=status.HTTP_201_CREATED)
def create_review(
    review: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return ReviewService.create_review(db, review, current_user.id)

@router.get("/recipe/{recipe_id}", response_model=List[Review])
def get_reviews_by_recipe(
    recipe_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    return ReviewService.get_reviews_by_recipe(db, recipe_id, skip, limit)

@router.get("/user/me", response_model=List[Review])
def get_my_reviews(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return ReviewService.get_reviews_by_user(db, current_user.id, skip, limit)

@router.get("/recipe/{recipe_id}/me", response_model=Optional[Review])
def get_my_review_for_recipe(
    recipe_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return ReviewService.get_user_review_for_recipe(db, recipe_id, current_user.id)

@router.get("/{review_id}", response_model=Review)
def get_review(
    review_id: int,
    db: Session = Depends(get_db)
):
    review = ReviewService.get_review_by_id(db, review_id)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Avaliacao nao encontrada"
        )
    return review

@router.put("/{review_id}", response_model=Review)
def update_review(
    review_id: int,
    review_update: ReviewUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return ReviewService.update_review(db, review_id, review_update, current_user.id)

@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ReviewService.delete_review(db, review_id, current_user.id)
    return None

@router.get("/recipe/{recipe_id}/stats")
def get_recipe_review_stats(
    recipe_id: int,
    db: Session = Depends(get_db)
):
    avg_rating = ReviewService.get_average_rating_for_recipe(db, recipe_id)
    review_count = ReviewService.get_review_count_for_recipe(db, recipe_id)

    return {
        "recipe_id": recipe_id,
        "average_rating": avg_rating,
        "review_count": review_count,
        "average_rating_formatted": f"{avg_rating:.1f}" if avg_rating else "N/A"
    }