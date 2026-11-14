# Блок 3 — JWT-админка, CRUD услуг, метрики, heatmap, скоринг, закрытые порты

Тег: `hw-3`. Репозиторий: https://github.com/markmus11012020-max/AI-Consalting-DEV

## Соответствие требованиям (5 предложений)

Админка закрыта JWT: вход по e-mail и паролю выдаёт токен в
HttpOnly/Secure/SameSite=Strict cookie, а первичный администратор создаётся
только при пустой таблице `admins`. В панели `/admin` реализована визуальная
CRUD-таблица услуг с созданием, редактированием и мягким удалением, а также
список заявок с фильтрами, статусами и расшифровкой скоринга. Поведенческие
метрики собираются на своём сервере батчами: время, клики, нормализованные
координаты курсора, глубина скролла и возвраты, а `/admin` показывает сводку и
heatmap 20×20. Лиды ранжируются прозрачной формулой (срочность, бюджет, роль,
размер компании, объём задач, вовлечённость) на `hot`, `warm` и `cold`;
10 тестовых заявок создаются скриптом в пропорции 4/3/3. Наружу открыт только
443 (80 — redirect и ACME), порты backend и PostgreSQL не публикуются, а
pgAdmin, Registry и Watchtower остановлены после приёмки Блоков 1–2.

## Авторизация

- `POST /api/auth/login` → JWT + cookie `aillix_admin`;
- `GET /api/auth/me` — проверка сессии;
- `POST /api/auth/logout` — удаление cookie;
- Swagger поддерживает `Authorization: Bearer <token>`;
- пароли — PBKDF2-HMAC-SHA256, 260 000 итераций;
- bootstrap: `ADMIN_EMAIL` + `ADMIN_PASSWORD` применяются только если
  `select count(*) from admins = 0`;
- создать/сбросить администратора вручную:
  `./scripts/create-user.sh admin admin@aillix.ru`.

Cookie закрыта от JS, поэтому XSS не даёт украсть токен. CSRF дополнительно
ограничен `SameSite=Strict` и same-origin запросами панели.

## CRUD услуг

`/admin` → вкладка «Услуги»:

- таблица: название, slug, вилка цены, срок, статус;
- создание и редактирование в модальном окне;
- удаление — `DELETE /api/admin/services/{id}`, который ставит
  `is_active=false`;
- публичный каталог обновляется через `revalidate: 300`.

## Поведенческие метрики

`src/lib/metrics/client.ts`:

| Событие | Когда |
|---|---|
| `page_view` | загрузка страницы |
| `click` | клик, с элементом и координатами |
| `cursor` | движение мыши, не чаще 1 раза в 400 мс |
| `scroll` | достигнута половина страницы |
| `form_start` | первый фокус в форме |
| `submit` | успешная отправка заявки |
| `return` | повторный визит спустя 30+ минут |

- батч каждые 8 секунд, `sendBeacon` при `visibilitychange`/`pagehide`;
- координаты делятся на ширину/высоту окна → `0..1`;
- `session_id` хранится в `sessionStorage`, возврат — в `localStorage`;
- после отправки формы события связываются с заявкой по `session_id`;
- `POST /api/metrics` ограничен 1 запросом в секунду с IP; клиент отправляет
  пачки, поэтому ограничение не мешает.

Heatmap: `GET /api/admin/metrics/heatmap?grid=20&days=30` агрегирует точки в
сетку и возвращает `{x, y, weight}`. UI рисует её без canvas — 400 ячеек.

## Скоринг и ранжирование

| Фактор | Диапазон | Логика |
|---|---|---|
| Срочность | 4–30 | ≤7 дней — 30, ≤14 — 26, ≤30 — 21, ≤60 — 14, ≤90 — 9 |
| Бюджет | 5–25 | ≥300k — 25, ≥150k — 20, ≥80k — 15, ≥30k — 10 |
| Роль | 4–15 | владелец/CEO — 15, руководитель — 12, менеджер — 8 |
| Компания | 3–10 | enterprise 10, medium 8, small 6, solo 3 |
| Объём задач | 3–10 | 5+ задач — 10 |
| Вовлечённость | 0–5 | 3+ просмотра, 5+ кликов, 60+ сек, возврат, 30+ точек курсора |

`hot ≥ 70`, `warm 40–69`, `cold < 40`. Разбивка сохраняется в
`applications.score_breakdown` и показывается администратору.

## Тестовые заявки 4 / 3 / 3

```bash
docker compose exec backend python -m app.scripts.seed_demo_applications
```

Скрипт создаёт ровно 4 горячих, 3 тёплых и 3 холодных заявки с разными
бюджетами, сроками и ролями.

## Закрытие портов и отключение инструментов

```bash
# остановить инструменты
docker compose --profile tools stop pgadmin registry watchtower

# проверить, что наружу открыт только 443 (+80 для redirect/ACME)
sudo ss -lntp | grep -E ':80|:443|:3000|:5000|:5050|:5432|:8000'
sudo ufw status verbose
```

Ожидаемо: снаружи доступны 80 и 443, остальные порты либо не слушаются, либо
привязаны к `127.0.0.1`. Попытка подключиться к 5432/8000 с клиента даёт
`Connection refused` — это строже, чем 403, потому что порт вообще не отвечает.

## Скрипты проверки

```bash
# health и услуги
curl -s https://aillix.ru/api/health
curl -s https://aillix.ru/api/services

# вход и защищённый запрос
TOKEN=$(curl -s -X POST https://aillix.ru/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@aillix.ru","password":"..."}' | jq -r .access_token)
curl -s -H "Authorization: Bearer $TOKEN" https://aillix.ru/api/admin/stats

# проверка закрытых портов
nc -vz 91.224.87.62 5432   # Connection refused
nc -vz 91.224.87.62 8000   # Connection refused
```

## Чек-лист скриншотов

1. `/admin` — форма входа.
2. `/admin` — таблица заявок со скорингом и фильтрами.
3. Раскрытая заявка с `score_breakdown`.
4. `/admin` → «Услуги» — CRUD-таблица.
5. Модальное окно редактирования услуги.
6. Изменённая услуга на публичном сайте.
7. `/admin` → «Метрики» — сводка и heatmap.
8. `seed_demo_applications` — вывод 4/3/3.
9. `docker compose ps` — pgAdmin, Registry и Watchtower остановлены.
10. `ufw status` и `ss -lntp` — открыт только 443/80.
11. `nc -vz 91.224.87.62 5432` — `Connection refused`.
12. `docker logs -f backend` или `curl` с `Bearer`-токеном.
