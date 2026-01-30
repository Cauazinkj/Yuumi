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
                user_id=user_id
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

            sorted_steps = sorted(recipe_data.steps, key=lambda x: x.step_number)

            for step_data in sorted_steps:
                step = RecipeStep(
                    description=step_data.description,
                    step_number=step_data.step_number,
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
        
    @staticmethod
    def get_recipe_by_id(
        db: Session,
        recipe_id: int
    ) -> RecipeRead:
        
        try:
            logger.info(f"Buscando a receita de ID: {recipe_id}")

            recipe = db.query(Recipe).filter(Recipe.id == recipe.id).first()

            if not recipe:
                logger.warning(f"Receita {recipe_id} nao encontrada")
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Receita com ID {recipe_id} nao encontrada"
                )
            
            logger.info(f"Receita encontrada: {recipe.title}")
            return RecipeRead.model_validate(recipe)
        
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Erro ao buscar receita: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao buscar receita: {str(e)}"
            )
    
    @staticmethod
    def update_recipe(
        db: Session,
        recipe_id: int,
        recipe_data: RecipeUpdate,
        user_id: Optional[int] = None
    ) -> RecipeRead:
        try:
            logger.info(f"Atualizando receita ID: {recipe_id}")

            recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()

            if not recipe:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Receita com ID {recipe_id} nao encontrada"
                )
            
            if user_id and recipe.user_id != user_id:
                logger.warning(f"Usuario {user_id} tentou editar receita de {recipe.user_id}")
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Voce nao tem permissao para editar essa receita"
                )
            
            update_dict = recipe_data.model_dump(exclude_unset=True, exclude={'steps', 'ingredients'})

            for field, value in update_dict.item():
                setattr(recipe, field, value)
                logger.debug(f"  Campo atualizado: {field} = {value}")

            if recipe_data.steps is not None:
                logger.info("  Atualizando passos...")

                db.query(RecipeStep).filter(RecipeStep.recipe_id == recipe_id).delete()

                sorted_steps = sorted(recipe_data.steps, key=lambda x: x.step_number)
                for step_data in sorted_steps:
                    step = RecipeStep(
                        description=step_data.description,
                        recipe_id=recipe_id
                    )
                    db.add(step)

            if recipe_data.ingredients is not None:
                logger.info("  Atualizando ingredientes...")
                db.query(RecipeIngredient).filter(RecipeIngredient.recipe_id == recipe_id).delete()

                for ingredient_data in recipe_data.ingredients:
                    ingredient = RecipeIngredient(
                        name=ingredient_data.name,
                        quantity=ingredient_data.quantity,
                        recipe_id=recipe_id
                    )
                    db.add(ingredient)

            db.commit()
            db.refresh(recipe)

            logger.info(f" Receita {recipe_id} atualizada com sucesso")
            return RecipeRead.model_validate(recipe)
        
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Erro ao atualizar receita: {str(e)}", exc_info=True)
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao atualizar receita: {str(e)}"
            )
    
    @staticmethod
    def delete_recipe(
        db: Session,
        recipe_id: int,
        user_id: Optional[int] = None
    ) -> None:
        try:
            logger.info(f"Deletando receita ID: {recipe_id}")

            recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()

            if not recipe:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Receita com ID {recipe_id} nao encontrado"
                )

            if user_id and recipe.user_id != user_id:
                logger.warning(f"Usuario {user_id} tentou deletar recieta de {recipe.user_id}")
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Voce nao tem permissao para deletar esta receita"
                )
            
            db.delete(recipe)
            db.commit()

            logger.info(f" Receita {recipe_id} deletada com sucesso")
        
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Erro ao deletar receita: {str(e)}", exc_info=True)
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao deletar receita: {str(e)}"
            )