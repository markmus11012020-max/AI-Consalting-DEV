"""Создание администратора из CLI.

    ADMIN_EMAIL=... ADMIN_PASSWORD=... python -m app.scripts.create_admin
"""

import os
import sys

from sqlalchemy import select

from app import crud
from app.core.db import Base, SessionLocal, engine
from app.models import Admin


def main() -> int:
    email = os.environ.get("ADMIN_EMAIL", "").strip()
    password = os.environ.get("ADMIN_PASSWORD", "")

    if not email or len(password) < 8:
        print(
            "Нужны ADMIN_EMAIL и ADMIN_PASSWORD (минимум 8 символов).",
            file=sys.stderr,
        )
        return 1

    Base.metadata.create_all(bind=engine)

    with SessionLocal() as db:
        admin = db.scalar(select(Admin).where(Admin.email == email.lower()))
        if admin is None:
            crud.admins.create_admin(db, email, password)
            print(f"Создан администратор {email}")
        else:
            crud.admins.set_password(db, admin, password)
            print(f"Пароль администратора {email} обновлён")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
