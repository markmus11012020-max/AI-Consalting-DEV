"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";

import { EstimateCard } from "@/components/calculator/estimate-card";
import {
  IntegrationOptions,
  RadioOptions,
} from "@/components/calculator/option-group";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import {
  ESTIMATE_EVENT,
  ESTIMATE_SESSION_KEY,
  ESTIMATE_SUMMARY_KEY,
  buildEstimateSummary,
  calculateEstimate,
  parseSelection,
  selectionFromSearchParams,
  selectionToSearchParams,
  serializeSelection,
} from "@/lib/estimate";
import {
  DEFAULT_SELECTION,
  PRICING_CATALOG,
  PRICING_RULES,
  optionsByCategory,
} from "@/lib/pricing";
import type { EstimateSelection } from "@/types";

const PLATFORM_OPTIONS = optionsByCategory("platform");
const AI_OPTIONS = optionsByCategory("ai");
const INTEGRATION_OPTIONS = optionsByCategory("integration");

const INITIAL_SELECTION: EstimateSelection = {
  platform: DEFAULT_SELECTION.platform,
  ai: DEFAULT_SELECTION.ai,
  integrations: [...DEFAULT_SELECTION.integrations],
};

function scrollToContact() {
  const target = document.getElementById("contact");
  if (!target) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  target.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "start",
  });
}

export function Calculator() {
  const [selection, setSelection] = useState<EstimateSelection>(INITIAL_SELECTION);
  const [ready, setReady] = useState(false);

  // Гидратация: ссылка имеет приоритет, затем sessionStorage.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = selectionFromSearchParams(params);
    const stored = parseSelection(
      window.sessionStorage.getItem(ESTIMATE_SESSION_KEY),
    );

    const restored = fromUrl ?? stored;
    if (restored) setSelection(restored);
    setReady(true);
  }, []);

  // Синхронизация состояния с адресной строкой и sessionStorage.
  useEffect(() => {
    if (!ready) return;

    const params = selectionToSearchParams(selection);
    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", url);
    window.sessionStorage.setItem(
      ESTIMATE_SESSION_KEY,
      serializeSelection(selection),
    );
  }, [selection, ready]);

  const estimate = useMemo(
    () => calculateEstimate(selection, PRICING_CATALOG),
    [selection],
  );

  const isDefault =
    selection.platform === INITIAL_SELECTION.platform &&
    selection.ai === INITIAL_SELECTION.ai &&
    selection.integrations.length === INITIAL_SELECTION.integrations.length &&
    selection.integrations.every((id) =>
      INITIAL_SELECTION.integrations.includes(id),
    );

  const handleGetEstimate = () => {
    const summary = buildEstimateSummary(selection, estimate);
    window.sessionStorage.setItem(ESTIMATE_SUMMARY_KEY, summary);
    window.dispatchEvent(new CustomEvent(ESTIMATE_EVENT, { detail: summary }));
    scrollToContact();
  };

  const handleReset = () => setSelection(INITIAL_SELECTION);

  const toggleIntegration = (id: string) => {
    setSelection((current) => ({
      ...current,
      integrations: current.integrations.includes(id)
        ? current.integrations.filter((item) => item !== id)
        : [...current.integrations, id],
    }));
  };

  return (
    <Section id="calculator" labelledBy="calculator-title">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-10 h-72 w-[46rem] -translate-x-1/2 rounded-full bg-purple-600/[0.07] blur-3xl"
      />

      <Container className="relative">
        <Reveal>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              id="calculator-title"
              eyebrow="Калькулятор"
              title={
                <>
                  Соберите конфигурацию и{" "}
                  <span className="text-gradient">увидите смету</span>
                </>
              }
              description="Стоимость и сроки пересчитываются мгновенно. Конфигурацию можно отправить ссылкой или сразу передать в заявку."
            />
            <Badge variant="purple" className="w-fit gap-2">
              <Sparkles className="h-3 w-3" />
              Скидка {Math.round(PRICING_RULES.discountRate * 100)}% от двух
              интеграций
            </Badge>
          </div>
        </Reveal>

        <div className="mt-10 grid items-start gap-6 lg:grid-cols-[1.12fr_0.88fr]">
          <Reveal>
            <div className="glow-card rounded-2xl border border-white/[0.07] p-5 sm:p-7">
              <div className="space-y-7">
                <div>
                  <div className="mb-3 flex items-baseline gap-2.5">
                    <span className="font-mono text-[12.5px] text-indigo-400/80">
                      01
                    </span>
                    <h3 className="text-[15px] font-semibold uppercase tracking-[0.12em] text-slate-300">
                      Платформа
                    </h3>
                  </div>
                  <RadioOptions
                    label="Платформа"
                    name="platform"
                    value={selection.platform}
                    options={PLATFORM_OPTIONS}
                    onChange={(id) =>
                      setSelection((current) => ({ ...current, platform: id }))
                    }
                  />
                </div>

                <div className="border-t border-white/[0.06] pt-7">
                  <div className="mb-3 flex items-baseline gap-2.5">
                    <span className="font-mono text-[12.5px] text-indigo-400/80">
                      02
                    </span>
                    <h3 className="text-[15px] font-semibold uppercase tracking-[0.12em] text-slate-300">
                      Архитектура ИИ
                    </h3>
                  </div>
                  <RadioOptions
                    label="Архитектура ИИ"
                    name="ai"
                    value={selection.ai}
                    options={AI_OPTIONS}
                    onChange={(id) =>
                      setSelection((current) => ({ ...current, ai: id }))
                    }
                  />
                </div>

                <div className="border-t border-white/[0.06] pt-7">
                  <div className="mb-3 flex items-baseline gap-2.5">
                    <span className="font-mono text-[12.5px] text-indigo-400/80">
                      03
                    </span>
                    <h3 className="text-[15px] font-semibold uppercase tracking-[0.12em] text-slate-300">
                      Дополнительные интеграции
                    </h3>
                  </div>
                  <IntegrationOptions
                    label="Дополнительные интеграции"
                    options={INTEGRATION_OPTIONS}
                    selected={selection.integrations}
                    onToggle={toggleIntegration}
                  />
                  <p className="mt-3 text-[12.5px] text-slate-500">
                    Можно выбрать несколько. Интеграции распараллеливаются с
                    разработкой ядра, поэтому срок растёт не линейно.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <EstimateCard
              estimate={estimate}
              onGetEstimate={handleGetEstimate}
              onReset={handleReset}
              canReset={!isDefault}
            />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
