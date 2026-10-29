import type { PricingOption } from "@/types";

/**
 * Каталог калькулятора — единственное место, где живут цифры.
 *
 * Цены указаны со скидкой −30% от базового прайса (согласовано с заказчиком).
 * TODO(PRICING): финальные значения подтвердить перед публикацией. После
 * согласования меняются только `price` и `weeks`, интерфейс и логика расчёта
 * не затрагиваются.
 */
export const PRICING_CATALOG: PricingOption[] = [
  // Платформа (взаимоисключающий выбор)
  {
    id: "web",
    category: "platform",
    label: "Web-интерфейс",
    description: "Адаптивное приложение, личный кабинет, API-интеграции",
    price: 126_000,
    weeks: 4,
  },
  {
    id: "telegram",
    category: "platform",
    label: "Telegram-бот",
    description: "Бот с меню, оплатой и админ-панелью",
    price: 84_000,
    weeks: 3,
  },
  {
    id: "vk",
    category: "platform",
    label: "VK Mini App",
    description: "Mini App с авторизацией VK ID и платежами",
    price: 98_000,
    weeks: 3.5,
  },

  // Архитектура ИИ (взаимоисключающий выбор)
  {
    id: "chatbot",
    category: "ai",
    label: "Простой чат-бот",
    description: "Сценарный бот с LLM-ответами на типовые вопросы",
    price: 63_000,
    weeks: 2,
  },
  {
    id: "agent",
    category: "ai",
    label: "ИИ-агент с памятью",
    description: "Инструменты, память, многошаговые сценарии",
    price: 154_000,
    weeks: 5,
    badge: "Популярно",
  },
  {
    id: "rag",
    category: "ai",
    label: "RAG-база знаний",
    description: "Metadata-driven retrieval по вашим документам",
    price: 196_000,
    weeks: 6,
  },

  // Дополнительные интеграции (множественный выбор)
  {
    id: "fz152",
    category: "integration",
    label: "ФЗ-152 комплаенс",
    description: "Маскирование PII, согласия, аудит доступа",
    price: 84_000,
    weeks: 3,
    badge: "Рекомендуем",
  },
  {
    id: "amocrm",
    category: "integration",
    label: "AmoCRM API",
    description: "Двусторонняя синхронизация сделок и лидов",
    price: 42_000,
    weeks: 1.5,
  },
  {
    id: "robokassa",
    category: "integration",
    label: "Robokassa",
    description: "Приём платежей, чеки, возвраты",
    price: 49_000,
    weeks: 2,
  },
];

export const PRICING_RULES = {
  /** Скидка при выборе двух и более интеграций */
  discountThreshold: 2,
  discountRate: 0.07,
  /** Диапазон оценки: ±15% */
  rangeSpread: 0.15,
  /** Округление итогов до 1000 ₽ */
  rounding: 1_000,
  /** Месячная поддержка: база + за интеграцию (тоже −30%) */
  supportBase: 8_400,
  supportPerIntegration: 1_050,
  /** Интеграции распараллеливаются с разработкой ядра */
  integrationOverlap: 0.5,
} as const;

export const DEFAULT_SELECTION = {
  platform: "web",
  ai: "agent",
  integrations: ["amocrm"],
} as const;

export const CATEGORY_LABELS: Record<PricingOption["category"], string> = {
  platform: "Платформа",
  ai: "Архитектура ИИ",
  integration: "Дополнительные интеграции",
};

export function optionsByCategory(
  category: PricingOption["category"],
  catalog: PricingOption[] = PRICING_CATALOG,
): PricingOption[] {
  return catalog.filter((option) => option.category === category);
}

export function findOption(
  id: string,
  catalog: PricingOption[] = PRICING_CATALOG,
): PricingOption | undefined {
  return catalog.find((option) => option.id === id);
}
