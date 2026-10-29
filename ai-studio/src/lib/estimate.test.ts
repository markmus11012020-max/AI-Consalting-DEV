import { describe, expect, it } from "vitest";

import {
  calculateEstimate,
  formatRub,
  formatWeeksRange,
  parseSelection,
  pluralizeWeeks,
  serializeSelection,
} from "@/lib/estimate";
import { PRICING_CATALOG, PRICING_RULES } from "@/lib/pricing";

describe("calculateEstimate", () => {
  it("считает базовую конфигурацию без скидки", () => {
    const estimate = calculateEstimate({
      platform: "web",
      ai: "agent",
      integrations: ["amocrm"],
    });

    expect(estimate.total).toBe(126_000 + 154_000 + 42_000);
    expect(estimate.discount).toBe(0);
    expect(estimate.lines).toHaveLength(3);
  });

  it("применяет скидку от двух интеграций", () => {
    const estimate = calculateEstimate({
      platform: "web",
      ai: "rag",
      integrations: ["amocrm", "robokassa"],
    });

    const subtotal = 126_000 + 196_000 + 42_000 + 49_000;
    const expectedDiscount =
      Math.round((subtotal * PRICING_RULES.discountRate) / 1000) * 1000;

    expect(estimate.discount).toBe(expectedDiscount);
    expect(estimate.total).toBe(subtotal - expectedDiscount);
  });

  it("не применяет скидку для одной интеграции", () => {
    const estimate = calculateEstimate({
      platform: "telegram",
      ai: "chatbot",
      integrations: ["fz152"],
    });

    expect(estimate.discount).toBe(0);
  });

  it("возвращает диапазон ±15% и стоимость поддержки", () => {
    const estimate = calculateEstimate({
      platform: "web",
      ai: "agent",
      integrations: ["amocrm"],
    });

    expect(estimate.totalMin).toBeLessThan(estimate.total);
    expect(estimate.totalMax).toBeGreaterThan(estimate.total);
    expect(estimate.supportMonthly).toBe(
      PRICING_RULES.supportBase + PRICING_RULES.supportPerIntegration,
    );
  });

  it("не позволяет получить ноль рублей и ноль недель", () => {
    const estimate = calculateEstimate({
      platform: "",
      ai: "",
      integrations: [],
    });

    expect(estimate.total).toBeGreaterThan(0);
    expect(estimate.weeks).toBeGreaterThan(0);
  });

  it("игнорирует неизвестные и дублирующиеся интеграции", () => {
    const estimate = calculateEstimate({
      platform: "vk",
      ai: "rag",
      integrations: ["amocrm", "amocrm", "unknown-id"],
    });

    expect(estimate.lines.filter((line) => line.id === "amocrm")).toHaveLength(1);
    expect(estimate.lines.map((line) => line.id)).not.toContain("unknown-id");
  });

  it("считает сроки с учётом параллельных интеграций", () => {
    const estimate = calculateEstimate({
      platform: "telegram",
      ai: "chatbot",
      integrations: ["amocrm", "robokassa"],
    });

    // max(3, 2) + (1.5 + 2) * 0.5 = 4.75 -> 5
    expect(estimate.weeks).toBe(5);
  });

  it("не мутирует каталог", () => {
    const snapshot = JSON.stringify(PRICING_CATALOG);
    calculateEstimate({
      platform: "web",
      ai: "rag",
      integrations: ["fz152"],
    });
    expect(JSON.stringify(PRICING_CATALOG)).toBe(snapshot);
  });
});

describe("formatting", () => {
  it("форматирует рубли с разделителями", () => {
    expect(formatRub(1_234_000).replace(/\s/g, " ")).toContain("1 234 000");
  });

  it("склоняет недели", () => {
    expect(pluralizeWeeks(1)).toBe("1 неделя");
    expect(pluralizeWeeks(3)).toBe("3 недели");
    expect(pluralizeWeeks(5)).toBe("5 недель");
    expect(pluralizeWeeks(11)).toBe("11 недель");
    expect(pluralizeWeeks(21)).toBe("21 неделя");
  });

  it("корректно склоняет дробные недели", () => {
    expect(pluralizeWeeks(1.5)).toBe("1,5 недели");
    expect(pluralizeWeeks(3.5)).toBe("3,5 недели");
  });

  it("форматирует диапазон недель", () => {
    expect(formatWeeksRange(5, 6)).toBe("5–6 недель");
  });
});

describe("serialization", () => {
  it("восстанавливает выбор из строки", () => {
    const selection = {
      platform: "web",
      ai: "rag",
      integrations: ["amocrm", "fz152"],
    };

    expect(parseSelection(serializeSelection(selection))).toEqual(selection);
  });

  it("возвращает null для битых данных", () => {
    expect(parseSelection("не json")).toBeNull();
    expect(parseSelection(null)).toBeNull();
    expect(parseSelection('{"platform":1}')).toBeNull();
  });
});
