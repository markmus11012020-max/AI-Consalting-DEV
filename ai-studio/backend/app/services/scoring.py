"""Прозрачная rule-based модель скоринга заявок.

Не «ИИ», а объяснимая формула: каждое слагаемое видно администратору.
Максимум 95 баллов, порог hot — 70, warm — 40.
"""

from __future__ import annotations

from app.schemas import ApplicationCreate

HOT_THRESHOLD = 70
WARM_THRESHOLD = 40

_ROLE_WEIGHTS = {
    "owner": 15,
    "founder": 15,
    "ceo": 15,
    "владелец": 15,
    "основатель": 15,
    "директор": 15,
    "head": 12,
    "cto": 12,
    "cmo": 12,
    "руководитель": 12,
    "manager": 8,
    "менеджер": 8,
    "specialist": 5,
    "специалист": 5,
    "developer": 5,
    "разработчик": 5,
}

_COMPANY_WEIGHTS = {
    "enterprise": 10,
    "medium": 8,
    "small": 6,
    "solo": 3,
    "": 4,
}


def _deadline_score(days: int | None) -> int:
    if days is None:
        return 10
    if days <= 7:
        return 30
    if days <= 14:
        return 26
    if days <= 30:
        return 21
    if days <= 60:
        return 14
    if days <= 90:
        return 9
    return 4


def _budget_score(budget: int | None) -> int:
    if budget is None:
        return 8
    if budget >= 300_000:
        return 25
    if budget >= 150_000:
        return 20
    if budget >= 80_000:
        return 15
    if budget >= 30_000:
        return 10
    return 5


def _role_score(role: str) -> int:
    key = role.strip().lower()
    return _ROLE_WEIGHTS.get(key, 4)


def _company_score(company_size: str) -> int:
    return _COMPANY_WEIGHTS.get(company_size, 4)


def _volume_score(task_volume: int) -> int:
    if task_volume >= 5:
        return 10
    if task_volume >= 3:
        return 7
    if task_volume == 2:
        return 5
    return 3


def engagement_score(engagement: dict | None) -> tuple[int, dict]:
    """0–5 баллов за вовлечённость по метрикам сессии."""
    metrics = engagement or {}
    parts = {
        "page_views": 1 if metrics.get("page_views", 0) >= 3 else 0,
        "clicks": 1 if metrics.get("clicks", 0) >= 5 else 0,
        "time": 1 if metrics.get("duration_seconds", 0) >= 60 else 0,
        "returning": 1 if metrics.get("returning") else 0,
        "cursor": 1 if metrics.get("cursor_points", 0) >= 30 else 0,
    }
    return sum(parts.values()), parts


def score_application(
    payload: ApplicationCreate, engagement: dict | None = None
) -> tuple[int, str, dict]:
    engagement_total, engagement_parts = engagement_score(engagement)
    breakdown = {
        "deadline": _deadline_score(payload.deadline_days),
        "budget": _budget_score(payload.budget),
        "role": _role_score(payload.role),
        "company_size": _company_score(payload.company_size),
        "task_volume": _volume_score(payload.task_volume),
        "engagement": engagement_total,
        "engagement_parts": engagement_parts,
    }
    total = sum(
        breakdown[key]
        for key in ("deadline", "budget", "role", "company_size", "task_volume", "engagement")
    )
    total = max(0, min(total, 100))

    if total >= HOT_THRESHOLD:
        temperature = "hot"
    elif total >= WARM_THRESHOLD:
        temperature = "warm"
    else:
        temperature = "cold"

    breakdown["total"] = total
    return total, temperature, breakdown
