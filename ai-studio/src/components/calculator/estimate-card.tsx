"use client";

import { ArrowRight, Calculator, RotateCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRub, formatWeeksRange } from "@/lib/estimate";
import type { Estimate } from "@/types";

interface EstimateCardProps {
  estimate: Estimate;
  onGetEstimate: () => void;
  onReset: () => void;
  canReset: boolean;
}

export function EstimateCard({
  estimate,
  onGetEstimate,
  onReset,
  canReset,
}: EstimateCardProps) {
  const hasDiscount = estimate.discount > 0;

  return (
    <aside
      aria-label="Предварительная смета"
      className="lg:sticky lg:top-24"
    >
      <div className="glow-card rounded-2xl border border-white/[0.08] p-5 shadow-card sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-300">
            <Calculator className="h-4 w-4 text-indigo-300" />
            <span className="text-[14.5px] font-medium">Предварительная смета</span>
          </div>
          <Badge variant="accent" className="text-[11.5px]">
            ±15%
          </Badge>
        </div>

        <div aria-live="polite" aria-atomic="true" className="mt-4">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Стоимость проекта
          </p>
          <p className="mt-1 font-display text-[2.1rem] font-bold leading-none tracking-tight text-white sm:text-[2.35rem]">
            {formatRub(estimate.total)}
          </p>
          <p className="mt-2 text-[13px] text-slate-500">
            {formatRub(estimate.totalMin)} — {formatRub(estimate.totalMax)}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
            <p className="text-[11.5px] uppercase tracking-wide text-slate-500">
              Сроки
            </p>
            <p className="mt-1 text-[14.5px] font-semibold text-slate-100">
              {formatWeeksRange(estimate.weekMin, estimate.weekMax)}
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
            <p className="text-[11.5px] uppercase tracking-wide text-slate-500">
              Поддержка
            </p>
            <p className="mt-1 text-[14.5px] font-semibold text-slate-100">
              {formatRub(estimate.supportMonthly)}
              <span className="text-[12px] font-normal text-slate-500">/мес</span>
            </p>
          </div>
        </div>

        <div className="mt-5 border-t border-white/[0.07] pt-4">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Состав работ
          </p>
          <ul className="mt-2.5 space-y-1.5">
            {estimate.lines.map((line) => (
              <li
                key={line.id}
                className="flex items-baseline justify-between gap-3 text-[14px]"
              >
                <span className="text-slate-400">{line.label}</span>
                <span className="shrink-0 text-slate-300">
                  {formatRub(line.price)}
                </span>
              </li>
            ))}
            {hasDiscount ? (
              <li className="flex items-baseline justify-between gap-3 text-[14px]">
                <span className="text-emerald-300/90">Скидка за набор</span>
                <span className="shrink-0 text-emerald-300">
                  −{formatRub(estimate.discount)}
                </span>
              </li>
            ) : null}
          </ul>
        </div>

        <Button type="button" size="lg" className="mt-5 w-full" onClick={onGetEstimate}>
          Получить детальную смету
          <ArrowRight className="h-4 w-4" />
        </Button>

        <div className="mt-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onReset}
            disabled={!canReset}
            className="inline-flex items-center gap-1.5 text-[12.5px] text-slate-500 transition-colors hover:text-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RotateCcw className="h-3 w-3" />
            Сбросить выбор
          </button>
          <span className="text-right text-[12px] leading-tight text-slate-600">
            Оценка ориентировочная
          </span>
        </div>

        <p className="mt-3 rounded-lg border border-white/[0.06] bg-black/20 p-2.5 text-[12px] leading-relaxed text-slate-500">
          Точная смета фиксируется после дискавери: объём данных, интеграции и
          требования к инфраструктуре влияют на итог.
        </p>
      </div>
    </aside>
  );
}
