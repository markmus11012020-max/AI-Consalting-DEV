import time
from collections import defaultdict

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app import crud
from app.core.db import get_db
from app.schemas import MetricAccepted, MetricBatch

router = APIRouter(tags=["metrics"])

# Простое ограничение: не более 1 запроса в секунду с одного IP.
# Клиент штатно отправляет батч раз в 5–10 секунд через sendBeacon.
_RATE_WINDOW_SECONDS = 1.0
_last_request: dict[str, float] = defaultdict(float)


@router.post(
    "/metrics",
    response_model=MetricAccepted,
    status_code=status.HTTP_202_ACCEPTED,
)
def collect_metrics(
    batch: MetricBatch, request: Request, db: Session = Depends(get_db)
) -> MetricAccepted:
    client_ip = request.client.host if request.client else "unknown"
    now = time.monotonic()
    if now - _last_request[client_ip] < _RATE_WINDOW_SECONDS:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Слишком много событий, отправляйте батчами",
        )
    _last_request[client_ip] = now

    accepted = crud.metrics.bulk_create(db, batch.events)
    return MetricAccepted(accepted=accepted)
