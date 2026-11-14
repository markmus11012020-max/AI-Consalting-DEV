# Aillix — сайт и API для ИИ-консалтинга

Публичный сайт-визитка, FastAPI-бэкенд и админ-панель в одном контуре.
Next.js 15 (App Router) · TypeScript · Tailwind CSS 3 · FastAPI · PostgreSQL ·
Nginx · Docker Compose.

Проект закрывает три учебных блока:

| Блок | Что добавлено | Документ |
|---|---|---|
| 1 | Docker Compose: Nginx, PostgreSQL, pgAdmin, Watchtower, локальный Registry | [docs/homework/block-1.md](docs/homework/block-1.md) |
| 2 | FastAPI: модели, CRUD, роуты, сервисы с вилкой цен, форма на API | [docs/homework/block-2.md](docs/homework/block-2.md) |
| 3 | JWT-админка, CRUD-таблица услуг, метрики, heatmap, скоринг лидов | [docs/homework/block-3.md](docs/homework/block-3.md) |

## Стек и почему так

- **Next.js 15 остаётся** вместо перехода на Vite. Проект — SSR-сайт с
  метаданными, sitemap, OG-изображением и серверными запросами к API. Vite
  собирает SPA в `dist` и потребовал бы переписать роутинг, SEO и серверный
  слой. Прод-артефакт Next.js — `.next/standalone`; он собирается командой
  `npm run build` и запускается как обычный Node-сервер, поэтому требование
  «сборка через `npm run build`» выполнено без смены фреймворка.
- **FastAPI** — отдельный сервис в контейнере, доступен только через Nginx.
- **PostgreSQL 16** — единственное хранилище заявок, услуг и метрик.
- **Nginx** — единственная точка входа: TLS, статика, проксирование `/api`.
- **pgAdmin, Registry, Watchtower** — профиль `tools`, в проде выключены.

## Архитектура

```
Internet
   │  443 (TLS)
   ▼
host Nginx  ──► 127.0.0.1:8080 ──► nginx (container, network edge)
                                   ├── /        → web (Next.js :3000)
                                   └── /api/    → backend (FastAPI :8000)
                                                      │
                                                      ▼
                                                 postgres :5432 (network data, internal)

registry.aillix.ru ──► host Nginx ──► 127.0.0.1:5000 (registry, profile tools)
pgAdmin ──► 127.0.0.1:5050 (профиль tools, только SSH-туннель)
```

Сети:

- `edge` — nginx, web, backend;
- `data` — backend, postgres, pgAdmin (`internal: true`, без выхода в интернет);
- `registry` — только registry.

Порты `5432`, `8000`, `5050`, `5000` наружу не публикуются.

## Быстрый старт (полный контур)

```bash
cd ai-studio
cp .env.example .env
# отредактируйте секреты: POSTGRES_PASSWORD, JWT_SECRET, ADMIN_PASSWORD
docker compose up -d --build
curl http://127.0.0.1:8080/healthz
curl http://127.0.0.1:8080/api/health
```

Сайт: `http://localhost:8080` · API: `http://localhost:8080/api/docs`
(доки включаются `BACKEND_DOCS_ENABLED=true` только локально).

### Только фронтенд, без Docker

```bash
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000
```

Если backend недоступен, каталог услуг берётся из `src/lib/content.ts`,
а форма покажет понятную ошибку вместо падения страницы.

| Скрипт | Что делает |
|---|---|
| `npm run dev` | Dev-сервер с Turbopack |
| `npm run build` | Прод-сборка (`.next/standalone`) |
| `npm run start` | Запуск прод-сборки |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Unit-тесты (Vitest) |

## Структура

