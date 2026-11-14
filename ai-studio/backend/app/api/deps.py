from __future__ import annotations

from fastapi import Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.db import get_db
from app.core.security import decode_access_token
from app.models import Admin


def _extract_token(request: Request) -> str | None:
    token = request.cookies.get(settings.cookie_name)
    if token:
        return token
    header = request.headers.get("Authorization", "")
    if header.lower().startswith("bearer "):
        return header[7:].strip()
    return None


def get_current_admin(
    request: Request, db: Session = Depends(get_db)
) -> Admin:
    token = _extract_token(request)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Требуется авторизация",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = decode_access_token(token)
    except Exception:  # noqa: BLE001 — любая ошибка JWT = 401
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Сессия истекла, войдите снова",
            headers={"WWW-Authenticate": "Bearer"},
        ) from None

    email = payload.get("sub", "")
    admin = db.scalar(select(Admin).where(Admin.email == email))
    if admin is None or not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Администратор не найден или отключён",
        )
    return admin
