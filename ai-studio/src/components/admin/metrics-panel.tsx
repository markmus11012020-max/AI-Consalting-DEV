"use client";

import { useCallback, useEffect, useState } from "react";
import { MousePointerClick, RefreshCw, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { adminApi } from "@/lib/admin/api";
import type { Heatmap, MetricsSummary } from "@/types/admin";

const GRID = 20;

function formatSeconds(value: number): string {
  if (value < 60) return `${Math.round(value)} с`;
  return `${Math.round(value / 60)} мин`;
}

export function MetricsPanel() {
  const [summary, setSummary] = useState<MetricsSummary | null>(null);
  const [heatmap, setHeatmap] = useState<Heatmap | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [summaryData, heatmapData] = await Promise.all([
        adminApi.metricsSummary(),
        adminApi.heatmap(GRID),
      ]);
      setSummary(summaryData);
      setHeatmap(heatmapData);
    } catch {
      toast.error("Не удалось загрузить метрики");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const cells = new Map<string, number>();
  let max = 1;
  for (const cell of heatmap?.cells ?? []) {
    cells.set(`${cell.x}:${cell.y}`, cell.weight);
    if (cell.weight > max) max = cell.weight;
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13.5px] text-muted-foreground">
          События за последние 30 дней. Данные собираются на своём сервере.
        </p>
        <Button variant="secondary" size="sm" onClick={() => void load()}>
          <RefreshCw className="h-3.5 w-3.5" />
          Обновить
        </Button>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-muted-foreground">Считаем метрики…</p>
      ) : (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                label: "Сессии",
                value: summary?.sessions ?? 0,
                icon: Users,
              },
              {
                label: "Просмотры",
                value: summary?.page_views ?? 0,
                icon: MousePointerClick,
              },
              {
                label: "Клики",
                value: summary?.clicks ?? 0,
                icon: MousePointerClick,
              },
              {
                label: "Точки курсора",
                value: summary?.cursor_points ?? 0,
                icon: MousePointerClick,
              },
              {
                label: "Средняя сессия",
                value: formatSeconds(summary?.avg_session_seconds ?? 0),
                icon: Users,
              },
              {
                label: "Вернулись",
                value: summary?.returning_sessions ?? 0,
                icon: Users,
              },
            ].map((card) => (
              <div
                key={card.label}
                className="rounded-xl border border-border bg-card p-4"
              >
                <p className="text-[12px] uppercase tracking-[0.12em] text-muted-foreground">
                  {card.label}
                </p>
                <p className="mt-1 font-display text-2xl font-bold text-foreground">
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <p className="text-[14.5px] font-semibold text-foreground">
                  Heatmap курсора
                </p>
                <p className="mt-0.5 text-[12.5px] text-muted-foreground">
                  Сетка {GRID}×{GRID}, координаты нормализованы — не зависят от
                  разрешения.
                </p>
              </div>
              <p className="font-mono text-[12px] text-muted-foreground">
                {heatmap?.total_points ?? 0} точек
              </p>
            </div>

            <div
              className="mt-4 grid aspect-[16/9] w-full overflow-hidden rounded-lg border border-border bg-background"
              style={{ gridTemplateColumns: `repeat(${GRID}, minmax(0, 1fr))` }}
              role="img"
              aria-label={`Тепловая карта: ${heatmap?.total_points ?? 0} точек курсора`}
            >
              {Array.from({ length: GRID * GRID }).map((_, index) => {
                const x = index % GRID;
                const y = Math.floor(index / GRID);
                const weight = cells.get(`${x}:${y}`) ?? 0;
                const intensity = weight === 0 ? 0 : Math.min(1, weight / max);
                return (
                  <div
                    key={index}
                    style={{
                      backgroundColor:
                        intensity === 0
                          ? "transparent"
                          : `rgba(67, 56, 202, ${0.1 + intensity * 0.85})`,
                    }}
                  />
                );
              })}
            </div>

            {(heatmap?.total_points ?? 0) === 0 ? (
              <p className="mt-3 text-[13px] text-muted-foreground">
                Пока нет точек курсора. Откройте сайт desktop-браузером,
                подвигайте мышью и вернитесь в панель.
              </p>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