```
ai-studio/
├── src/
│   ├── app/                  # страницы: /, /admin, /privacy, API health
│   ├── components/
│   │   ├── admin/            # панель: заявки, услуги, метрики
│   │   ├── analytics/        # BehaviorTracker
│   │   ├── hero/             # модалка сроков запуска
│   │   ├── lead/             # форма заявки
│   │   └── sections/         # секции лендинга
│   ├── lib/
│   │   ├── api/services.ts   # услуги из FastAPI с фолбэком
│   │   ├── admin/api.ts      # типизированный клиент админки
│   │   ├── metrics/client.ts # батчи поведенческих событий
│   │   └── lead/schema.ts    # zod-схема формы
│   └── types/                # типы домена и админки
├── backend/
│   └── app/
│       ├── api/routes/       # health, services, applications, metrics, auth, admin
│       ├── core/             # config, db, security
│       ├── crud/             # доступ к данным
│       ├── models/           # Service, Application, BehaviorMetric, Admin
│       ├── schemas/          # Pydantic-контракты
│       ├── services/scoring.py
│       └── scripts/          # create_admin, seed_demo_applications
├── deploy/
│   ├── nginx.conf            # host Nginx (TLS, registry)
│   └── nginx.container.conf  # Nginx внутри compose
├── scripts/create-user.sh
└── docs/homework/block-*.md
```

## API

| Метод | Путь | Доступ | Назначение |
|---|---|---|---|
| GET | `/api/health` | публично | healthcheck |
| GET | `/api/services` | публично | активные услуги |
| POST | `/api/applications` | публично | заявка + скоринг |
| POST | `/api/metrics` | публично | батч поведенческих событий |
| POST | `/api/auth/login` | публично | вход админа, HttpOnly-cookie |
| POST | `/api/auth/logout` | cookie | выход |
| GET | `/api/auth/me` | cookie | текущий админ |
| GET | `/api/admin/stats` | cookie | сводка по заявкам |
| GET/PATCH | `/api/admin/applications` | cookie | список и статусы |
| GET/POST/PATCH/DELETE | `/api/admin/services` | cookie | CRUD услуг |
| GET | `/api/admin/metrics/summary` | cookie | агрегаты поведения |
| GET | `/api/admin/metrics/heatmap` | cookie | сетка heatmap |

Swagger поддерживает и `Bearer`-токен (`/api/auth/login` возвращает
`access_token`), но браузерная админка использует HttpOnly-cookie.

## Скоринг заявок

Прозрачная rule-based формула, не «AI-магия». Максимум 95 баллов:

| Фактор | Баллы |
|---|---|
| Срочность (срок) | 4–30 |
| Бюджет | 5–25 |
| Роль | 4–15 |
| Размер компании | 3–10 |
| Объём задач | 3–10 |
| Вовлечённость (метрики) | 0–5 |

Порог: `hot ≥ 70`, `warm 40–69`, `cold < 40`. Разбивка по слагаемым
сохраняется в `applications.score_breakdown` и видна в админке.

## Поведенческие метрики

- `page_view`, `click`, `cursor`, `scroll`, `form_start`, `submit`, `return`;
- батч каждые 8 секунд + `sendBeacon` при уходе со страницы;
- координаты нормализованы в `0..1`, heatmap строится по сетке 20×20;
- `session_id` связывает события с заявкой после отправки формы;
- endpoint принимает не более 1 запроса в секунду с IP — клиент штатно
  отправляет пачки, поэтому лимит не мешает.

## Админ-панель

`/admin`:

- вход по e-mail и паролю, JWT в HttpOnly/Secure/SameSite=Strict cookie;
- регистрация только при пустой таблице `admins` (bootstrap из `.env`);
- таблица заявок с фильтрами, скором и расшифровкой баллов;
- визуальный CRUD услуг с мягким удалением (`is_active=false`);
- метрики: сессии, клики, курсор, средняя сессия, heatmap.

## Переменные окружения

Полный список — в [.env.example](.env.example). Критичные:

