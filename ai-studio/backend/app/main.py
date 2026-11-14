import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes import admin, applications, auth, health, metrics, services
from app.core.config import settings
from app.core.db import Base, SessionLocal, engine
from app.seed import bootstrap_admin, seed_services

logging.basicConfig(
    level=getattr(logging, settings.log_level.upper(), logging.INFO),
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
logger = logging.getLogger("aillix")


@asynccontextmanager
async def lifespan(_: FastAPI):
    # На учебном контуре схема создаётся автоматически.
    # Для production-миграций предусмотрен Alembic (см. README).
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_services(db)
        bootstrap_admin(db)
    logger.info("backend started version=%s", settings.app_version)
    yield


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    docs_url="/api/docs" if settings.docs_enabled else None,
    redoc_url=None,
    openapi_url="/api/openapi.json" if settings.docs_enabled else None,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Cache-Control"] = "no-store"
    return response


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("unhandled error path=%s", request.url.path)
    return JSONResponse(status_code=500, content={"detail": "Внутренняя ошибка"})


app.include_router(health.router, prefix="/api")
app.include_router(services.router, prefix="/api")
app.include_router(applications.router, prefix="/api")
app.include_router(metrics.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
