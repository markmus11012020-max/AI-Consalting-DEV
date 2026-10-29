import type { ContactChannel, NavItem } from "@/types";

export const SITE = {
  name: "AI.STUDIO",
  tagline: "Консалтинговая компания по внедрению ИИ",
  description:
    "Консалтинговая компания «Искусственный интеллект. Внедрение и разработка» проектирует и внедряет генеративный ИИ в реальный бизнес: автономные агенты, RAG-системы и Live MVP с боевой архитектурой и соответствием ФЗ-152.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-studio.ru",
  locale: "ru_RU",
  company: {
    legalName: "ООО «Искусственный интеллект. Внедрение и разработка»",
    shortName: "Искусственный интеллект",
    role: "консалтинговая компания по внедрению и разработке ИИ-решений",
  },
  contacts: {
    email: "gmusina@list.ru",
    telegram: "@GulnazM1101",
    telegramUrl: "https://t.me/GulnazM1101",
    phone: "+7 (962) 609-00-01",
    phoneHref: "tel:+79626090001",
    emailHref: "mailto:gmusina@list.ru",
  },
} as const;

export const NAV: NavItem[] = [
  { id: "expertise", label: "Экспертиза", href: "#expertise" },
  { id: "solutions", label: "Проекты", href: "#solutions" },
  { id: "process", label: "Процесс", href: "#process" },
  { id: "calculator", label: "Калькулятор", href: "#calculator" },
  { id: "faq", label: "FAQ", href: "#faq" },
];

export const HEADER_NAV: NavItem[] = NAV.slice(0, 4);

export const SECTION_IDS = [
  "top",
  "use-cases",
  "expertise",
  "solutions",
  "process",
  "calculator",
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