```env
POSTGRES_DB=aillix
POSTGRES_USER=aillix
POSTGRES_PASSWORD=...
JWT_SECRET=...            # openssl rand -hex 32
ADMIN_EMAIL=admin@aillix.ru
ADMIN_PASSWORD=...        # только для первого запуска
LEAD_EXTERNAL_DELIVERY=false
BACKEND_DOCS_ENABLED=false
```

## Деплой (Ubuntu 24.04, host Nginx + Docker)

Фактическая версия сервера — **Ubuntu 24.04.4 LTS** (в задании указана 22.04;
отличие зафиксировано в документации блока 1).

```bash
git clone <repo-url> /opt/aillix
cd /opt/aillix/ai-studio
cp .env.example .env && chmod 600 .env
docker compose up -d --build

# host Nginx: TLS и проксирование на 127.0.0.1:8080
sudo cp deploy/nginx.conf /etc/nginx/sites-available/aillix
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d aillix.ru -d www.aillix.ru
sudo certbot --nginx -d registry.aillix.ru
```

Порядок важен: файл `deploy/nginx.conf` содержит блок `registry.aillix.ru` с
сертификатом, поэтому при первом развёртывании сначала ставят конфиг без этого
блока, выпускают сертификат (`certbot certonly --webroot -w /var/www/certbot
-d registry.aillix.ru`), и только потом копируют полный файл и делают `reload`.

### Факт развёртывания (14.11.2026)

| Проверка | Результат |
|---|---|
| `https://aillix.ru/` | 200, новая версия лендинга |
| `https://aillix.ru/admin` | 200, форма входа |
| `GET /api/health` | `{"status":"ok","service":"aillix-api"}` |
| `GET /api/services` | 6 услуг из PostgreSQL |
| Демо-заявки | 4 hot / 3 warm / 3 cold, средний скор 58.9 |
| Метрики | 85 точек курсора, 54 ячейки heatmap |
| Внешний `docker login registry.aillix.ru` | `Login Succeeded` |
| `push` в Registry | `aillix-web` в `/v2/_catalog` |
| Порты 3000/5000/5050/5432/8000/8080 снаружи | refused/filtered |
| `ufw` | allow 22, 80, 443; default deny incoming |

### Локальный Registry

```bash
./scripts/create-user.sh registry deploy    # логин registry-пользователя
docker compose --profile tools up -d registry
docker login registry.aillix.ru
docker tag aillix-web:latest registry.aillix.ru/aillix-web:latest
docker push registry.aillix.ru/aillix-web:latest
```

### Watchtower

Обновляет только контейнеры с меткой
`com.centurylinklabs.watchtower.enable=true` (`WATCHTOWER_LABEL_ENABLE=true`).
PostgreSQL и Registry намеренно не помечены: автообновление БД недопустимо.

### pgAdmin

```bash
docker compose --profile tools up -d pgadmin
ssh -L 5050:127.0.0.1:5050 user@server
```

В Блоке 3 профиль `tools` не запускается: pgAdmin, Registry и Watchtower
остановлены, наружу открыт только 443.

## Безопасность

- наружу опубликован только `443` (и `80` для redirect/ACME);
- БД и API доступны только внутри Docker-сетей;
- JWT в HttpOnly-cookie, `SameSite=Strict`, `Secure`;
- пароли — PBKDF2-HMAC-SHA256 с солью;
- данные не покидают сервер: `LEAD_EXTERNAL_DELIVERY=false` отключает
  Telegram/e-mail/VK;
- в контейнерах `no-new-privileges`, у backend и web — непривилегированный
  пользователь;
- `server_tokens off`, security-заголовки на Nginx и FastAPI.

## Комплаенс

- форма требует явного согласия на обработку ПД;
- политика `/privacy` описывает поведенческие метрики;
- внешние LLM в рантайме сайта не используются;
- старые заявки из `data/leads.jsonl` сохранены как архив и не импортированы.

## Проверки перед релизом

```bash
npm run lint && npm run typecheck && npm run test && npm run build
docker compose config -q
python -m compileall backend/app
```
