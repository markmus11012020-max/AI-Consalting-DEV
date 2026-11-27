import type { ProjectCase } from "@/types";

import { PROJECTS } from "@/lib/content";

export interface AboutMetric {
  value: string;
  label: string;
}

export interface AboutExperience {
  id: string;
  company: string;
  location?: string;
  role: string;
  period: string;
  note?: string;
  responsibilities: string[];
  achievements: string[];
  stack?: string[];
}

export interface AboutSkillGroup {
  id: string;
  title: string;
  accent: "indigo" | "purple" | "teal" | "amber";
  items: string[];
}

export interface AboutEducation {
  id: string;
  year: string;
  title: string;
  place: string;
  note?: string;
}

export interface AboutAward {
  id: string;
  year: string;
  title: string;
  detail: string;
}

function project(id: string): ProjectCase {
  const found = PROJECTS.find((item) => item.id === id);

  if (!found) {
    throw new Error(`Unknown project: ${id}`);
  }

  return found;
}

export const ABOUT_PROFILE = {
  name: "Мусина Гульназ Мягазовна",
  shortName: "Гульназ Мусина",
  role: "AI Product Manager / Product Owner",
  focus: "AI-автоматизация бизнес-процессов",
  location: "Самара",
  format: "Full-time · удалённо / гибрид / офис",
  experience: "Более 20 лет",
  summary:
    "AI Product Manager / Product Owner с опытом более 20 лет в финансах, B2B-консалтинге и управлении. Последние 2,5 года создаю AI-продукты: Call-Pilot, КликЮрист, Aillix и EduAgent. Соединяю язык бизнеса и руки разработчика: не обещаю «магию ИИ», а проектирую измеримый процесс с контролем качества, стоимости и данных.",
  hackathon:
    "Финалист хакатона «Инвест-премаркет» Т-Инвест, ноябрь 2026",
  pdfHref: "/about/musina-gulnaz-ai-product-manager.pdf",
  docxHref: "/about/musina-gulnaz-ai-product-manager.docx",
  github: "https://github.com/markmus11012020-max",
  telegram: "https://t.me/GulnazM1101",
  email: "gmusina@list.ru",
  phone: "+7 (962) 609-00-01",
} as const;

export const ABOUT_METRICS: AboutMetric[] = [
  { value: "2", label: "собственных AI-сервиса" },
  { value: "100%", label: "звонков проходят QA" },
  { value: "0,27 ₽", label: "стоимость AI-разбора" },
  { value: "20+", label: "лет в финансах и управлении" },
];

export const ABOUT_WORKS: ProjectCase[] = [
  project("call-pilot"),
  {
    ...project("clickjurist"),
    href: "https://clickjurist.ru",
    hrefLabel: "Открыть сайт",
    badge: "продукт Aillix",
    result:
      "Публичный сервис с тарифами 99–295 ₽ и оплатой через Robokassa.",
  },
  {
    id: "aillix",
    title: "Aillix — AI-практика",
    category: "Студия / AI-решения",
    icon: "sparkles",
    accent: "indigo",
    badge: "практика",
    summary:
      "Студия AI-решений: агенты, RAG, автоматизация процессов и торговые боты. Публичный сайт с услугами, кейсами, калькулятором и FAQ.",
    result:
      "Упакованная практика: от позиционирования и услуг до кейсов и заявок.",
    href: "https://aillix.ru",
    hrefLabel: "Открыть сайт",
    highlights: [
      "Услуги и продуктовые пакеты с понятным результатом",
      "Кейсы, калькулятор стоимости и FAQ",
      "Контент, SEO и заявки в одном контуре",
      "Бренд, которому доверяют клиенты и партнёры",
    ],
    stack: ["Next.js", "FastAPI", "PostgreSQL", "Docker"],
    flow: ["Brand", "Services", "Cases", "Leads"],
  },
  project("eduagent"),
  {
    id: "github",
    title: "GitHub — инженерная лаборатория",
    category: "Open-source / код",
    icon: "cpu",
    accent: "purple",
    badge: "44 репозитория",
    summary:
      "Публичные репозитории: FinTech Compliance, Helpdesk AI, SQL Assistant, AI Report Generator, Telegram/VK-боты, MCP и торговые агенты.",
    result:
      "Код, тесты и архитектурные паттерны в открытом доступе.",
    href: "https://github.com/markmus11012020-max",
    hrefLabel: "Открыть GitHub",
    highlights: [
      "FinTech Compliance AI-Orchestrator на Java / Spring Boot",
      "Helpdesk AI Backend и Universal AI SQL Assistant",
      "AI Client Report Generator и Telegram/VK-боты",
      "MCP, RAG и торговые агенты",
    ],
    stack: ["Python", "Java", "TypeScript", "Docker"],
    flow: ["Repo", "Code", "Tests", "CI"],
  },
];

