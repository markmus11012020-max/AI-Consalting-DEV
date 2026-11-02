import type {
  ExpertiseGroup,
  FaqItem,
  PainPoint,
  ProcessStep,
  ProjectCase,
  ServiceOffer,
  StackGroup,
  TrustItem,
  UseCase,
} from "@/types";

export const HERO_PIPELINE = [
  {
    layer: "Orchestrator",
    detail: "Маршрутизация запросов, инструменты, память",
    meta: "LLM Router",
  },
  {
    layer: "Retrieval",
    detail: "Metadata-driven RAG, контроль релевантности",
    meta: "pgvector",
  },
  {
    layer: "Guardrails",
    detail: "Маскирование PII до вызова внешней модели",
    meta: "ФЗ-152",
  },
  {
    layer: "Runtime",
    detail: "FastAPI / Spring Boot, Docker, Yandex Cloud",
    meta: "Production",
  },
] as const;

export const HERO_PROOF = [
  { value: "6", label: "реализованных систем" },
  { value: "180+", label: "автотестов в CI" },
  { value: "2–4", label: "недели до MVP" },
  { value: "RU", label: "контур и ФЗ-152" },
] as const;

export const PAIN_POINTS: PainPoint[] = [
  {
    id: "pilot",
    title: "Пилот на ChatGPT есть, а в процесс не встроен",
    description:
      "Демо впечатляет, но без интеграций, прав доступа и мониторинга до продакшена не доходит.",
    result: "Доведём до прод-сервиса, которым пользуются каждый день.",
    icon: "workflow",
  },
  {
    id: "support",
    title: "Клиенты ждут ответа, а менеджеры тонут в рутине",
    description:
      "Заявки теряются между Telegram, почтой и CRM. Ночью и в выходные никто не отвечает.",
    result: "Агент отвечает 24/7 и передаёт менеджеру готовый контекст.",
    icon: "headset",
  },
  {
    id: "data",
    title: "Данные нельзя отдавать во внешнюю LLM",
    description:
      "Финансы, медицина и персональные данные требуют локального контура, маскирования и аудита.",
    result: "Архитектура с PII-маскированием, доступом и журналом решений.",
    icon: "shield",
  },
  {
    id: "trading",
    title: "Торговая стратегия живёт в Excel и ручных ордерах",
    description:
      "Идея есть, но нет бэктеста, риск-лимитов, исполнения и контроля просадки.",
    result: "Бот с paper/testnet-прогоном, риск-менеджером и мониторингом.",
    icon: "chart",
  },
];

export const SERVICES: ServiceOffer[] = [
  {
    id: "agents",
    title: "ИИ-агенты для продаж и поддержки",
    icon: "bot",
    summary:
      "Агент ведёт диалог по вашей базе знаний, квалифицирует лид и передаёт его в CRM с контекстом.",
    outcome: "Быстрее ответ — больше сделок без роста команды.",
    price: "от 154 000 ₽",
    weeks: "3–5 недель",
    highlights: ["Память и инструменты", "CRM и Telegram", "Передача человеку"],
    accent: "indigo",
  },
  {
    id: "rag",
    title: "RAG-система по вашим документам",
    icon: "database",
    summary:
      "Ассистент отвечает по регламентам, договорам и базе знаний, а не по памяти модели.",
    outcome: "Ответы со ссылками на источник и контролем галлюцинаций.",
    price: "от 196 000 ₽",
    weeks: "4–6 недель",
    highlights: ["Metadata-driven retrieval", "Цитаты и проверка", "Локальный контур"],
    accent: "teal",
  },
  {
    id: "mvp",
    title: "Live MVP под ключ",
    icon: "layers",
    summary:
      "Рабочий продукт на реальных данных за 2–4 недели: интерфейс, API, интеграции и деплой.",
    outcome: "Проверяете гипотезу на рынке, а не в презентации.",
    price: "от 126 000 ₽",
    weeks: "2–4 недели",
    highlights: ["Web / Telegram / VK", "Прод-архитектура", "Код и доступы у вас"],
    accent: "amber",
  },
  {
    id: "trading",
    title: "Торговые боты для криптобирж",
    icon: "chart",
    summary:
      "Funding-арбитраж, исполнение сигналов и риск-менеджмент для Hyperliquid, dYdX, GMX.",
    outcome: "Стратегия с бэктестом, paper-режимом и контролем просадки.",
    price: "по запросу",
    weeks: "3–6 недель",
    highlights: ["Бэктест и paper", "Риск-лимиты", "PnL-дашборд"],
    accent: "rose",
  },
  {
    id: "automation",
    title: "Автоматизация и интеграции",
    icon: "workflow",
    summary:
      "Связываем CRM, почту, документы и внутренние сервисы в один управляемый процесс.",
    outcome: "Меньше ручного ввода — меньше ошибок и потерь.",
    price: "от 42 000 ₽",
    weeks: "1–3 недели",
    highlights: ["AmoCRM / Bitrix24", "Документы и отчёты", "Очереди и вебхуки"],
    accent: "indigo",
  },
  {
    id: "compliance",
    title: "ИИ-комплаенс и безопасность",
    icon: "shield",
    summary:
      "Маскирование PII, разграничение доступа и аудит решений до вызова внешней модели.",
    outcome: "ИИ можно внедрять без нарушения 152-ФЗ и внутренних политик.",
    price: "от 84 000 ₽",
    weeks: "2–4 недели",
    highlights: ["ФЗ-152 / ФЗ-115", "PII-маскирование", "Audit trail"],
    accent: "teal",
  },
];

