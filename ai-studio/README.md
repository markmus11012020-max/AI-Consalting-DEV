# AI.STUDIO — сайт-визитка консалтинговой компании по внедрению ИИ

Одностраничный сайт с интерактивным калькулятором MVP и валидируемой формой заявки.
Next.js 15 (App Router) · TypeScript · Tailwind CSS 3 · shadcn/ui · Framer Motion.

## Быстрый старт

```bash
npm install
cp .env.example .env.local   # Windows: copy .env.example .env.local
npm run dev                  # http://localhost:3000
```

Требуется Node.js 22+.

> Проект собирается с `output: "standalone"` (нужно для Docker). `npm start`
> при этом работает, но выводит предупреждение. Для проверки ровно того же
> артефакта, что уедет на сервер, используйте:
>
> ```bash
> cp -r .next/static .next/standalone/.next/static
> cp -r public .next/standalone/public
> PORT=3000 node .next/standalone/server.js
> ```

| Скрипт | Что делает |
|---|---|
| `npm run dev` | Dev-сервер с Turbopack |
| `npm run build` | Прод-сборка |
| `npm start` | Запуск прод-сборки (`next start`) |
| `npm run lint` | ESLint (next/core-web-vitals + TS) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Unit-тесты расчёта сметы (Vitest) |
| `npm run format` | Prettier + сортировка Tailwind-классов |

## Структура

```
src/
├── app/                 # роутинг, метаданные, sitemap, robots, OG-image
├── components/
│   ├── ui/              # shadcn-примитивы + GlowCard, Tag, Badge
│   ├── layout/          # Header, MobileNav, Footer, Container, Section
│   ├── sections/        # Hero, UseCases, Expertise, Solutions, Process, Trust, Calculator, FAQ, Contact
│   ├── calculator/      # опции и карточка сметы
│   ├── lead/            # схема, server action, форма
│   └── motion/          # Reveal, MotionProvider
├── lib/
│   ├── site.ts          # контакты, навигация, URL
│   ├── content.ts       # тексты секций, проекты, FAQ
│   ├── pricing.ts       # ⚠️ цены и сроки калькулятора
│   ├── estimate.ts      # расчёт сметы, форматирование, сериализация
│   └── lead/            # zod-схема, Telegram-транспорт
├── hooks/
└── types/
```

## Как менять контент

| Что | Где |
|---|---|
| Цены и сроки калькулятора | `src/lib/pricing.ts` — цены со скидкой −30 % от базового прайса, блок с пометкой `TODO(PRICING)` |
| Правила расчёта (скидка, ±15 %, поддержка) | `src/lib/pricing.ts` → `PRICING_RULES` |
| Тексты направлений, экспертизы, проектов, процесса, FAQ | `src/lib/content.ts` |
| Контакты, навигация, домен, юрлицо | `src/lib/site.ts` → `SITE.company` |
| Метаданные, title/description | `src/app/layout.tsx` |
| Политика ПД | `src/app/privacy/page.tsx` (перед публикацией добавьте ИНН, ОГРН и адрес оператора) |

## Калькулятор

- Состояние живёт в React и синхронизируется с URL: `?platform=web&ai=rag&int=fz152,amocrm`.
- Ссылку можно отправить клиенту — конфигурация и смета восстановятся.
- Кнопка «Получить детальную смету» передаёт конфигурацию в форму заявки
  через `sessionStorage` и кастомное событие `ai-studio:estimate`.
- Расчёт — чистая функция `calculateEstimate()` в `src/lib/estimate.ts`,
  покрыта тестами (`src/lib/estimate.test.ts`).

## Форма заявки

Валидация — `zod`-схема `src/lib/lead/schema.ts`, используется и на клиенте, и в server action.

Доставка — Telegram Bot API:

1. Создайте бота у `@BotFather` и получите токен.
2. Напишите боту любое сообщение.
3. Откройте `https://api.telegram.org/bot<TOKEN>/getUpdates` и найдите `chat.id`.
4. Заполните `.env`:

```env
TELEGRAM_BOT_TOKEN=123456:AA...
TELEGRAM_CHAT_ID=123456789
```

Если переменные не заданы в `production`, форма вернёт понятную ошибку доставки
(заявки не теряются молча). В `development` заявка пишется в лог сервера.

Антиспам: honeypot-поле + rate-limit 3 заявки / 10 минут на IP.
Для дополнительной защиты можно подключить Yandex SmartCaptcha (ключ в `.env.example`).

## Деплой в Yandex Cloud (Ubuntu VM)

### 1. Подготовка сервера

```bash
sudo apt update && sudo apt install -y docker.io docker-compose-v2 nginx certbot python3-certbot-nginx git
sudo systemctl enable --now docker
sudo usermod -aG docker $USER   # перелогиниться
```

### 2. Код и переменные

```bash
sudo mkdir -p /opt/ai-studio && sudo chown $USER /opt/ai-studio
git clone <repo-url> /opt/ai-studio
cd /opt/ai-studio
cp .env.example .env
nano .env     # NEXT_PUBLIC_SITE_URL, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
```

### 3. Запуск

```bash
docker compose build
docker compose up -d
curl http://127.0.0.1:3000/api/health
```

Проверить контейнер: `docker compose ps`, логи: `docker compose logs -f web`.

### 4. Nginx и HTTPS

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/ai-studio
sudo ln -s /etc/nginx/sites-available/ai-studio /etc/nginx/sites-enabled/ai-studio
sudo rm -f /etc/nginx/sites-enabled/default
sudo nano /etc/nginx/sites-available/ai-studio   # заменить домен
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d ai-studio.ru -d www.ai-studio.ru
```

### 5. Обновление

```bash
./deploy/deploy.sh /opt/ai-studio
```

### Альтернатива без Docker

Соберите проект (`npm ci && npm run build`), скопируйте `.next/standalone`,
`.next/static` и `public` в `/opt/ai-studio` и используйте
`deploy/ai-studio.service`:

```bash
sudo cp deploy/ai-studio.service /etc/systemd/system/
sudo systemctl daemon-reload && sudo systemctl enable --now ai-studio
```

## Комплаенс

- Форма требует явного согласия на обработку персональных данных.
- Политика: `/privacy`. **Перед публикацией** добавьте реквизиты оператора
  (ИНН, ОГРН, адрес) — юрлицо уже указано, в коде оставлен `TODO`.
- Внешние LLM не используются в рантайме сайта; заявки уходят только в Telegram.
- При подключении Яндекс.Метрики добавьте cookie-баннер и обновите политику.

## Производительность и качество

- Server Components по умолчанию; `"use client"` только у хедера, калькулятора,
  формы и анимаций.
- `LazyMotion` + `m.div` вместо полного рантайма Framer Motion.
- `prefers-reduced-motion` уважается на уровне JS и CSS.
- Проверки перед релизом: `npm run lint && npm run typecheck && npm run test && npm run build`.
