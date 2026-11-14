from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, JSON, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base


class BehaviorMetric(Base):
    """Событие поведения на сайте.

    application_id nullable: события пишутся до отправки формы,
    их связывает session_id.
    """

    __tablename__ = "behavior_metrics"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    session_id: Mapped[str] = mapped_column(String(64), index=True)
    application_id: Mapped[int | None] = mapped_column(
        ForeignKey("applications.id", ondelete="SET NULL"), nullable=True, index=True
    )

    event_type: Mapped[str] = mapped_column(String(30), index=True)
    path: Mapped[str] = mapped_column(String(200), default="/")
    element: Mapped[str] = mapped_column(String(120), default="")

    x: Mapped[float | None] = mapped_column(Float, nullable=True)
    y: Mapped[float | None] = mapped_column(Float, nullable=True)
    viewport_w: Mapped[int | None] = mapped_column(Integer, nullable=True)
    viewport_h: Mapped[int | None] = mapped_column(Integer, nullable=True)

    duration_ms: Mapped[int] = mapped_column(Integer, default=0)
    meta: Mapped[dict] = mapped_column(JSON, default=dict)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), index=True
    )
