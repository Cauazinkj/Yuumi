from pydantic_settings import BaseSettings
from pydantic import Field
from datetime import timedelta

class Settings(BaseSettings):
    DATABASE_URL: str = Field(..., env="DATABASE_URL")
    SECRET_KEY: str = Field(..., env="SECRET_KEY")
    API_VERSION: str = Field("v1", env="API_VERSION")

    ALGORITHM: str = Field("HS256", env="ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(30, env="ACCESS_TOKEN_EXPIRE_MINUTES")
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()