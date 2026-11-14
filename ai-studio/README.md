# Aillix — сайт-визитка и инфраструктура

Next.js 15 (App Router) · TypeScript · Tailwind CSS 3 · Docker Compose · Nginx ·
PostgreSQL.

Репозиторий закрывает три учебных блока; этот README описывает состояние после
Блока 1 (тег `hw-1`).

## Блок 1 — инфраструктура

| Требование | Реализация |
|---|---|
| Docker Compose | `docker-compose.yml`, проект `aillix` |
| Nginx | контейнер `aillix-nginx` на `127.0.0.1:8080` + host Nginx на 443 |
| PostgreSQL | `postgres:16-alpine`, volume `postgres_data`, сеть `data` |
| pgAdmin | `dpage/pgadmin4:8`, профиль `tools`, `127.0.0.1:5050` |
| Watchtower | `containrrr/watchtower:1.7.1`, только контейнеры с label |
| Локальный Registry | `registry:2.8`, htpasswd, TLS на `registry.aillix.ru` |
| Backend закомментирован | блок `backend` в compose и `location /api/` в Nginx |
| `.env` | `.env.example` со всеми переменными |
| `create-user.sh` | `scripts/create-user.sh` |
| Внешний registry | `docker login registry.aillix.ru` |
| Изоляция | сети `edge`, `data` (internal), `registry` |
| API/DB только внутри | порты 8000/5432 не публикуются |

```
Internet → host Nginx :443 → 127.0.0.1:8080 → nginx → web (Next.js :3000)
registry.aillix.ru → host Nginx :443 → 127.0.0.1:5000 → registry
postgres :5432 — только сеть data (internal)
```

## Быстрый старт

```bash
cd ai-studio
cp .env.example .env && chmod 600 .env
docker compose config -q
docker compose up -d --build
docker compose --profile tools up -d
curl -fsS http://127.0.0.1:8080/healthz
```

## Фронтенд

```bash
npm install
cp .env.example .env.local
npm run dev
```

| Скрипт | Что делает |
|---|---|
| `npm run dev` | Dev-сервер с Turbopack |
| `npm run build` | Прод-сборка (`.next/standalone`) |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Unit-тесты (Vitest) |

## Почему Next.js, а не Vite

Сайт использует SSR, метаданные, sitemap и серверные запросы. Vite собирает SPA
в `dist` и потребовал бы переписать роутинг и SEO-слой. Прод-артефакт Next.js —
`.next/standalone`, он собирается через `npm run build`, поэтому требование к
сборке выполнено без смены фреймворка.

## Переменные окружения

Полный список — в [.env.example](.env.example). Критичные для Блока 1:

```env
POSTGRES_DB=aillix
POSTGRES_USER=aillix
POSTGRES_PASSWORD=...
PGADMIN_DEFAULT_EMAIL=admin@aillix.ru
PGADMIN_DEFAULT_PASSWORD=...
REGISTRY_HOST=registry.aillix.ru
REGISTRY_HTTP_SECRET=...
```

## Пользователи

```bash
./scripts/create-user.sh registry deploy   # htpasswd для Registry
./scripts/create-user.sh db readonly       # роль PostgreSQL только на чтение
```

## Деплой

Фактическая версия сервера — Ubuntu 24.04.4 LTS (в задании 22.04, отличие
зафиксировано в `docs/homework/block-1.md`).

```bash
git clone <repo-url> /opt/aillix
cd /opt/aillix/ai-studio
cp .env.example .env && chmod 600 .env
docker compose up -d --build
sudo cp deploy/nginx.conf /etc/nginx/sites-available/aillix
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d aillix.ru -d www.aillix.ru
sudo certbot --nginx -d registry.aillix.ru
```

## Документация блоков

- [Блок 1](docs/homework/block-1.md) — инфраструктура.
- Блок 2 и Блок 3 добавляются отдельными коммитами и тегами `hw-2`, `hw-3`.