export const EXPERTISE: ExpertiseGroup[] = [
  {
    id: "ai",
    title: "AI & Prompt Engineering",
    icon: "brain",
    summary:
      "Проектируем поведение модели как инженерную систему: управляемые цепочки инструкций, контроль контекста и стоимости токенов.",
    points: [
      "Prompt Chaining и декомпозиция сложных задач на проверяемые шаги",
      "Token Economy: бюджеты контекста, Stop Sequences, Prompt Caching",
      "Agentic AI с памятью, инструментами и детерминированными guardrails",
      "RAG с metadata-driven retrieval и контролем галлюцинаций",
    ],
    tags: ["LLM", "RAG", "Agents", "Prompt Caching"],
  },
  {
    id: "backend",
    title: "Backend и инфраструктура",
    icon: "server",
    summary:
      "Собираем сервисный слой, который выдерживает нагрузку: асинхронные API, очереди, идемпотентность и предсказуемый деплой.",
    points: [
      "Асинхронный Python: FastAPI, SQLAlchemy 2, Pydantic v2",
      "Java 17: Spring Boot 3.x, Spring Data JPA / Hibernate, Maven",
      "Очереди и фоновые задачи, идемпотентные обработчики, наблюдаемость",
      "Docker / Docker Compose, деплой на Ubuntu VM в Yandex Cloud",
    ],
    tags: ["FastAPI", "Spring Boot", "PostgreSQL", "Docker"],
  },
  {
    id: "compliance",
    title: "Комплаенс и безопасность",
    icon: "shield",
    summary:
      "Встраиваем требования регуляторов в архитектуру, а не в презентацию: данные не покидают контур в открытом виде.",
    points: [
      "Проектирование под ФЗ-152 (персональные данные) и ФЗ-115 (AML-комплаенс)",
      "Локальное маскирование и токенизация PII в памяти JVM / Python до вызова внешних LLM",
      "Разграничение доступа, аудит-лог решений, шифрование при передаче и хранении",
      "Модель угроз и DLP-политики для генеративных сценариев",
    ],
    tags: ["ФЗ-152", "ФЗ-115", "PII", "Audit trail"],
  },
];

