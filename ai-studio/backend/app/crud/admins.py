from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models import Admin


def count_admins(db: Session) -> int:
    return int(db.scalar(select(func.count(Admin.id))) or 0)


def get_by_email(db: Session, email: str) -> Admin | None:
    return db.scalar(select(Admin).where(Admin.email == email.lower().strip()))


def create_admin(db: Session, email: str, password: str) -> Admin:
    admin = Admin(
        email=email.lower().strip(),
        password_hash=hash_password(password),
        is_active=True,
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin


def set_password(db: Session, admin: Admin, password: str) -> Admin:
    admin.password_hash = hash_password(password)
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin


def touch_login(db: Session, admin: Admin) -> None:
    admin.last_login_at = datetime.now(tz=timezone.utc)
    db.add(admin)
    db.commit()
