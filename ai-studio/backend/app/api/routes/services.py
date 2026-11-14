from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud
from app.core.db import get_db
from app.schemas import ServiceRead

router = APIRouter(tags=["services"])


@router.get("/services", response_model=list[ServiceRead])
def list_public_services(db: Session = Depends(get_db)) -> list[ServiceRead]:
    return crud.services.list_services(db, include_inactive=False)


@router.get("/services/{slug}", response_model=ServiceRead)
def get_public_service(slug: str, db: Session = Depends(get_db)) -> ServiceRead:
    service = crud.services.get_service_by_slug(db, slug)
    if service is None or not service.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Услуга не найдена"
        )
    return service
