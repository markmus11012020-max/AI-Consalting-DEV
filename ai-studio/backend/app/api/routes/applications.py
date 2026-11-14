import logging

from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session

from app import crud
from app.core.db import get_db
from app.schemas import ApplicationCreate, ApplicationCreated
from app.services.scoring import score_application

logger = logging.getLogger("aillix.applications")

router = APIRouter(tags=["applications"])


@router.post(
    "/applications",
    response_model=ApplicationCreated,
    status_code=status.HTTP_201_CREATED,
)
def create_application(
    payload: ApplicationCreate,
    request: Request,
    db: Session = Depends(get_db),
) -> ApplicationCreated:
    engagement = crud.metrics.engagement_for_session(db, payload.session_id)
    score, temperature, breakdown = score_application(payload, engagement)

    application = crud.applications.create_application(
        db, payload, score=score, temperature=temperature, breakdown=breakdown
    )
    crud.metrics.link_session_to_application(db, payload.session_id, application.id)

    logger.info(
        "application_created public_id=%s score=%s temperature=%s",
        application.public_id,
        score,
        temperature,
    )

    return ApplicationCreated(
        public_id=application.public_id,
        score=score,
        temperature=temperature,
    )
