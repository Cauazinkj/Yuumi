from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    DATABASE_URL: str = Field(..., env="DATABASE_URL")
    SECRET_KEY: str = Field(..., env="SECRET_KEY")
    API_VERSION: str = Field("v1", env="API_VERSION")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()