"""Демо-заявки для проверки скоринга: 4 hot, 3 warm, 3 cold.

    docker compose exec backend python -m app.scripts.seed_demo_applications
"""

from __future__ import annotations

import uuid
from datetime import datetime, timedelta, timezone

from app.core.db import Base, SessionLocal, engine
from app.models import Application
from app.schemas import ApplicationCreate
from app.services.scoring import score_application

DEMO: list[dict] = [
    # --- hot: 4 ---
    {
        "name": "Анна Соколова",
        "contact": "@anna_sokolova",
        "contact_type": "telegram",
        "business_type": "business",
        "company_size": "enterprise",
        "role": "owner",
        "budget": 450_000,
        "deadline_days": 5,
        "task_volume": 6,
        "message": "Нужен агент поддержки для 3 линий, интеграция с Bitrix24 и отчётность.",
    },
    {
        "name": "Дмитрий Орлов",
        "contact": "orlov@example.com",
        "contact_type": "email",
        "business_type": "business",
        "company_size": "medium",
        "role": "ceo",
        "budget": 320_000,
        "deadline_days": 7,
        "task_volume": 5,
        "message": "Автоматизация продаж: квалификация лидов и передача менеджерам.",
    },
    {
        "name": "Мария Ким",
        "contact": "+7 999 123-45-67",
        "contact_type": "phone",
        "business_type": "business",
        "company_size": "enterprise",
        "role": "директор",
        "budget": 600_000,
        "deadline_days": 3,
        "task_volume": 8,
        "message": "RAG по внутренним регламентам и договорам, контур on-premise.",
    },
    {
        "name": "Игорь Панов",
        "contact": "@ip_ceo",
        "contact_type": "telegram",
        "business_type": "business",
        "company_size": "small",
        "role": "founder",
        "budget": 300_000,
        "deadline_days": 6,
        "task_volume": 5,
        "message": "Торговый бот с бэктестом и риск-лимитами, запуск на Hyperliquid.",
    },
    # --- warm: 3 ---
    {
        "name": "Елена Гусева",
        "contact": "@elena_g",
        "contact_type": "telegram",
        "business_type": "business",
        "company_size": "small",
        "role": "manager",
        "budget": 90_000,
        "deadline_days": 30,
        "task_volume": 2,
        "message": "Хотим автоответы в Telegram по частым вопросам клиентов.",
    },
    {
        "name": "Сергей Лебедев",
        "contact": "lebedev@example.com",
        "contact_type": "email",
        "business_type": "business",
        "company_size": "medium",
        "role": "руководитель",
        "budget": 150_000,
        "deadline_days": 45,
        "task_volume": 3,
        "message": "Интеграция CRM с почтой и календарём, автоматические напоминания.",
    },
    {
        "name": "Ольга Романова",
        "contact": "@olga_roma",
        "contact_type": "telegram",
        "business_type": "personal",
        "company_size": "solo",
        "role": "specialist",
        "budget": 80_000,
        "deadline_days": 21,
        "task_volume": 2,
        "message": "Личный ассистент для планирования и работы с документами.",
    },
    # --- cold: 3 ---
    {
        "name": "Павел Новиков",
        "contact": "@pavel_n",
        "contact_type": "telegram",
        "business_type": "personal",
        "company_size": "",
        "role": "",
        "budget": 20_000,
        "deadline_days": 180,
        "task_volume": 1,
        "message": "Интересуюсь, что можно сделать за небольшие деньги.",
    },
    {
        "name": "Ирина Волкова",
        "contact": "volkova@example.com",
        "contact_type": "email",
        "business_type": "personal",
        "company_size": "solo",
        "role": "specialist",
        "budget": 30_000,
        "deadline_days": 120,
        "task_volume": 1,
        "message": "Просто узнать цены на бота для личного использования.",
    },
    {
        "name": "Артём Зайцев",
        "contact": "+7 900 000-00-00",
        "contact_type": "phone",
        "business_type": "business",
        "company_size": "",
        "role": "",
        "budget": 25_000,
        "deadline_days": 90,
        "task_volume": 1,
        "message": "Смотрим варианты, бюджет пока не утверждён.",
    },
]


def main() -> None:
    Base.metadata.create_all(bind=engine)
    now = datetime.now(tz=timezone.utc)

    with SessionLocal() as db:
        created = {"hot": 0, "warm": 0, "cold": 0}
        for index, item in enumerate(DEMO):
            payload = ApplicationCreate(
                **item,
                services=[],
                source="demo",
                page="/",
                session_id=f"demo-{uuid.uuid4().hex[:12]}",
                consent=True,
            )
            score, temperature, breakdown = score_application(payload)
            if created[temperature] >= {"hot": 4, "warm": 3, "cold": 3}[temperature]:
                continue
            db.add(
                Application(
                    **payload.model_dump(),
                    score=score,
                    temperature=temperature,
                    score_breakdown=breakdown,
                    status="new",
                    created_at=now - timedelta(days=index),
                )
            )
            created[temperature] += 1
        db.commit()

    print(f"Создано демо-заявок: {created}")


if __name__ == "__main__":
    main()
