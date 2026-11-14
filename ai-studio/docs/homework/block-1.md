# Блок 1 — Docker Compose, Nginx, PostgreSQL, pgAdmin, Watchtower, Registry

Тег: `hw-1`. Репозиторий: https://github.com/markmus11012020-max/AI-Consalting-DEV

## Соответствие требованиям (5 предложений)

Контур собран в `ai-studio/docker-compose.yml`: Nginx принимает трафик, PostgreSQL
хранит данные, pgAdmin, Watchtower и локальный Docker Registry вынесены в профиль
`tools` и запускаются отдельно. Публично опубликован только Nginx (`127.0.0.1:8080`
для host-прокси), а PostgreSQL доступен исключительно внутри внутренней
Docker-сети `data` с флагом `internal: true`, поэтому прямой доступ к порту 5432
из интернета технически невозможен. Секреты и параметры вынесены в `.env`
(шаблон — `.env.example`, сам `.env` в git не попадает), а для управления
пользователями добавлен `scripts/create-user.sh` с командами `registry`, `db` и
`admin`. Локальный Registry закрыт basic-auth через `htpasswd` и TLS на
host-прокси, поэтому внешний `docker login registry.aillix.ru` работает как в
обычном приватном реестре. Backend в Блоке 1 намеренно закомментирован в compose
и в конфиге Nginx — он включается в Блоке 2, чтобы контур развивался поэтапно.

## Что сделано

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
| Изоляция контейнеров | сети `edge`, `data` (internal), `registry` |
| API/DB только внутри | порты 8000/5432 не публикуются |

## Архитектура

```
Internet → host Nginx :443 → 127.0.0.1:8080 (контейнерный Nginx)
                                    ├── /       → aillix-web:3000
                                    └── /api/   → (закомментировано до Блока 2)

registry.aillix.ru → host Nginx :443 → 127.0.0.1:5000 (registry, tools)
pgAdmin → 127.0.0.1:5050 (только через SSH-туннель)
PostgreSQL → сеть data, internal: true
```

## Отклонения и почему

1. **Ubuntu 24.04.4 LTS вместо 22.04.** Это фактическая версия сервера;
   конфигурация и пакеты совместимы, версия зафиксирована в README.
2. **Вариант A деплоя.** Host Nginx остаётся TLS-краем, контейнерный Nginx
   слушает loopback. Это позволяет обновлять приложение без простоя и не
   переносить сертификаты внутрь контейнера.
3. **Registry не публикует 443 сам.** TLS и basic-auth терминируются на host
   Nginx — меньше движущихся частей и один набор сертификатов.
4. **pgAdmin только на loopback.** Доступ через `ssh -L 5050:127.0.0.1:5050`.
5. **Watchtower с label-enable.** Автообновление PostgreSQL и Registry
   запрещено: это stateful-сервисы.

## Команды

```bash
cd ai-studio
cp .env.example .env
chmod 600 .env

docker compose config -q
docker compose up -d --build
docker compose --profile tools up -d

curl -fsS http://127.0.0.1:8080/healthz
docker compose ps
docker compose logs -f nginx

./scripts/create-user.sh registry deploy
docker login registry.aillix.ru
```

Проверка изоляции:

```bash
ss -lntp | grep -E '5432|8000|5050|5000'   # только loopback, где разрешено
docker inspect aillix-postgres --format '{{json .NetworkSettings.Networks}}'
```

## Чек-лист скриншотов

1. `docker compose ps` — все сервисы `running/healthy`.
2. `docker compose --profile tools ps` — pgAdmin, Registry, Watchtower.
3. `docker network inspect aillix_data` — `"internal": true`.
4. `ss -lntp` — нет публичных 5432/8000.
5. `curl http://127.0.0.1:8080/healthz` → `ok`.
6. `docker login registry.aillix.ru` — успешный вход.
7. `docker compose config` — фрагмент с закомментированным backend.
8. Сайт `https://aillix.ru` — 200 OK.
