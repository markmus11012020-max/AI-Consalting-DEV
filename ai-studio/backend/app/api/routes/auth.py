from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app import crud
from app.core.config import settings
from app.core.db import get_db
from app.core.security import create_access_token, verify_password
from app.models import Admin
from app.schemas import AdminRead, LoginRequest, TokenResponse
from app.api.deps import get_current_admin

router = APIRouter(prefix="/auth", tags=["auth"])


def _set_auth_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=settings.cookie_name,
        value=token,
        max_age=settings.jwt_expire_minutes * 60,
        httponly=True,
        secure=settings.cookie_secure,
        samesite=settings.cookie_samesite,
        path="/",
    )


@router.post("/login", response_model=TokenResponse)
def login(
    payload: LoginRequest, response: Response, db: Session = Depends(get_db)
) -> TokenResponse:
    admin: Admin | None = crud.admins.get_by_email(db, payload.email)
    if admin is None or not admin.is_active or not verify_password(
        payload.password, admin.password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный e-mail или пароль",
        )

    token = create_access_token(admin.email)
    _set_auth_cookie(response, token)
    crud.admins.touch_login(db, admin)

    return TokenResponse(
        access_token=token, admin=AdminRead.model_validate(admin)
    )


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response) -> Response:
    response.delete_cookie(settings.cookie_name, path="/")
    response.status_code = status.HTTP_204_NO_CONTENT
    return response


@router.get("/me", response_model=AdminRead)
def me(admin: Admin = Depends(get_current_admin)) -> AdminRead:
    return AdminRead.model_validate(admin)
