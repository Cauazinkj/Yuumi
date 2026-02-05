from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="recipes")
    steps = relationship("RecipeStep", back_populates="recipe")
    ingredients = relationship("RecipeIngredient", back_populates="recipe")

    reviews = relationship(
        "Review",
        back_populates="recipe",
        cascade="all, delete-orphan",
        lazy="select"
    )

    @property
    def average_rating(self) -> float:
        if not self.reviews:
            return 0.0
        total = sum(review.rating for review in self.reviews)
        return round(total / len(self.reviews), 1)
    
    @property
    def review_count(self) -> int:
        return len(self.reviews)
