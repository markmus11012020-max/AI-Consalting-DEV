"""Настройки приложения. Читаются из переменных окружения."""

from functools import lru_cache

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

    cors_origins: str = "https://aillix.ru"
    docs_enabled: bool = False
    log_level: str = "INFO"

    @property
    def cors_origin_list(self) -> list[str]:
        return [item.strip() for item in self.cors_origins.split(",") if item.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
