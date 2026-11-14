"""Хеширование паролей и JWT.

Пароли: PBKDF2-HMAC-SHA256 (стандартная библиотека, без внешних зависимостей).
Токены: JWT HS256, срок жизни задаётся настройками.
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import os
from datetime import datetime, timedelta, timezone

import jwt

from app.core.config import settings

_ALGORITHM = "pbkdf2_sha256"
_ITERATIONS = 260_000


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), salt, _ITERATIONS
    )
    return "$".join(
        [
            _ALGORITHM,
            str(_ITERATIONS),
            base64.b64encode(salt).decode("ascii"),
            base64.b64encode(digest).decode("ascii"),
        ]
    )


def verify_password(password: str, stored: str) -> bool:
    try:
        algorithm, iterations, salt_b64, digest_b64 = stored.split("$")
        if algorithm != _ALGORITHM:
            return False
        salt = base64.b64decode(salt_b64)
        expected = base64.b64decode(digest_b64)
        actual = hashlib.pbkdf2_hmac(
            "sha256", password.encode("utf-8"), salt, int(iterations)
        )
        return hmac.compare_digest(expected, actual)
    except (ValueError, TypeError):
        return False


def create_access_token(subject: str, expires_minutes: int | None = None) -> str:
    minutes = expires_minutes or settings.jwt_expire_minutes
    now = datetime.now(tz=timezone.utc)
    payload = {
        "sub": subject,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(minutes=minutes)).timestamp()),
        "iss": "aillix",
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> dict:
    return jwt.decode(
        token,
        settings.jwt_secret,
        algorithms=[settings.jwt_algorithm],
        issuer="aillix",
    )
