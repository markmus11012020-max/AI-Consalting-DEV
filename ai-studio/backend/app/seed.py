"""Сид услуг и первичного администратора."""

from __future__ import annotations

import logging

from sqlalchemy import select
from sqlalchemy.orm import Session

from app import crud
from app.core.config import settings
from app.models import Service

logger = logging.getLogger("aillix.seed")

SEED_SERVICES: list[dict] = [
    {
        "slug": "agents",
        "title": "ИИ-агенты для продаж и поддержки",
        "summary": "Агент ведёт диалог по вашей базе знаний, квалифицирует лид и передаёт его в CRM с контекстом.",
        "outcome": "Быстрее ответ — больше сделок без роста команды.",
        "icon": "bot",
        "accent": "indigo",
        "price_min": 154_000,
        "price_max": 420_000,
        "duration_days_min": 21,
        "duration_days_max": 35,
        "highlights": ["Память и инструменты", "CRM и Telegram", "Передача человеку"],
        "sort_order": 10,
    },
    {
        "slug": "rag",
        "title": "RAG-система по вашим документам",
        "summary": "Ассистент отвечает по регламентам, договорам и базе знаний, а не по памяти модели.",
        "outcome": "Ответы со ссылками на источник и контролем галлюцинаций.",
        "icon": "database",
        "accent": "teal",
        "price_min": 196_000,
        "price_max": 520_000,
        "duration_days_min": 28,
        "duration_days_max": 42,
        "highlights": ["Metadata-driven retrieval", "Цитаты и проверка", "Локальный контур"],
        "sort_order": 20,
    },
    {
        "slug": "mvp",
        "title": "Live MVP под ключ",
        "summary": "Рабочий продукт на реальных данных за 2–4 недели: интерфейс, API, интеграции и деплой.",
        "outcome": "Проверяете гипотезу на рынке, а не в презентации.",
        "icon": "layers",
        "accent": "amber",
        "price_min": 126_000,
        "price_max": 360_000,
        "duration_days_min": 14,
        "duration_days_max": 28,
        "highlights": ["Web / Telegram / VK", "Надёжная архитектура", "Код и доступы у вас"],
        "sort_order": 30,
    },
    {
        "slug": "trading",
        "title": "Торговые боты для криптобирж",
        "summary": "Funding-арбитраж, исполнение сигналов и риск-менеджмент для Hyperliquid, dYdX, GMX.",
        "outcome": "Стратегия с бэктестом, paper-режимом и контролем просадки.",
        "icon": "chart",
        "accent": "rose",
        "price_min": 300_000,
        "price_max": 900_000,
        "duration_days_min": 21,
        "duration_days_max": 42,
        "highlights": ["Бэктест и paper", "Риск-лимиты", "PnL-дашборд"],
        "sort_order": 40,
    },
    {
        "slug": "automation",
        "title": "Автоматизация и интеграции",
        "summary": "Связываем CRM, почту, документы и внутренние сервисы в один управляемый процесс.",
        "outcome": "Меньше ручного ввода — меньше ошибок и потерь.",
        "icon": "workflow",
        "accent": "indigo",
        "price_min": 42_000,
        "price_max": 180_000,
        "duration_days_min": 7,
        "duration_days_max": 21,
        "highlights": ["AmoCRM / Bitrix24", "Документы и отчёты", "Очереди и вебхуки"],
        "sort_order": 50,
    },
    {
        "slug": "compliance",
        "title": "ИИ-комплаенс и безопасность",
        "summary": "Маскирование PII, разграничение доступа и аудит решений до вызова внешней модели.",
        "outcome": "ИИ можно внедрять без нарушения 152-ФЗ и внутренних политик.",
        "icon": "shield",
        "accent": "teal",
        "price_min": 84_000,
        "price_max": 260_000,
        "duration_days_min": 14,
        "duration_days_max": 28,
        "highlights": ["ФЗ-152 / ФЗ-115", "PII-маскирование", "Audit trail"],
        "sort_order": 60,
    },
]


def seed_services(db: Session) -> None:
    """Идемпотентный сид: обновляет только отсутствующие slug."""
    existing = {
        slug
        for slug in db.scalars(select(Service.slug))
    }
    created = 0
    for item in SEED_SERVICES:
        if item["slug"] in existing:
            continue
        db.add(Service(**item))
        created += 1
    if created:
        db.commit()
        logger.info("seeded services=%s", created)


def bootstrap_admin(db: Session) -> None:
    """Создаёт администратора только если админов ещё нет."""
    if crud.admins.count_admins(db) > 0:
        return
    if not settings.admin_email or not settings.admin_password:
        logger.warning("ADMIN_EMAIL/ADMIN_PASSWORD не заданы — админ не создан")
        return
    crud.admins.create_admin(db, settings.admin_email, settings.admin_password)
    logger.info("bootstrap admin created email=%s", settings.admin_email)
