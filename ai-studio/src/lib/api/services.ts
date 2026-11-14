import type { ServiceOffer } from "@/types";

export interface ApiService {
  id: number;
  slug: string;
  title: string;
  summary: string;
  outcome: string;
  icon: string;
  accent: string;
  price_min: number;
  price_max: number;
  currency: string;
  duration_days_min: number;
  duration_days_max: number;
  highlights: string[];
  sort_order: number;
  is_active: boolean;
}

const API_URL =
  process.env.API_INTERNAL_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://127.0.0.1:8000";

const ALLOWED_ACCENTS = new Set(["indigo", "teal", "amber", "rose"]);

function formatMoney(value: number): string {
  return new Intl.NumberFormat("ru-RU").format(value);
}

function formatWeeks(daysMin: number, daysMax: number): string {
  const toWeeks = (days: number) => Math.max(1, Math.round(days / 7));
  if (daysMax <= 7) {
    return `${daysMin}–${daysMax} дн.`;
  }
  return `${toWeeks(daysMin)}–${toWeeks(daysMax)} нед.`;
}

export function toServiceOffer(service: ApiService): ServiceOffer {
  return {
    id: service.slug,
    title: service.title,
    icon: service.icon as ServiceOffer["icon"],
    summary: service.summary,
    outcome: service.outcome,
    price:
      service.price_min > 0
        ? `от ${formatMoney(service.price_min)} ₽`
        : "по запросу",
    weeks: formatWeeks(service.duration_days_min, service.duration_days_max),
    highlights: Array.isArray(service.highlights) ? service.highlights : [],
    accent: ALLOWED_ACCENTS.has(service.accent)
      ? (service.accent as ServiceOffer["accent"])
      : "indigo",
  };
}

/**
 * Услуги из PostgreSQL через FastAPI.
 * Если backend недоступен (dev без Docker, деплой в процессе), страница
 * продолжает работать на статическом каталоге из content.ts.
 */
export async function getServices(): Promise<ServiceOffer[]> {
  try {
    const response = await fetch(`${API_URL}/api/services`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(2500),
    });

    if (!response.ok) return [];

    const data = (await response.json()) as ApiService[];
    if (!Array.isArray(data) || data.length === 0) return [];

    return data.map(toServiceOffer);
  } catch {
    return [];
  }
}
