from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime

class IngredientBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Nome do ingrediente")

    quantity: str = Field(..., min_length=1, max_length=50, description="Quantidade (ex: 200g, 1 xicara, etc.)")

class IngredientCreate(IngredientBase):
    pass

class IngredientRead(IngredientBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

# SCHEMAS PARA PASSOS DA RECEITA

class StepBase(BaseModel):
    description: str = Field(..., min_length=1, max_length=500, description="Descricao do passo da receita")

class StepCreate(StepBase):
    pass

class StepRead(StepBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

# SCHEMAS PARA RECEITAS

class RecipeBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100, description="Titulo da receita")

    description: Optional[str] = Field(None, max_length=500, description="Descricao opcional da receita")

class RecipeCreate(RecipeBase):
    ingredients: List[IngredientCreate] = Field(
        ...,
        min_items=1,
        description="Lista de ingredientes (pelo menos 1)"
    )
    steps: List[StepCreate] = Field(
        ...,
        min_items=1,
        description="Lista de passos da receita (pelo menos 1)"
    )

class RecipeUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    ingredients: Optional[List[IngredientCreate]] = None
    steps: Optional[List[StepCreate]] = None

class RecipeRead(RecipeBase):
    id: int
    user_id: int
    created_at: Optional[datetime] = None #adicionar dps
    updated_at: Optional[datetime] = None #adicionar dps

    # Relacoes completas
    ingredients: List[IngredientRead] = []
    steps: List[StepRead] = []

    model_config = ConfigDict(from_attributes=True)

# SCHEMA PARA LISTAGEM DE RECEITAS

class RecipeSummary(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    user_id: int

    model_config = ConfigDict(from_attributes=True)