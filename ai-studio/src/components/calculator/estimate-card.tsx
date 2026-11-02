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
      <div className="glow-card rounded-2xl border border-border p-5 shadow-card sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-foreground">
            <Calculator className="h-4 w-4 text-primary" />
            <span className="text-[14.5px] font-medium">Предварительная смета</span>
          </div>
          <Badge variant="accent" className="text-[11.5px]">
            ±15%
          </Badge>
        </div>

        <div aria-live="polite" aria-atomic="true" className="mt-4">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Стоимость проекта
          </p>
          <p className="mt-1 font-display text-[2.1rem] font-bold leading-none tracking-tight text-foreground sm:text-[2.35rem]">
            {formatRub(estimate.total)}
          </p>
          <p className="mt-2 text-[13px] text-muted-foreground">
            {formatRub(estimate.totalMin)} — {formatRub(estimate.totalMax)}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <div className="rounded-xl border border-border bg-card p-3">
            <p className="text-[11.5px] uppercase tracking-wide text-muted-foreground">
              Сроки
            </p>
            <p className="mt-1 text-[14.5px] font-semibold text-foreground">
              {formatWeeksRange(estimate.weekMin, estimate.weekMax)}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3">
            <p className="text-[11.5px] uppercase tracking-wide text-muted-foreground">
              Поддержка
            </p>
            <p className="mt-1 text-[14.5px] font-semibold text-foreground">
              {formatRub(estimate.supportMonthly)}
              <span className="text-[12px] font-normal text-muted-foreground">/мес</span>
            </p>
          </div>
        </div>

        <div className="mt-5 border-t border-border pt-4">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Состав работ
          </p>
          <ul className="mt-2.5 space-y-1.5">
            {estimate.lines.map((line) => (
              <li
                key={line.id}
                className="flex items-baseline justify-between gap-3 text-[14px]"
              >
                <span className="text-muted-foreground">{line.label}</span>
                <span className="shrink-0 text-foreground">
                  {formatRub(line.price)}
                </span>
              </li>
            ))}
            {hasDiscount ? (
              <li className="flex items-baseline justify-between gap-3 text-[14px]">
                <span className="text-success/90">Скидка за набор</span>
                <span className="shrink-0 text-success">
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
            className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RotateCcw className="h-3 w-3" />
            Сбросить выбор
          </button>
          <span className="text-right text-[12px] leading-tight text-muted-foreground">
            Оценка ориентировочная
          </span>
        </div>

        <p className="mt-3 rounded-lg border border-border bg-muted/40 p-2.5 text-[12px] leading-relaxed text-muted-foreground">
          Точная смета фиксируется после дискавери: объём данных, интеграции и
          требования к инфраструктуре влияют на итог.
        </p>
      </div>
    </aside>
  );
}
