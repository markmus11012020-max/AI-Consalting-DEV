import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    Integer,
    JSON,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base


class Application(Base):
    """Заявка (лид) с рассчитанным скором и температурой."""

    __tablename__ = "applications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    public_id: Mapped[str] = mapped_column(
        String(36), unique=True, index=True, default=lambda: str(uuid.uuid4())
    )

    name: Mapped[str] = mapped_column(String(120))
    contact: Mapped[str] = mapped_column(String(200), index=True)
    contact_type: Mapped[str] = mapped_column(String(20), default="telegram")
    message: Mapped[str] = mapped_column(Text, default="")

    business_type: Mapped[str] = mapped_column(String(20), default="business")
    company_size: Mapped[str] = mapped_column(String(20), default="")
    role: Mapped[str] = mapped_column(String(40), default="")
    budget: Mapped[int | None] = mapped_column(Integer, nullable=True)
    deadline_days: Mapped[int | None] = mapped_column(Integer, nullable=True)
    task_volume: Mapped[int] = mapped_column(Integer, default=1)
    services: Mapped[list] = mapped_column(JSON, default=list)

    source: Mapped[str] = mapped_column(String(60), default="site")
    page: Mapped[str] = mapped_column(String(200), default="/")
    utm: Mapped[str] = mapped_column(String(300), default="")
    session_id: Mapped[str] = mapped_column(String(64), default="", index=True)

    consent: Mapped[bool] = mapped_column(Boolean, default=False)
    score: Mapped[int] = mapped_column(Integer, default=0, index=True)
    temperature: Mapped[str] = mapped_column(
        String(10), default="cold", index=True
    )
    score_breakdown: Mapped[dict] = mapped_column(JSON, default=dict)
    status: Mapped[str] = mapped_column(String(20), default="new", index=True)
    admin_comment: Mapped[str] = mapped_column(Text, default="")

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), index=True
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
