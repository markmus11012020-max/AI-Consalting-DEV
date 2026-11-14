# Aillix — сайт, API и инфраструктура

Next.js 15 (App Router) · TypeScript · Tailwind CSS 3 · FastAPI · PostgreSQL ·
Nginx · Docker Compose.

Репозиторий закрывает три учебных блока; этот README описывает состояние после
Блока 2 (тег `hw-2`).

## Блоки

| Блок | Что добавлено | Документ |
|---|---|---|
| 1 | Docker Compose: Nginx, PostgreSQL, pgAdmin, Watchtower, Registry | [docs/homework/block-1.md](docs/homework/block-1.md) |
| 2 | FastAPI: модели, CRUD, роуты, услуги с вилкой цен, форма на API | [docs/homework/block-2.md](docs/homework/block-2.md) |
| 3 | JWT-админка, CRUD услуг, метрики, heatmap, скоринг | в разработке |

## Архитектура

```
Internet → host Nginx :443 → 127.0.0.1:8080 → nginx
                                               ├── /      → web (Next.js)
                                               └── /api/  → backend (FastAPI)
                                                              │
                                                              ▼
                                                         postgres (data, internal)
```

Сети: `edge` (nginx, web, backend), `data` (backend, postgres, pgAdmin),
`registry`. Порты 5432, 8000, 5050, 5000 наружу не публикуются.

## Быстрый старт

```bash
cd ai-studio
cp .env.example .env
docker compose up -d --build
curl http://127.0.0.1:8080/healthz
curl http://127.0.0.1:8080/api/health
```

## Фронтенд

```bash
npm install
cp .env.example .env.local
npm run dev
```

| Скрипт | Что делает |
|---|---|
| `npm run build` | Прод-сборка (`.next/standalone`) |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Unit-тесты (Vitest) |

## Почему Next.js, а не Vite

Сайт использует SSR, метаданные, sitemap и серверные запросы к API. Vite
собирает SPA в `dist` и потребовал бы переписать роутинг и SEO-слой.
Прод-артефакт Next.js — `.next/standalone`, он собирается через `npm run build`.

## Backend

```
backend/app/
├── api/routes/   # health, services, applications, metrics, auth, admin
├── core/         # config, db, security
├── crud/         # доступ к данным
├── models/       # Service, Application, BehaviorMetric, Admin
├── schemas/      # Pydantic-контракты
└── services/scoring.py
```

Модели: `Service` (вилка `price_min`/`price_max`, срок, `is_active`),
`Application` (контакты, квалификация, скор, статус), `BehaviorMetric`
(события, нормализованные координаты), `Admin` (JWT-доступ).

### API

| Метод | Путь | Доступ |
|---|---|---|
| GET | `/api/health` | публично |
| GET | `/api/services` | публично |
| POST | `/api/applications` | публично |
| POST | `/api/metrics` | публично |
| POST | `/api/auth/login` | публично |
| GET | `/api/admin/*` | cookie/Bearer |

## Интеграция формы и услуг

- `src/lib/api/services.ts` запрашивает `http://backend:8000/api/services`
  на сервере с `revalidate: 300`; при сбое используется статический каталог.
- `src/components/lead/lead-form.tsx` валидирует данные zod-схемой и отправляет
  их в `POST /api/applications`; бэкенд считает скор и возвращает температуру.

## Деплой

Ubuntu 24.04.4 LTS. Схема — host Nginx (TLS) + контейнерный Nginx на loopback.

```bash
git clone <repo-url> /opt/aillix
cd /opt/aillix/ai-studio
cp .env.example .env && chmod 600 .env
docker compose up -d --build
sudo cp deploy/nginx.conf /etc/nginx/sites-available/aillix
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d aillix.ru -d www.aillix.ru
```

Логи backend: `docker logs -f aillix-backend`.

## Проверки

```bash
npm run lint && npm run typecheck && npm run test && npm run build
docker compose config -q
python -m compileall backend/app
```
