from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

ContactType = Literal["telegram", "email", "phone", "whatsapp", "vk"]
BusinessType = Literal["personal", "business"]
CompanySize = Literal["", "solo", "small", "medium", "enterprise"]
Temperature = Literal["hot", "warm", "cold"]
ApplicationStatus = Literal["new", "in_progress", "won", "lost"]


class ServiceBase(BaseModel):
    slug: str = Field(min_length=2, max_length=80, pattern=r"^[a-z0-9-]+$")
    title: str = Field(min_length=2, max_length=160)
    summary: str = Field(min_length=2, max_length=1000)
    outcome: str = Field(default="", max_length=240)
    icon: str = Field(default="bot", max_length=40)
    accent: Literal["indigo", "teal", "amber", "rose"] = "indigo"
    price_min: int = Field(ge=0)
    price_max: int = Field(ge=0)
    currency: str = Field(default="RUB", max_length=3)
    duration_days_min: int = Field(default=3, ge=1, le=365)
    duration_days_max: int = Field(default=5, ge=1, le=365)
    highlights: list[str] = Field(default_factory=list)
    sort_order: int = 0
    is_active: bool = True

    @field_validator("price_max")
    @classmethod
    def price_range(cls, value: int, info) -> int:
        price_min = info.data.get("price_min")
        if price_min is not None and value < price_min:
            raise ValueError("price_max должен быть не меньше price_min")
        return value

    @field_validator("duration_days_max")
    @classmethod
    def duration_range(cls, value: int, info) -> int:
        duration_min = info.data.get("duration_days_min")
        if duration_min is not None and value < duration_min:
            raise ValueError(
                "duration_days_max должен быть не меньше duration_days_min"
            )
        return value


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    slug: str | None = Field(default=None, pattern=r"^[a-z0-9-]+$")
    title: str | None = Field(default=None, min_length=2, max_length=160)
    summary: str | None = Field(default=None, min_length=2, max_length=1000)
    outcome: str | None = Field(default=None, max_length=240)
    icon: str | None = Field(default=None, max_length=40)
    accent: Literal["indigo", "teal", "amber", "rose"] | None = None
    price_min: int | None = Field(default=None, ge=0)
    price_max: int | None = Field(default=None, ge=0)
    currency: str | None = Field(default=None, max_length=3)
    duration_days_min: int | None = Field(default=None, ge=1, le=365)
    duration_days_max: int | None = Field(default=None, ge=1, le=365)
    highlights: list[str] | None = None
    sort_order: int | None = None
    is_active: bool | None = None


class ServiceRead(ServiceBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime


class ApplicationCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    contact: str = Field(min_length=2, max_length=200)
    contact_type: ContactType = "telegram"
    message: str = Field(default="", max_length=4000)
    business_type: BusinessType = "business"
    company_size: CompanySize = ""
    role: str = Field(default="", max_length=40)
    budget: int | None = Field(default=None, ge=0, le=100_000_000)
    deadline_days: int | None = Field(default=None, ge=1, le=3650)
    task_volume: int = Field(default=1, ge=1, le=50)
    services: list[str] = Field(default_factory=list)
    source: str = Field(default="site", max_length=60)
    page: str = Field(default="/", max_length=200)
    utm: str = Field(default="", max_length=300)
    session_id: str = Field(default="", max_length=64)
    consent: bool

    @field_validator("consent")
    @classmethod
    def consent_required(cls, value: bool) -> bool:
        if not value:
            raise ValueError("Нужно согласие на обработку персональных данных")
        return value


class ApplicationAdminUpdate(BaseModel):
    status: ApplicationStatus | None = None
    admin_comment: str | None = Field(default=None, max_length=2000)


class ApplicationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    public_id: str
    name: str
    contact: str
    contact_type: str
    message: str
    business_type: str
    company_size: str
    role: str
    budget: int | None
    deadline_days: int | None
    task_volume: int
    services: list[str]
    source: str
    page: str
    utm: str
    session_id: str
    consent: bool
    score: int
    temperature: str
    score_breakdown: dict
    status: str
    admin_comment: str
    created_at: datetime


class ApplicationCreated(BaseModel):
    public_id: str
    score: int
    temperature: str


class AdminRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    is_active: bool
    created_at: datetime
    last_login_at: datetime | None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=200)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    admin: AdminRead


class MetricEvent(BaseModel):
    session_id: str = Field(min_length=8, max_length=64)
    event_type: Literal[
        "page_view", "click", "cursor", "scroll", "form_start", "submit", "return"
    ]
    path: str = Field(default="/", max_length=200)
    element: str = Field(default="", max_length=120)
    x: float | None = Field(default=None, ge=0, le=1)
    y: float | None = Field(default=None, ge=0, le=1)
    viewport_w: int | None = Field(default=None, ge=1, le=20000)
    viewport_h: int | None = Field(default=None, ge=1, le=20000)
    duration_ms: int = Field(default=0, ge=0, le=86_400_000)
    meta: dict = Field(default_factory=dict)


class MetricBatch(BaseModel):
    events: list[MetricEvent] = Field(min_length=1, max_length=50)


class MetricAccepted(BaseModel):
    accepted: int


class HeatmapCell(BaseModel):
    x: int
    y: int
    weight: int


class HeatmapResponse(BaseModel):
    total_points: int
    grid: int
    cells: list[HeatmapCell]


class MetricsSummary(BaseModel):
    sessions: int
    page_views: int
    clicks: int
    cursor_points: int
    avg_session_seconds: float
    returning_sessions: int


class StatsResponse(BaseModel):
    total: int
    hot: int
    warm: int
    cold: int
    by_status: dict[str, int]
    avg_score: float
