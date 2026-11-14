from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app import crud
from app.api.deps import get_current_admin
from app.core.db import get_db
from app.models import Admin
from app.schemas import (
    ApplicationAdminUpdate,
    ApplicationRead,
    HeatmapResponse,
    MetricsSummary,
    ServiceCreate,
    ServiceRead,
    ServiceUpdate,
    StatsResponse,
)

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    dependencies=[Depends(get_current_admin)],
)


@router.get("/stats", response_model=StatsResponse)
def stats(db: Session = Depends(get_db)) -> StatsResponse:
    return StatsResponse(**crud.applications.stats(db))


@router.get("/applications")
def list_applications(
    temperature: str | None = Query(default=None, pattern="^(hot|warm|cold)$"),
    status_filter: str | None = Query(
        default=None, alias="status", pattern="^(new|in_progress|won|lost)$"
    ),
    q: str | None = Query(default=None, max_length=120),
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
) -> dict:
    rows, total = crud.applications.list_applications(
        db,
        temperature=temperature,
        status=status_filter,
        search=q,
        limit=limit,
        offset=offset,
    )
    return {
        "total": total,
        "items": [ApplicationRead.model_validate(row) for row in rows],
    }


@router.patch("/applications/{application_id}", response_model=ApplicationRead)
def update_application(
    application_id: int,
    payload: ApplicationAdminUpdate,
    db: Session = Depends(get_db),
) -> ApplicationRead:
    application = crud.applications.get_application(db, application_id)
    if application is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Заявка не найдена"
        )
    updated = crud.applications.update_application(db, application, payload)
    return ApplicationRead.model_validate(updated)


@router.get("/services", response_model=list[ServiceRead])
def list_services(
    include_inactive: bool = True, db: Session = Depends(get_db)
) -> list[ServiceRead]:
    return crud.services.list_services(db, include_inactive=include_inactive)


@router.post(
    "/services", response_model=ServiceRead, status_code=status.HTTP_201_CREATED
)
def create_service(payload: ServiceCreate, db: Session = Depends(get_db)) -> ServiceRead:
    if crud.services.get_service_by_slug(db, payload.slug) is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Услуга с таким slug уже существует",
        )
    return crud.services.create_service(db, payload)


@router.patch("/services/{service_id}", response_model=ServiceRead)
def update_service(
    service_id: int, payload: ServiceUpdate, db: Session = Depends(get_db)
) -> ServiceRead:
    service = crud.services.get_service(db, service_id)
    if service is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Услуга не найдена"
        )
    return crud.services.update_service(db, service, payload)


@router.delete("/services/{service_id}", response_model=ServiceRead)
def delete_service(service_id: int, db: Session = Depends(get_db)) -> ServiceRead:
    service = crud.services.get_service(db, service_id)
    if service is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Услуга не найдена"
        )
    return crud.services.deactivate_service(db, service)


@router.get("/metrics/summary", response_model=MetricsSummary)
def metrics_summary(
    days: int = Query(default=30, ge=1, le=365), db: Session = Depends(get_db)
) -> MetricsSummary:
    return MetricsSummary(**crud.metrics.summary(db, days=days))


@router.get("/metrics/heatmap", response_model=HeatmapResponse)
def metrics_heatmap(
    grid: int = Query(default=20, ge=5, le=50),
    days: int = Query(default=30, ge=1, le=365),
    db: Session = Depends(get_db),
) -> HeatmapResponse:
    return HeatmapResponse(**crud.metrics.heatmap(db, grid=grid, days=days))
