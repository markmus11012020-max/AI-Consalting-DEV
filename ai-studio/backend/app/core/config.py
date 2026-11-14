"""Настройки приложения. Читаются из переменных окружения."""

from functools import lru_cache

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "Aillix API"
    app_version: str = "1.0.0"

    database_url: str = (
        "postgresql+psycopg://aillix:aillix@localhost:5432/aillix"
    )

    jwt_secret: str = "dev-only-secret-change-me"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 480
    cookie_name: str = "aillix_admin"
    cookie_secure: bool = True
    cookie_samesite: str = "strict"

    admin_email: str = ""
    admin_password: str = ""

    cors_origins: str = Field(
        default="https://aillix.ru",
        validation_alias=AliasChoices("BACKEND_CORS_ORIGINS", "CORS_ORIGINS"),
    )
    docs_enabled: bool = Field(
        default=False,
        validation_alias=AliasChoices("BACKEND_DOCS_ENABLED", "DOCS_ENABLED"),
    )
    log_level: str = Field(
        default="INFO",
        validation_alias=AliasChoices("BACKEND_LOG_LEVEL", "LOG_LEVEL"),
    )

    @property
    def cors_origin_list(self) -> list[str]:
        return [item.strip() for item in self.cors_origins.split(",") if item.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
