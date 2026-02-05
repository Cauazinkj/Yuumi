from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import logging

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.recipes import (
    RecipeCreate, RecipeRead, RecipeUpdate, RecipeSummary
)
from app.services.recipe_service import RecipeService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/recipes", tags=["Recipes"])

@router.post("/", response_model=RecipeRead, status_code=status.HTTP_201_CREATED)
def create_recipe(
    recipe_data: RecipeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logger.info(f"Requisicao POST /recipes/ de usuarios {current_user.id}")

    return RecipeService.create_recipe(
        db=db,
        recipe_data=recipe_data,
        user_id=current_user.id
    )

@router.get("/", response_model=List[RecipeSummary])
def get_recipes(
    skip: int = Query(0, ge=0, description="Numero de itens para pular"),
    limit: int = Query(100, ge=1, le=1000, description="Limite de itens por pagina"),
    user_id: Optional[int] = Query(None, description="Filtar por ID do usuario"),
    search: Optional[str] = Query(None, description="Busca por titulo ou descricao"),
    db: Session = Depends(get_db),
):
    logger.info(f"Requisicao GET /recipes/ com filtros: user_id={user_id}, search={search}")

    return RecipeService.get_recipe(
        db=db,
        skip=skip,
        limit=limit,
        user_id=user_id,
        search=search
    )

@router.get("/{recipe_id}", response_model=RecipeRead)
def get_recipe_by_id(
    recipe_id: int,
    db: Session = Depends(get_db)
):
    logger.info(f"Requisicao GET /recipes/{recipe_id}")

    return RecipeService.get_recipe_by_id(db, recipe_id)

@router.put("/{recipe_id}", response_model=RecipeRead)
def update_recipe(
    recipe_id: int,
    recipe_data: RecipeUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logger.info(f"Requisicao PUT /recipes/{recipe_id} de usuario {current_user.id}")

    return RecipeService.update_recipe(
        db=db,
        recipe_id=recipe_id,
        recipe_data=recipe_data,
        user_id=current_user.id
    )

@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_recipe(
    recipe_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logger.info(f"Requisicao DELETE /recipes/{recipe_id} de usuario {current_user.id}")

    RecipeService.delete_recipe(
        db=db,
        recipe_id=recipe_id,
        user_id=current_user.id
    )

    return None