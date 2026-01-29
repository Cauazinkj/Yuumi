from sqlalchemy.orm import Session
from sqlalchemy import select
from fastapi import HTTPException, status
import logging
from typing import List, Optional

from app.models.recipes import Recipe
from app.models.recipe_steps import RecipeStep
from app.models.recipe_ingredient import RecipeIngredient
from app.models.user import User
from app.schemas.recipes import (
    RecipeCreate, RecipeRead, RecipeUpdate, RecipeSummary
)

logger = logging.getLogger(__name__)

class RecipeService:

    @staticmethod
    def create_recipe(
        db: Session,
        recipe_data: RecipeCreate,
        user_id: int
    ) -> RecipeRead:
        try:
            logger.info(f"Criando receita '{recipe_data.title}' para usuario {user_id}")

            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                logger.error(f"Usuario {user_id} nao encontrado")
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Usuario nao encontrado"
                )
            
            db_recipe = Recipe(
                title=recipe_data.title,
                description=recipe_data.description,
                user_id=recipe_data.user_id
            )
            db.add(db_recipe)
            db.flush()

            for idx, ingredient_data in enumerate(recipe_data.ingredients):
                ingredient = RecipeIngredient(
                    name=ingredient_data.name,
                    quantity=ingredient_data.quantity,
                    recipe_id=db_recipe.id
                )
                db.add(ingredient)
                logger.debug(f"  - Ingrediente {idx+1}: {ingredient_data.name}")

            for step_data in sorted_steps:
                step = RecipeStep(
                    description=step_data.description,
                    recipe_id=db_recipe.id
                )
                db.add(step)
                logger.debug(f"  - Passo {step_data.step_number}: {step_data.description[:30]}...")

                db.commit()
                db.refresh(db_recipe)

                logger.info(f"Receita criado com ID: {db_recipe.id}")

                return RecipeRead.model_validate(db_recipe)
        
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Erro ao criar receita: {str(e)}", exc_info=True)
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao criar receita {str(e)}"
            )

    @staticmethod
    def get_recipe(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        user_id: Optional[int] = None,
        search: Optional[int] = None
    ) -> List[RecipeSummary]:
        try: 
            logger.info(f"Listando receitas (skip={skip}, limit={limit})")

            query = db.query(Recipe)

            if user_id:
                query = query.filter(Recipe.user_id == user_id)
                logger.debug(f"  Filtro: user_id={user_id}")

            if search:
                query = query.filter(
                    Recipe.title.ilike(f"%{search}%") |
                    Recipe.description.ilike(f"%{search}%")
                )
                logger.debug(f"  Busca: '{search}'")

            recipes = query.offset(skip).limit(limit).all()

            logger.info(f"Encontradas {len(recipes)} receita(s)")

            return [RecipeSummary.model_validate(recipe) for recipe in recipes]
        
        except Exception as e:
            logger.error(f"Erro ao listar receitas: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao listar receitas: {str(e)}"
            )
        
        