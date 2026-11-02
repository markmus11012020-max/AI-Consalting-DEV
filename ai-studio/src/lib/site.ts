import type { ContactChannel, NavItem } from "@/types";

export const SITE = {
  name: "Aillix",
  tagline: "AI-инженерия для реального бизнеса",
  description:
    "Aillix проектирует и внедряет ИИ-агентов, RAG-системы и торговых ботов для бизнеса: от идеи до реального запуска, с фиксированными критериями успеха, защитой данных и кодом у клиента.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://aillix.ru",
  locale: "ru_RU",
  company: {
    legalName: "Самозанятый Мусина Гульназ Мягазовна",
    shortName: "Aillix",
    inn: "631306493907",
    role: "AI-инженерия и разработка",
  },
  contacts: {
    email: "gmusina@list.ru",
    emailHref: "mailto:gmusina@list.ru",
    leadEmails: ["pochta.samara163@mail.ru", "gmusina@list.ru"] as const,
    telegram: "@GulnazM1101",
    telegramUrl: "https://t.me/GulnazM1101",
    telegramSales: "@rust163",
    telegramSalesUrl: "https://t.me/rust163",
    phone: "+7 (962) 609-00-01",
    phoneHref: "tel:+79626090001",
  },
} as const;

export const NAV: NavItem[] = [
  { id: "services", label: "Услуги", href: "#services" },
  { id: "cases", label: "Кейсы", href: "#cases" },
  { id: "trading", label: "Торговые боты", href: "#trading" },
  { id: "calculator", label: "Калькулятор", href: "#calculator" },
  { id: "tech", label: "Технологии", href: "#tech" },
  { id: "faq", label: "FAQ", href: "#faq" },
  { id: "contact", label: "Контакты", href: "#contact" },
];

export const HEADER_NAV: NavItem[] = NAV.filter((item) =>
  ["services", "cases", "trading", "calculator", "tech"].includes(item.id),
);

export const SECTION_IDS = [
  "top",
  "pains",
  "services",
  "cases",
  "trading",
  "calculator",
  "process",
  "trust",
  "tech",
  "faq",
  "contact",
] as const;

export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    id: "telegram",
    label: "Telegram",
    value: SITE.contacts.telegram,
    href: SITE.contacts.telegramUrl,
    hint: "Самый быстрый канал",
    icon: "bot",
  },
  {
    id: "email",
    label: "E-mail",
    value: SITE.contacts.email,
    href: SITE.contacts.emailHref,
    hint: "Для документов и ТЗ",
    icon: "file-text",
  },
  {
    id: "phone",
    label: "Телефон",
    value: SITE.contacts.phone,
    href: SITE.contacts.phoneHref,
    hint: "Пн–Пт, 10:00–19:00 МСК",
    icon: "cpu",
  },
];

export const STACK_STRIP = [
  "Python",
  "FastAPI",
  "LangGraph",
  "Pinecone",
  "Java 17",
  "Spring Boot 3",
  "PostgreSQL",
  "Docker",
  "Yandex Cloud",
];