export const USE_CASES: UseCase[] = [
  {
    id: "sales",
    title: "Продажи и лидогенерация",
    icon: "target",
    summary:
      "Заявки не теряются, а менеджеры занимаются сделками, а не рутиной.",
    points: [
      "Собираем данные о клиенте и распределяем заявки между менеджерами",
      "Готовим персональные коммерческие предложения и письма за секунды",
      "Расшифровываем звонки, делаем резюме встреч и ставим задачи в CRM",
    ],
    result: "Больше сделок той же командой",
  },
  {
    id: "support",
    title: "Поддержка клиентов",
    icon: "headset",
    summary: "Клиент получает ответ сразу — даже ночью и в выходные.",
    points: [
      "Отвечаем на типовые вопросы и принимаем заявки 24/7",
      "Разбираем отзывы: находим причины недовольства и точки роста",
      "Передаём сложные случаи оператору с готовым контекстом",
    ],
    result: "Быстрее ответ — меньше потерь клиентов",
  },
  {
    id: "finance",
    title: "Документооборот и финансы",
    icon: "receipt",
    summary: "Рутина уходит, а цифры для решений остаются под рукой.",
    points: [
      "Распознаём счета, накладные и акты без ручного ввода",
      "Считаем кассовые разрывы и прогнозируем денежный поток",
      "Сводим данные из разных систем в одну понятную картину",
    ],
    result: "Меньше ручной работы и ошибок",
  },
  {
    id: "hr",
    title: "HR и внутренние процессы",
    icon: "users",
    summary: "Помогаем быстрее находить людей и отвечать сотрудникам.",
    points: [
      "Отбираем резюме под вакансию и готовим профили должностей",
      "Отвечаем сотрудникам на рабочие вопросы из базы знаний компании",
      "Автоматизируем онбординг и типовые кадровые запросы",
    ],
    result: "Быстрее найм, меньше HR-рутины",
  },
];

export const AGENT_USE_CASE: UseCase = {
  id: "agents",
  title: "Автономные ИИ-агенты",
  icon: "workflow",
  summary:
    "Не просто отвечают на вопросы, а выполняют задачу целиком: анализируют контекст, принимают решения и доводят дело до результата.",
  points: [
    "Ведение сделки",
    "Согласование документов",
    "Сбор и проверка данных",
  ],
  result: "Делегируйте процесс, а не отдельный вопрос",
};

