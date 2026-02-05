from sqlalchemy.orm import Session
from sqlalchemy import and_
from fastapi import HTTPException, status
import logging
from typing import List, Optional

from app.models.review import Review
from app.schemas.review import ReviewCreate, ReviewUpdate

logger = logging.getLogger(__name__)

class ReviewService:
    @staticmethod
    def create_review(db: Session, review_data: ReviewCreate, user_id: int) -> Review:
        existing_review = db.query(Review).filter(
            and_(
                Review.recipe_id == review_data.recipe_id,
                Review.user_id == user_id
            )
        ).first()

        if existing_review:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Voce ja avaliou esta receita. Atualize sua avaliacao existente."
            )

        db_review = Review(
            **review_data.dict(),
            user_id=user_id
        )

        db.add(db_review)
        db.commit()
        db.refresh(db_review)
        return db_review

    @staticmethod
    def get_review_by_id(db: Session, review_id: int) -> Optional[Review]:
        return db.query(Review).filter(Review.id == review_id).first()

    @staticmethod
    def get_user_review_for_recipe(db: Session, recipe_id: int, user_id: int) -> Optional[Review]:
        return db.query(Review).filter(
            and_(
                Review.recipe_id == recipe_id,
                Review.user_id == user_id
            )
        ).first()

    @staticmethod
    def get_reviews_by_recipe(db: Session, recipe_id: int, skip: int = 0, limit: int = 100) -> List[Review]:
        return db.query(Review).filter(
            Review.recipe_id == recipe_id
        ).offset(skip).limit(limit).all()

    @staticmethod
    def get_reviews_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Review]:
        return db.query(Review).filter(
            Review.user_id == user_id
        ).offset(skip).limit(limit).all()

    @staticmethod
    def update_review(db: Session, review_id: int, review_data: ReviewUpdate, user_id: int) -> Review:
        db_review = db.query(Review).filter(Review.id == review_id).first()

        if not db_review:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Avaliacao nao encontrada"
            )
        
        if db_review.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Voce nao tem permissao para atualizar esta avaliacao"
            )
        
        update_data = review_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_review, field, value)

        db.commit()
        db.refresh(db_review)
        return db_review

    @staticmethod
    def delete_review(db: Session, review_id: int, user_id: int) -> bool: 
        db_review = db.query(Review).filter(Review.id == review_id).first()

        if not db_review:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Avaliacao nao encontrada"
            )
        
        if db_review.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Voce nao tem permissao para excluir esta avaliacao"
            )
        
        db.delete(db_review)
        db.commit()
        return True

    @staticmethod
    def get_average_rating_for_recipe(db: Session, recipe_id: int) -> Optional[float]:
        from sqlalchemy import func

        result = db.query(func.avg(Review.rating)).filter(
            Review.recipe_id == recipe_id
        ).scalar()

        return float(result) if result else None

    @staticmethod
    def get_review_count_for_recipe(db: Session, recipe_id: int) -> int:
        return db.query(Review).filter(Review.recipe_id == recipe_id).count()