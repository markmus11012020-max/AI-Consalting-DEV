from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import Service
from app.schemas import ServiceCreate, ServiceUpdate


def list_services(db: Session, include_inactive: bool = False) -> list[Service]:
    stmt = select(Service).order_by(Service.sort_order, Service.id)
    if not include_inactive:
        stmt = stmt.where(Service.is_active.is_(True))
    return list(db.scalars(stmt))


def get_service(db: Session, service_id: int) -> Service | None:
    return db.get(Service, service_id)


def get_service_by_slug(db: Session, slug: str) -> Service | None:
    return db.scalar(select(Service).where(Service.slug == slug))


def create_service(db: Session, payload: ServiceCreate) -> Service:
    service = Service(**payload.model_dump())
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


def update_service(db: Session, service: Service, payload: ServiceUpdate) -> Service:
    data = payload.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(service, field, value)
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


def deactivate_service(db: Session, service: Service) -> Service:
    """Мягкое удаление: исторические заявки ссылаются на услугу."""
    service.is_active = False
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


def count_services(db: Session, include_inactive: bool = True) -> int:
    stmt = select(func.count(Service.id))
    if not include_inactive:
        stmt = stmt.where(Service.is_active.is_(True))
    return int(db.scalar(stmt) or 0)
