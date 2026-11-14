from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, JSON, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base


class Service(Base):
    """Услуга с диапазоном цены. Удаление — мягкое (is_active=false)."""

    __tablename__ = "services"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slug: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(160))
    summary: Mapped[str] = mapped_column(Text)
    outcome: Mapped[str] = mapped_column(String(240), default="")
    icon: Mapped[str] = mapped_column(String(40), default="bot")
    accent: Mapped[str] = mapped_column(String(20), default="indigo")

    price_min: Mapped[int] = mapped_column(Integer)
    price_max: Mapped[int] = mapped_column(Integer)
    currency: Mapped[str] = mapped_column(String(3), default="RUB")

    duration_days_min: Mapped[int] = mapped_column(Integer, default=3)
    duration_days_max: Mapped[int] = mapped_column(Integer, default=5)

    highlights: Mapped[list] = mapped_column(JSON, default=list)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, index=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
