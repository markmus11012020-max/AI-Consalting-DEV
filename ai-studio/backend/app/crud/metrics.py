from __future__ import annotations

from datetime import datetime, timedelta, timezone

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import BehaviorMetric
from app.schemas import MetricEvent

CURSOR_EVENTS = ("cursor",)


def bulk_create(db: Session, events: list[MetricEvent]) -> int:
    rows = [
        BehaviorMetric(
            session_id=event.session_id,
            event_type=event.event_type,
            path=event.path,
            element=event.element,
            x=event.x,
            y=event.y,
            viewport_w=event.viewport_w,
            viewport_h=event.viewport_h,
            duration_ms=event.duration_ms,
            meta=event.meta,
        )
        for event in events
    ]
    db.add_all(rows)
    db.commit()
    return len(rows)


def link_session_to_application(db: Session, session_id: str, application_id: int) -> None:
    if not session_id:
        return
    db.execute(
        BehaviorMetric.__table__.update()
        .where(BehaviorMetric.session_id == session_id)
        .values(application_id=application_id)
    )
    db.commit()


def engagement_for_session(db: Session, session_id: str) -> dict:
    if not session_id:
        return {}

    rows = list(
        db.scalars(
            select(BehaviorMetric).where(BehaviorMetric.session_id == session_id)
        )
    )
    if not rows:
        return {}

    page_views = sum(1 for row in rows if row.event_type == "page_view")
    clicks = sum(1 for row in rows if row.event_type == "click")
    cursor_points = sum(1 for row in rows if row.event_type in CURSOR_EVENTS)
    returning = any(row.event_type == "return" for row in rows)

    first = min(row.created_at for row in rows)
    last = max(row.created_at for row in rows)
    duration_seconds = max(0, (last - first).total_seconds())

    return {
        "page_views": page_views,
        "clicks": clicks,
        "cursor_points": cursor_points,
        "returning": returning,
        "duration_seconds": duration_seconds,
    }


def heatmap(db: Session, grid: int = 20, days: int = 30) -> dict:
    since = datetime.now(tz=timezone.utc) - timedelta(days=days)
    rows = db.execute(
        select(BehaviorMetric.x, BehaviorMetric.y).where(
            BehaviorMetric.event_type.in_(CURSOR_EVENTS),
            BehaviorMetric.x.is_not(None),
            BehaviorMetric.y.is_not(None),
            BehaviorMetric.created_at >= since,
        )
    ).all()

    cells: dict[tuple[int, int], int] = {}
    for x, y in rows:
        # x/y нормализованы в 0..1, приводим к сетке grid × grid.
        cell_x = min(grid - 1, max(0, int(float(x) * grid)))
        cell_y = min(grid - 1, max(0, int(float(y) * grid)))
        cells[(cell_x, cell_y)] = cells.get((cell_x, cell_y), 0) + 1

    return {
        "total_points": len(rows),
        "grid": grid,
        "cells": [
            {"x": x, "y": y, "weight": weight}
            for (x, y), weight in sorted(cells.items())
        ],
    }


def summary(db: Session, days: int = 30) -> dict:
    since = datetime.now(tz=timezone.utc) - timedelta(days=days)
    base = select(BehaviorMetric).where(BehaviorMetric.created_at >= since)
    rows = list(db.scalars(base))
    if not rows:
        return {
            "sessions": 0,
            "page_views": 0,
            "clicks": 0,
            "cursor_points": 0,
            "avg_session_seconds": 0.0,
            "returning_sessions": 0,
        }

    sessions: dict[str, list[BehaviorMetric]] = {}
    for row in rows:
        sessions.setdefault(row.session_id, []).append(row)

    durations = []
    returning = 0
    for events in sessions.values():
        start = min(event.created_at for event in events)
        end = max(event.created_at for event in events)
        durations.append(max(0.0, (end - start).total_seconds()))
        if any(event.event_type == "return" for event in events):
            returning += 1

    return {
        "sessions": len(sessions),
        "page_views": sum(1 for row in rows if row.event_type == "page_view"),
        "clicks": sum(1 for row in rows if row.event_type == "click"),
        "cursor_points": sum(1 for row in rows if row.event_type in CURSOR_EVENTS),
        "avg_session_seconds": round(sum(durations) / len(durations), 1),
        "returning_sessions": returning,
    }


def count_events(db: Session) -> int:
    return int(db.scalar(select(func.count(BehaviorMetric.id))) or 0)
