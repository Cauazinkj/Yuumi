import sys
import os
from logging.config import fileConfig
from alembic import context
from sqlalchemy import engine_from_config, pool

# -------------------------
# CONFIGURAÇÃO BÁSICA
# -------------------------
config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# -------------------------
# AJUSTAR PATH
# -------------------------
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
sys.path.append(BASE_DIR)

print(f"BASE_DIR: {BASE_DIR}")
print(f"Current working directory: {os.getcwd()}")

# -------------------------
# DATABASE_URL DO .env
# -------------------------
from dotenv import load_dotenv
load_dotenv(os.path.join(BASE_DIR, ".env"))

DATABASE_URL = os.getenv("DATABASE_URL")
print(f"DATABASE_URL: {DATABASE_URL}")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL não encontrada no arquivo .env")

config.set_main_option("sqlalchemy.url", DATABASE_URL)

# -------------------------
# IMPORTS APÓS AJUSTAR PATH E DATABASE_URL
# -------------------------
try:
    from app.db.base import Base
    
    # Importar todos os modelos para que sejam registrados no Base.metadata
    from app.models.user import User
    from app.models.recipes import Recipe
    from app.models.recipe_steps import RecipeStep
    from app.models.recipe_ingredient import RecipeIngredient
    from app.models.review import Review
    
    print("Modelos importados com sucesso:")
    print(f"- User: {'✓' if 'users' in Base.metadata.tables else '✗'}")
    print(f"- Recipe: {'✓' if 'recipes' in Base.metadata.tables else '✗'}")
    print(f"- RecipeStep: {'✓' if 'recipe_steps' in Base.metadata.tables else '✗'}")
    print(f"- RecipeIngredient: {'✓' if 'recipe_ingredients' in Base.metadata.tables else '✗'}")
    print(f"- Review: {'✓' if 'reviews' in Base.metadata.tables else '✗'}")
    
    target_metadata = Base.metadata
    print("Metadata configurada com sucesso")
    
except ImportError as e:
    print(f"ERRO ao importar modelos: {e}")
    print("Traceback completo:")
    import traceback
    traceback.print_exc()
    raise

# -------------------------
# MIGRAÇÃO OFFLINE
# -------------------------
def run_migrations_offline():
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"}
    )
    with context.begin_transaction():
        context.run_migrations()


# -------------------------
# MIGRAÇÃO ONLINE
# -------------------------
def run_migrations_online():
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()