export const ABOUT_EXPERIENCE: AboutExperience[] = [
  {
    id: "aillix",
    company: "AILLIX",
    location: "Москва",
    role: "AI Full-stack Developer / AI-разработчик",
    period: "май 2024 — н.в.",
    responsibilities: [
      "Проектирование и разработка AI-агентов, RAG-систем и MVP под ключ.",
      "Prompt engineering: prompt chaining, agentic AI, token economy.",
      "Backend: Python / FastAPI, Java / Spring Boot, PostgreSQL, Docker, Yandex Cloud.",
      "Интеграция LLM-провайдеров: OpenAI, Anthropic, DeepSeek, YandexGPT, GigaChat.",
      "Product ownership: дискавери, требования, архитектура, приёмка, поддержка.",
    ],
    achievements: [
      "Запустила два собственных AI-сервиса: Call-Pilot и КликЮрист.",
      "Call-Pilot: HITL, 10 критериев QA, 100% покрытие звонков, 0,27 ₽ за разбор.",
      "КликЮрист: маскировка ПДн, проверка источников, PDF, оплата через Robokassa.",
      "Финалист хакатона «Инвест-премаркет» Т-Инвест, ноябрь 2026.",
      "44 публичных репозитория; FinTech Compliance, Helpdesk AI, SQL Assistant.",
      "Снизила зависимость от LLM-провайдера через Strategy/Factory и graceful fallback.",
    ],
    stack: [
      "Python",
      "FastAPI",
      "Java 17",
      "Spring Boot",
      "PostgreSQL",
      "Docker",
      "Yandex Cloud",
    ],
  },
  {
    id: "consulting",
    company: "Самарская консалтингово-исследовательская группа",
    location: "Самара",
    role: "Директор",
    period: "январь 2017 — декабрь 2024",
    responsibilities: [
      "Проведение консалтинговых исследований, аналитическая обработка рыночной информации.",
      "Подготовка отчётов, аналитических записок и справок.",
      "Мониторинг изменений в законодательстве, проверка данных.",
      "Взаимодействие с клиентами, подготовка индивидуальных предложений.",
      "Продвижение консалтинговых услуг, выполнение KPI по привлечению клиентов.",
    ],
    achievements: [
      "Выстроила полный цикл консалтингового проекта: исследование → аналитика → отчёт → презентация клиенту.",
      "Вела B2B-клиентов и полный цикл продаж: от первого контакта до сопровождения.",
      "Обеспечивала выполнение KPI по привлечению клиентов.",
      "Организовала мониторинг законодательства и проверку данных для аналитических материалов.",
    ],
    stack: ["B2B", "Аналитика", "Исследования", "Отчётность"],
  },
  {
    id: "finance",
    company: "Банки, инвестиции и лизинг",
    location: "Самара",
    role: "Руководитель обособленных подразделений",
    period: "декабрь 2003 — декабрь 2013",
    note: "Национальный торговый банк · Тройка Диалог · Петербургская лизинговая компания · Тимер Банк · УБРиР",
    responsibilities: [
      "Управление обособленными подразделениями: продажи, клиентский сервис, команда, операционные процессы.",
      "Аудит финансовых документов, проверка юридической чистоты сделок.",
      "Консультирование клиентов по банковским, инвестиционным и лизинговым продуктам.",
      "Выполнение KPI по продажам, переговоры с ключевыми клиентами.",
      "Найм, обучение и организация работы команд.",
    ],
    achievements: [
      "Руководила подразделениями в 5 финансовых организациях.",
      "Вела клиентские портфели и сделки, обеспечивала выполнение KPI по продажам.",
      "Формировала и обучала команды точек продаж.",
      "Сочетание управленческого опыта с экспертизой фондового рынка (Тройка Диалог).",
    ],
    stack: ["Банки", "Лизинг", "Инвестиции", "Продажи"],
  },
];