export const PROJECTS: ProjectCase[] = [
  {
    id: "fintech-orchestrator",
    title: "FinTech Compliance AI-Orchestrator",
    category: "AML / микросервисы",
    icon: "shield",
    accent: "indigo",
    summary:
      "Микросервис AML-комплаенса: оркестрация правил и LLM-проверок в едином пайплайне с объяснимым результатом по каждой операции.",
    result: "Каждое решение объяснимо, а PII не уходит во внешнюю модель.",
    href: "https://github.com/markmus11012020-max/FinTech-Compliance-AI-Orchestrator",
    highlights: [
      "Правила и LLM-проверки в одном пайплайне с приоритизацией риска",
      "Audit trail: для каждого решения сохранён набор сработавших признаков",
      "Маскирование персональных данных перед вызовом внешней модели",
      "Идемпотентная обработка операций через очередь сообщений",
    ],
    stack: ["Java 17", "Spring Boot 3.2.5", "PostgreSQL", "Docker"],
    flow: ["Transaction", "Rules engine", "LLM check", "Decision"],
  },
  {
    id: "clickjurist",
    title: "КликЮрист — Legal AI Service",
    category: "LegalTech / ФЗ-152",
    icon: "file-text",
    accent: "purple",
    summary:
      "Юридический ИИ-сервис: анализ ситуации, чек-лист действий и готовый документ с оплатой по результату.",
    result: "180 автотестов, анонимность данных и оплата только за результат.",
    href: "https://github.com/markmus11012020-max/CLICKJURIST_RANEPA",
    highlights: [
      "Три стадии: анализ ситуации → чек-лист → готовый документ",
      "Анонимность данных: ПДн заменяются метками до вызова LLM",
      "Paywall: до оплаты в DOM попадает только 30% текста документа",
      "Веб-фактчекинг, guardrails и 180 автотестов в CI",
    ],
    stack: ["FastAPI", "YandexGPT", "Robokassa", "SQLite"],
    flow: ["Analyze", "Checklist", "Document", "Paywall"],
  },
  {
    id: "rubond-agent",
    title: "Platon RuBond — AI Trading Agent",
    category: "Финансы / LangGraph",
    icon: "chart",
    accent: "indigo",
    summary:
      "Автономный ИИ-агент рынка облигаций РФ: мониторинг Мосбиржи, семантический анализ новостей, расчёт доходности и уведомления в Telegram.",
    result: "Risk Officer и Human-in-the-Loop перед каждым решением.",
    href: "https://github.com/markmus11012020-max/Platon-RuBond-bot",
    highlights: [
      "LangGraph-граф с отдельной ролью Risk Officer и Human-in-the-Loop",
      "Расчёт YTM и сравнение выпусков по доходности и кредитному риску",
      "Семантический поиск по новостям и эмбеддинги в Pinecone",
      "Модульная архитектура по SOLID и покрытие ключевой логики тестами",
    ],
    stack: ["Python", "LangGraph", "Pinecone", "Streamlit"],
    flow: ["MOEX", "News", "Risk Officer", "Telegram"],
  },
  {
    id: "health-sales-assistant",
    title: "Health-Bot AI Sales Assistant",
    category: "Продажи / CRM",
    icon: "bot",
    accent: "purple",
    summary:
      "ИИ-ассистент отдела продаж: отвечает клиенту по базе продуктов, подсказывает допродажу и передаёт результат в CRM.",
    result: "Ответ клиенту и подсказка менеджеру по апселлу — в одном окне.",
    href: "https://github.com/markmus11012020-max/Health-Bot-AI",
    highlights: [
      "Маскирование имён, телефонов, e-mail и адресов до вызова LLM",
      "Два блока ответа: сообщение клиенту и подсказка менеджеру по апселлу",
      "FastAPI-webhook для AmoCRM и других CRM",
      "A/B-промпты, LRU-кэш и переключение AITunnel / YandexGPT",
    ],
    stack: ["Streamlit", "FastAPI", "YandexGPT", "AITunnel"],
    flow: ["CRM", "Anonymize", "LLM", "Upsell"],
  },
  {
    id: "ai-sql-assistant",
    title: "Universal AI SQL Assistant",
    category: "Metadata-Driven RAG",
    icon: "database",
    accent: "indigo",
    summary:
      "ИИ-ассистент по базе данных: отвечает на вопросы на естественном языке и генерирует SQL, опираясь на метаданные схемы.",
    result: "SQL с валидацией и объяснением на языке бизнеса.",
    href: "https://github.com/markmus11012020-max/universal-ai-sql-assistant",
    highlights: [
      "Схема БД как источник контекста — без ручных промптов под каждую таблицу",
      "Генерация SQL с валидацией синтаксиса и ограничением прав доступа",
      "Объяснение запроса и результата на языке бизнеса",
      "Работа поверх разных СУБД в едином интерфейсе",
    ],
    stack: ["FastAPI", "PostgreSQL", "LLM", "Metadata RAG"],
    flow: ["Question", "Metadata", "SQL", "Answer"],
  },
  {
    id: "helpdesk-backend",
    title: "Helpdesk AI Backend",
    category: "Асинхронный сервис",
    icon: "workflow",
    accent: "purple",
    summary:
      "Асинхронный сервис классификации обращений: определяет тематику и приоритет и маршрутизирует тикет в нужную очередь.",
    result: "Поток обращений разложен по темам, приоритетам и SLA.",
    href: "https://github.com/markmus11012020-max/helpdesk-ai-backend",
    highlights: [
      "Классификация тематики и приоритета на потоке обращений",
      "Маршрутизация в профильную команду с учётом SLA",
      "Устойчивость к пикам: async-стек и буферизация через очередь",
      "Метрики качества классификации на размеченной выборке",
    ],
    stack: ["Python 3.12", "FastAPI", "SQLAlchemy", "Redis"],
    flow: ["Ticket", "Classifier", "Router", "Queue"],
  },
];

