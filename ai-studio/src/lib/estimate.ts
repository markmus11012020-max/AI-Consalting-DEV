import { PRICING_RULES, PRICING_CATALOG, findOption } from "@/lib/pricing";
import type { Estimate, EstimateSelection, PricingOption } from "@/types";

function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step;
}

function pick(
  id: string,
  catalog: PricingOption[],
  category: PricingOption["category"],
  fallbackId: string,
): PricingOption {
  const found = findOption(id, catalog);
  if (found && found.category === category) return found;

  const fallback = findOption(fallbackId, catalog);
  if (fallback) return fallback;

  const firstOfCategory = catalog.find((option) => option.category === category);
  if (!firstOfCategory) {
    throw new Error(`Pricing catalog has no options for category "${category}"`);
  }
  return firstOfCategory;
}

/**
 * Чистая функция расчёта сметы. Никакого React и побочных эффектов —
 * поэтому легко тестируется и переиспользуется на сервере.
 */
export function calculateEstimate(
  selection: EstimateSelection,
  catalog: PricingOption[] = PRICING_CATALOG,
): Estimate {
  const platform = pick(selection.platform, catalog, "platform", "web");
  const ai = pick(selection.ai, catalog, "ai", "agent");

  const integrations = Array.from(new Set(selection.integrations))
    .map((id) => findOption(id, catalog))
    .filter((option): option is PricingOption => option?.category === "integration");

  const lines = [platform, ai, ...integrations].map((option) => ({
    id: option.id,
    label: option.label,
    price: option.price,
    weeks: option.weeks,
  }));

  const subtotal = lines.reduce((sum, line) => sum + line.price, 0);

  const discount =
    integrations.length >= PRICING_RULES.discountThreshold
      ? roundTo(subtotal * PRICING_RULES.discountRate, PRICING_RULES.rounding)
      : 0;

  const total = subtotal - discount;

  const integrationWeeks = integrations.reduce(
    (sum, option) => sum + option.weeks,
    0,
  );
  const weeks = Math.max(
    1,
    Math.ceil(
      Math.max(platform.weeks, ai.weeks) +
        integrationWeeks * PRICING_RULES.integrationOverlap,
    ),
  );

  return {
    total,
    totalMin: roundTo(total * (1 - PRICING_RULES.rangeSpread), PRICING_RULES.rounding),
    totalMax: roundTo(total * (1 + PRICING_RULES.rangeSpread), PRICING_RULES.rounding),
    weeks,
    weekMin: weeks,
    weekMax: weeks + 1,
    supportMonthly:
      PRICING_RULES.supportBase +
      integrations.length * PRICING_RULES.supportPerIntegration,
    discount,
    lines,
  };
}

export function formatRub(value: number): string {
  return `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(value)} ₽`;
}

export function pluralizeWeeks(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  const formatted = Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(1).replace(".", ",");

  // Дробные значения («1,5 недели», «3,5 недели») всегда идут с «недели».
  if (!Number.isInteger(rounded)) return `${formatted} недели`;

  const mod10 = rounded % 10;
  const mod100 = rounded % 100;
  if (mod10 === 1 && mod100 !== 11) return `${formatted} неделя`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${formatted} недели`;
  }
  return `${formatted} недель`;
}

export function formatWeeksRange(min: number, max: number): string {
  return `${min}–${max} ${pluralizeWeeks(max).split(" ")[1]}`;
}

export function describeSelection(selection: EstimateSelection): string {
  const platform = findOption(selection.platform);
  const ai = findOption(selection.ai);
  const integrations = selection.integrations
    .map((id) => findOption(id)?.label)
    .filter((label): label is string => Boolean(label));

  const parts = [
    platform ? `Платформа: ${platform.label}` : null,
    ai ? `Архитектура ИИ: ${ai.label}` : null,
    integrations.length > 0
      ? `Интеграции: ${integrations.join(", ")}`
      : "Интеграции: не выбраны",
  ];

  return parts.filter(Boolean).join("; ");
}

export function serializeSelection(selection: EstimateSelection): string {
  return JSON.stringify(selection);
}
export function parseSelection(raw: string | null): EstimateSelection | null {
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "platform" in parsed &&
      "ai" in parsed &&
      "integrations" in parsed &&
      typeof parsed.platform === "string" &&
      typeof parsed.ai === "string" &&
      Array.isArray(parsed.integrations)
    ) {
      return {
        platform: parsed.platform,
        ai: parsed.ai,
        integrations: parsed.integrations.filter(
          (id): id is string => typeof id === "string",
        ),
      };
    }
  } catch {
    return null;
  }

  return null;
}

/** Ключи для обмена конфигурацией между калькулятором и формой заявки. */
export const ESTIMATE_SESSION_KEY = "ai-studio:estimate";
export const ESTIMATE_SUMMARY_KEY = "ai-studio:estimate-summary";
export const ESTIMATE_EVENT = "ai-studio:estimate";

export function selectionFromSearchParams(
  params: URLSearchParams,
  catalog: PricingOption[] = PRICING_CATALOG,
): EstimateSelection | null {
  const platformId = params.get("platform");
  const aiId = params.get("ai");
  if (!platformId || !aiId) return null;

  const platform = findOption(platformId, catalog);
  const ai = findOption(aiId, catalog);
  if (!platform || platform.category !== "platform") return null;
  if (!ai || ai.category !== "ai") return null;

  const integrations = (params.get("int") ?? "")
    .split(",")
    .map((id) => findOption(id.trim(), catalog))
    .filter(
      (option): option is PricingOption => option?.category === "integration",
    )
    .map((option) => option.id);

  return { platform: platformId, ai: aiId, integrations };
}

export function selectionToSearchParams(
  selection: EstimateSelection,
): URLSearchParams {
  const params = new URLSearchParams();
  params.set("platform", selection.platform);
  params.set("ai", selection.ai);
  if (selection.integrations.length > 0) {
    params.set("int", selection.integrations.join(","));
  }
  return params;
}

export function buildEstimateSummary(
  selection: EstimateSelection,
  estimate: Estimate,
): string {
  return [
    describeSelection(selection),
    `Итого: ${formatRub(estimate.total)} (${formatRub(estimate.totalMin)} — ${formatRub(estimate.totalMax)})`,
    `Срок: ${formatWeeksRange(estimate.weekMin, estimate.weekMax)}`,
    `Поддержка: ${formatRub(estimate.supportMonthly)}/мес`,
  ].join(". ");
}