export const ABOUT_SKILLS: AboutSkillGroup[] = [
  {
    id: "ai",
    title: "AI & GenAI",
    accent: "indigo",
    items: [
      "Prompt Engineering",
      "Prompt Chaining",
      "Agentic AI",
      "RAG",
      "LLM Integration",
      "Token Economy",
      "HITL",
      "QA automation",
    ],
  },
  {
    id: "product",
    title: "Product",
    accent: "teal",
    items: [
      "Product Ownership",
      "Discovery",
      "Requirements",
      "Roadmap",
      "MVP",
      "Metrics",
      "B2B",
    ],
  },
  {
    id: "backend",
    title: "Backend",
    accent: "purple",
    items: [
      "Python",
      "FastAPI",
      "SQLAlchemy",
      "Java 17",
      "Spring Boot",
      "PostgreSQL",
      "Docker",
      "Git",
      "Yandex Cloud",
    ],
  },
  {
    id: "compliance",
    title: "Compliance",
    accent: "amber",
    items: [
      "ФЗ-152",
      "ФЗ-115",
      "PII masking",
      "Audit",
      "On-prem",
    ],
  },
  {
    id: "management",
    title: "Management",
    accent: "indigo",
    items: [
      "Team leadership",
      "B2B sales",
      "Negotiations",
      "Consulting",
      "Analytics",
    ],
  },
];

export const ABOUT_EDUCATION: AboutEducation[] = [
  {
    id: "ranepa",
    year: "2026",
    title: "Специалист по ИИ-инструментам: запросы и автоматизация без кода",
    place: "РАНХиГС, Москва",
    note: "Повышение квалификации",
  },
  {
    id: "sgea",
    year: "2004",
    title: "Экономическая теория",
    place: "Самарская государственная экономическая академия",
    note: "Высшее образование",
  },
  {
    id: "zerocoder",
    year: "2026",
    title: "Промт-инженер / вайб-кодер",
    place: "ZeroCoder",
    note: "Курс",
  },
  {
    id: "fsfr",
    year: "2.0",
    title: "Сертификат ФСФР",
    place: "Финансовый рынок",
    note: "Профессиональный сертификат",
  },
];

export const ABOUT_AWARDS: AboutAward[] = [
  {
    id: "t-invest-hackathon",
    year: "Ноябрь 2026",
    title: "Финалист хакатона «Инвест-премаркет» Т-Инвест",
    detail:
      "AI-агент для инвестиционного премаркета: LangGraph, RAG, T-Invest MCP и HITL.",
  },
];

export const ABOUT_CONTACTS = [
  {
    id: "telegram",
    label: "Telegram",
    value: "@GulnazM1101",
    href: "https://t.me/GulnazM1101",
  },
  {
    id: "email",
    label: "E-mail",
    value: "gmusina@list.ru",
    href: "mailto:gmusina@list.ru",
  },
  {
    id: "phone",
    label: "Телефон",
    value: "+7 (962) 609-00-01",
    href: "tel:+79626090001",
  },
  {
    id: "github",
    label: "GitHub",
    value: "markmus11012020-max",
    href: "https://github.com/markmus11012020-max",
  },
] as const;