export const TRADING_CASES: ProjectCase[] = [
  {
    id: "dex-arb",
    title: "DEX-ARB — funding-rate arbitrage",
    category: "Hyperliquid · dYdX · GMX",
    icon: "chart",
    accent: "teal",
    summary:
      "Кросс-биржевой арбитраж funding rate: long на дешёвой ставке, short на дорогой, контроль спреда и автоматическое исполнение.",
    result: "Бэктест, paper/testnet, риск-лимиты и PnL-дашборд.",
    href: "https://github.com/markmus11012020-max/dex-arb",
    highlights: [
      "Сбор ставок с Hyperliquid, dYdX и GMX",
      "Smart sizing по стакану и защита от проскальзывания",
      "Rollback при сбое второй ноги и лимиты экспозиции",
      "PnL, funding, CSV/JSON-экспорт и Telegram-алерты",
    ],
    stack: ["Python 3.12", "asyncio", "Hyperliquid", "dYdX v4", "FastAPI", "Docker"],
    flow: ["Markets", "Spread", "Risk", "Execution", "PnL"],
  },
  {
    id: "platon-rubond",
    title: "Platon RuBond — AI-аналитик рынка",
    category: "MOEX · LangGraph · RAG",
    icon: "brain",
    accent: "indigo",
    summary:
      "ИИ-агент по рынку облигаций РФ: мониторинг Мосбиржи, новости, расчёт доходности и уведомления в Telegram/VK.",
    result: "Risk Officer и Human-in-the-Loop перед рекомендацией.",
    href: "https://github.com/markmus11012020-max/Platon-RuBond-bot",
    highlights: [
      "LangGraph-граф с отдельной ролью Risk Officer",
      "YTM, дюрация и сравнение выпусков по риску",
      "Семантический поиск новостей и Pinecone",
      "Streamlit-дашборд, VK-бот и premarket PWA",
    ],
    stack: ["Python", "LangGraph", "Pinecone", "Streamlit", "MOEX ISS"],
    flow: ["MOEX", "News", "Risk Officer", "Human gate", "Telegram"],
  },
];

export const STACK_GROUPS: StackGroup[] = [
  {
    id: "ai",
    title: "AI и работа с моделями",
    icon: "brain",
    summary: "Поведение модели как инженерная система, а не набор промптов.",
    items: [
      "Prompt Chaining и декомпозиция задач",
      "Token Economy, Stop Sequences, Prompt Caching",
      "Agentic AI с памятью и инструментами",
      "Metadata-driven RAG и контроль галлюцинаций",
      "OpenAI, Anthropic, DeepSeek, YandexGPT, GigaChat",
    ],
  },
  {
    id: "backend",
    title: "Backend и данные",
    icon: "server",
    summary: "Сервисный слой, который выдерживает нагрузку и обновления.",
    items: [
      "Python: FastAPI, SQLAlchemy 2, Pydantic v2",
      "Java 17: Spring Boot 3, JPA / Hibernate, Maven",
      "PostgreSQL, Redis, SQLite, pgvector, Pinecone",
      "Очереди, идемпотентность, фоновые задачи",
    ],
  },
  {
    id: "trading",
    title: "Торговые системы",
    icon: "chart",
    summary: "Данные, исполнение и риск-контур для алгоритмической торговли.",
    items: [
      "Hyperliquid, dYdX v4, GMX",
      "ccxt, WebSocket, REST, order book",
      "Backtest, paper trading, testnet, dry-run",
      "Risk manager, stop-loss, kill-switch, PnL",
    ],
  },
  {
    id: "infra",
    title: "Инфраструктура и безопасность",
    icon: "shield",
    summary: "Деплой, наблюдаемость и требования регуляторов.",
    items: [
      "Docker / Docker Compose, Ubuntu, Yandex Cloud / Cloud.ru",
      "Nginx, HTTPS, CI/CD, мониторинг и алерты",
      "ФЗ-152 и ФЗ-115, маскирование PII",
      "Аудит решений, разграничение доступа, шифрование",
    ],
  },
];

export const PROCESS: ProcessStep[] = [
  {
    id: "discovery",
    title: "Дискавери",
    duration: "1–3 дня",
    description:
      "Разбираем процесс, данные и ограничения. Фиксируем критерии успеха в измеримых метриках, а не в формулировках «нужен ИИ».",
    deliverables: ["Карта процесса", "Список интеграций", "Критерии успеха"],
  },
  {
    id: "prototype",
    title: "Прототип",
    duration: "3–5 дней",
    description:
      "Собираем рабочий сценарий на реальных данных и оцениваем качество: точность, стоимость запроса, задержку ответа.",
    deliverables: ["Рабочий прототип", "Замер качества", "Оценка стоимости LLM"],
  },
  {
    id: "mvp",
    title: "MVP в прод",
    duration: "2–4 недели",
    description:
      "Прод-архитектура: интеграции, безопасность, маскирование данных, мониторинг. Деплой в ваш контур или в российское облако.",
    deliverables: ["Прод-сервис", "Интеграции", "Мониторинг и алерты"],
  },
  {
    id: "scale",
    title: "Развитие",
    duration: "далее",
    description:
      "Дорабатываем промпты по реальным логам, расширяем сценарии и снижаем стоимость токенов без потери качества.",
    deliverables: ["План улучшений", "Оптимизация токенов", "SLA поддержки"],
  },
];

