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

# -------------------------
# IMPORTS APÓS AJUSTAR PATH
# -------------------------
from app.models.base import Base

from app.models import user, recipes, recipe_steps, recipe_ingredient
# Importar é suficiente para registrar no Base.metadata

target_metadata = Base.metadata

# -------------------------
# DATABASE_URL DO .env
# -------------------------
from dotenv import load_dotenv
load_dotenv(os.path.join(BASE_DIR, ".env"))

DATABASE_URL = os.getenv("DATABASE_URL")
config.set_main_option("sqlalchemy.url", DATABASE_URL)


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
