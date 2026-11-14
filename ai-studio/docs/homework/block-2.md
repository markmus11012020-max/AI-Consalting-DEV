# Блок 2 — FastAPI, PostgreSQL, услуги и форма на API

Тег: `hw-2`. Репозиторий: https://github.com/markmus11012020-max/AI-Consalting-DEV

## Соответствие требованиям (5 предложений)

Бэкенд реализован на FastAPI в каталоге `backend/app` и разделён на слои:
`models` (SQLAlchemy), `schemas` (Pydantic), `crud`, `api/routes` и `core` с
драйвером БД. В PostgreSQL хранятся четыре таблицы — `services`, `applications`,
`behavior_metrics` и `admins`; три доменные модели покрывают требование задания,
а `admins` нужна для авторизации Блока 3. Услуги содержат вилку цены
(`price_min`/`price_max`), срок в днях, список преимуществ и признак активности,
а публичный `GET /api/services` отдаёт только активные позиции. Форма на
Next.js больше не отправляет заявку в JSONL: она валидируется zod-схемой и
уходит в `POST /api/applications`, где сохраняется в PostgreSQL и сразу получает
скоринг. Сборка фронтенда выполняется командой `npm run build`
(`output: "standalone"`), Nginx проксирует `/api/` в контейнер `backend`, а
логи смотрятся через `docker logs -f backend`.

## Модель данных

### Service

- `slug`, `title`, `summary`, `outcome`, `icon`, `accent`;
- `price_min`, `price_max`, `currency` — вилка цены;
- `duration_days_min`, `duration_days_max`;
- `highlights` (JSON-массив), `sort_order`, `is_active`;
- мягкое удаление: запись не удаляется, чтобы не ломать историю заявок.

### Application

- контакты и канал связи (`contact_type`);
- квалификация: `business_type`, `company_size`, `role`, `budget`,
  `deadline_days`, `task_volume`, `services`;
- источник: `source`, `page`, `utm`, `session_id`;
- результат: `score`, `temperature`, `score_breakdown`, `status`.

### BehaviorMetric

- `session_id`, `application_id` (nullable до отправки формы);
- `event_type`: `page_view`, `click`, `cursor`, `scroll`, `form_start`,
  `submit`, `return`;
- `x`/`y` в диапазоне `0..1`, `viewport_w`/`viewport_h`, `duration_ms`, `meta`.

## Слои `core`

| Файл | Назначение |
|---|---|
| `core/config.py` | pydantic-settings, чтение `.env` |
| `core/db.py` | engine, `SessionLocal`, `Base`, `get_db` |
| `core/security.py` | PBKDF2-пароли, JWT HS256 |
| `core/models.py` | единая точка импорта моделей для `create_all` |

## Эндпоинты

| Метод | Путь | Описание |
|---|---|---|
| GET | `/api/health` | healthcheck |
| GET | `/api/services` | активные услуги |
| GET | `/api/services/{slug}` | одна услуга |
| POST | `/api/applications` | заявка, возвращает `score` и `temperature` |
| POST | `/api/metrics` | батч событий (до 50 за раз) |
| POST | `/api/auth/login` | JWT + HttpOnly-cookie |
| GET | `/api/auth/me` | текущий администратор |
| GET | `/api/admin/*` | защищённые разделы (Блок 3) |

## Интеграция с фронтендом

- `src/lib/api/services.ts` запрашивает `http://backend:8000/api/services`
  из серверного компонента с `revalidate: 300`; при недоступности API
  используется статический каталог `SERVICES` из `content.ts`.
- Форма `src/components/lead/lead-form.tsx` собирает квалификацию
  (бюджет, срок, роль, размер команды, объём задач) и отправляет JSON в
  `/api/applications`.
- Нормализация цены и срока в карточке услуги выполняется на фронтенде:
  `price_min` → «от N ₽», дни → недели.

## Отклонения и почему

1. **Четыре модели вместо трёх.** `admins` — инфраструктурная таблица для
   Блока 3, доменных сущностей по-прежнему три.
2. **`create_all` вместо Alembic.** Для учебного контура достаточно; в README
   указано, что для production-миграций нужен Alembic.
3. **Скоринг на бэкенде, а не на клиенте.** Клиент не может подделать
   приоритет заявки.
4. **`services` как JSON-массив slug'ов.** Заявка хранит снимок выбора и не
   зависит от последующих правок каталога.
5. **Дублирующий `/api/lead` оставлен.** Next.js-роут работает локально без
   Docker; в проде `/api/*` уходит в FastAPI.

## Команды

```bash
# backend локально
cd backend
python -m venv .venv && . .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
export DATABASE_URL=postgresql+psycopg://aillix:...@localhost:5432/aillix
uvicorn app.main:app --reload --port 8000

# весь контур
docker compose up -d --build
docker compose logs -f backend
curl -s http://127.0.0.1:8080/api/services | head
```

Проверка формы:

```bash
curl -s -X POST http://127.0.0.1:8080/api/applications \
  -H 'Content-Type: application/json' \
  -d '{"name":"Тест","contact":"@test_user","contact_type":"telegram",
       "message":"Нужен агент поддержки","business_type":"business",
       "company_size":"medium","role":"owner","budget":300000,
       "deadline_days":7,"task_volume":5,"consent":true}'
```

## Чек-лист скриншотов

1. `docker compose ps` — `backend` и `postgres` здоровы.
2. `docker logs -f backend` — старт, сид услуг, запросы.
3. `curl /api/services` — JSON с вилками цен.
4. `npm run build` — успешная сборка.
5. Форма на сайте — заполненные поля квалификации.
6. Ответ `POST /api/applications` — `score` и `temperature`.
7. `psql`/pgAdmin: `select id, title, price_min, price_max from services;`.
8. Секция «Услуги» на сайте — карточки из БД.