export const TRUST: TrustItem[] = [
  {
    id: "fz152",
    title: "ФЗ-152: персональные данные",
    description:
      "Согласия, минимизация состава данных, хранение в российском контуре. Политика обработки ПД публикуется на сайте.",
    icon: "shield",
  },
  {
    id: "fz115",
    title: "ФЗ-115: AML-комплаенс",
    description:
      "Сценарии проверки операций с сохранением признаков решения и возможностью восстановить логику проверки.",
    icon: "lock",
  },
  {
    id: "masking",
    title: "Маскирование PII",
    description:
      "Токенизация и анонимизация конфиденциальных данных в памяти JVM / Python до вызова внешних LLM.",
    icon: "cpu",
  },
  {
    id: "infra",
    title: "Инфраструктура в вашем контуре",
    description:
      "Docker / Docker Compose, Ubuntu VM в российском облаке (Yandex Cloud / Cloud.ru) или on-premise. Локальные модели — тоже вариант.",
    icon: "server",
  },
];

export const FAQ: FaqItem[] = [
  {
    id: "cost",
    question: "Сколько стоит MVP с генеративным ИИ?",
    answer:
      "Стоимость складывается из платформы (web, Telegram, VK), архитектуры ИИ (чат-бот, агент с памятью, RAG) и интеграций. Калькулятор выше показывает диапазон по вашей конфигурации, точная смета — после 30-минутного созвона и уточнения данных.",
  },
  {
    id: "timeline",
    question: "Сколько времени занимает запуск?",
    answer:
      "Прототип на реальных данных — 3–5 дней. MVP в прод с интеграциями и безопасностью — от 2 до 4 недель. Срок зависит от готовности ваших API и качества исходных данных, а не от объёма вёрстки.",
  },
  {
    id: "data",
    question: "Что происходит с конфиденциальными данными?",
    answer:
      "Данные маскируются или токенизируются до вызова внешней модели. Возможны три контура: внешняя LLM с предварительной анонимизацией, корпоративный шлюз и полностью локальная модель на вашей инфраструктуре.",
  },
  {
    id: "own-llm",
    question: "Можно ли использовать свою или локальную LLM?",
    answer:
      "Да. Архитектура строится через слой абстракции над провайдером модели, поэтому можно переключаться между внешними API и локальными моделями без переписывания бизнес-логики.",
  },
  {
    id: "support",
    question: "Что входит в поддержку после запуска?",
    answer:
      "Мониторинг качества ответов, правки промптов по реальным логам, обновление зависимостей, контроль стоимости токенов и план развития сценариев. Поддержка считается отдельно от разработки.",
  },
  {
    id: "nda",
    question: "Работаете по NDA?",
    answer:
      "Да. Для проектов под NDA публикуем обезличенные описания архитектуры без имён клиентов и коммерческих деталей. Договор и NDA подписываются до старта дискавери.",
  },
  {
    id: "trading",
    question: "Разрабатываете торговых ботов?",
    answer:
      "Да. Делаем funding-арбитраж, исполнение сигналов и риск-контур для Hyperliquid, dYdX и GMX. Сначала бэктест и paper/testnet, затем прод. Не управляем средствами клиента и не обещаем доходность: это разработка ПО, а не инвестиционная рекомендация.",
  },
  {
    id: "contacts",
    question: "Куда приходят заявки?",
    answer:
      "Заявка одновременно уходит на два e-mail, в два Telegram-чата и в VK. Дублирование нужно, чтобы обращение не потерялось, если один канал временно недоступен.",
  },
  {
    id: "legal",
    question: "С кем заключается договор?",
    answer:
      "Самозанятый Мусина Гульназ Мягазовна, ИНН 631306493907. Работаем по договору, выдаём чек через «Мой налог», при необходимости подписываем NDA.",
  },
];

export const HERO_BADGES = [
  "ИИ-агенты",
  "RAG-системы",
  "Торговые боты",
  "Live MVP",
] as const;
