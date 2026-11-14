from __future__ import annotations

from sqlalchemy import desc, func, or_, select
from sqlalchemy.orm import Session

from app.models import Application
from app.schemas import ApplicationAdminUpdate, ApplicationCreate


def create_application(
    db: Session,
    payload: ApplicationCreate,
    score: int,
    temperature: str,
    breakdown: dict,
) -> Application:
    application = Application(
        **payload.model_dump(),
        score=score,
        temperature=temperature,
        score_breakdown=breakdown,
        status="new",
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


def get_application(db: Session, application_id: int) -> Application | None:
    return db.get(Application, application_id)


def list_applications(
    db: Session,
    *,
    temperature: str | None = None,
    status: str | None = None,
    search: str | None = None,
    limit: int = 50,
    offset: int = 0,
) -> tuple[list[Application], int]:
    stmt = select(Application)
    count_stmt = select(func.count(Application.id))

    filters = []
    if temperature:
        filters.append(Application.temperature == temperature)
    if status:
        filters.append(Application.status == status)
    if search:
        pattern = f"%{search.strip()}%"
        filters.append(
            or_(
                Application.name.ilike(pattern),
                Application.contact.ilike(pattern),
                Application.message.ilike(pattern),
            )
        )

    if filters:
        stmt = stmt.where(*filters)
        count_stmt = count_stmt.where(*filters)

    total = int(db.scalar(count_stmt) or 0)
    rows = list(
        db.scalars(
            stmt.order_by(desc(Application.created_at)).limit(limit).offset(offset)
        )
    )
    return rows, total


def update_application(
    db: Session, application: Application, payload: ApplicationAdminUpdate
) -> Application:
    data = payload.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(application, field, value)
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


def stats(db: Session) -> dict:
    total = int(db.scalar(select(func.count(Application.id))) or 0)
    avg_score = float(db.scalar(select(func.avg(Application.score))) or 0)

    by_temp = {
        temperature: int(count)
        for temperature, count in db.execute(
            select(Application.temperature, func.count(Application.id)).group_by(
                Application.temperature
            )
        )
    }
    by_status = {
        status: int(count)
        for status, count in db.execute(
            select(Application.status, func.count(Application.id)).group_by(
                Application.status
            )
        )
    }

    return {
        "total": total,
        "hot": by_temp.get("hot", 0),
        "warm": by_temp.get("warm", 0),
        "cold": by_temp.get("cold", 0),
        "by_status": by_status,
        "avg_score": round(avg_score, 1),
    }
