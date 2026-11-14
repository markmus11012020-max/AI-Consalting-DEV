"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { adminApi } from "@/lib/admin/api";
import type {
  AdminApplication,
  AdminStats,
  ApplicationStatus,
} from "@/types/admin";
import { cn } from "@/lib/utils";

const TEMP_LABEL: Record<AdminApplication["temperature"], string> = {
  hot: "Горячая",
  warm: "Тёплая",
  cold: "Холодная",
};

const TEMP_CLASS: Record<AdminApplication["temperature"], string> = {
  hot: "border-destructive/30 bg-destructive/10 text-destructive",
  warm: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  cold: "border-border bg-muted text-muted-foreground",
};

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  new: "Новая",
  in_progress: "В работе",
  won: "Сделка",
  lost: "Отказ",
};

const SCORE_LABEL: Record<string, string> = {
  deadline: "Срочность",
  budget: "Бюджет",
  role: "Роль",
  company_size: "Размер компании",
  task_volume: "Объём задач",
  engagement: "Вовлечённость",
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatMoney(value: number | null): string {
  if (value === null) return "—";
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
}

export function ApplicationsPanel() {
  const [items, setItems] = useState<AdminApplication[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [temperature, setTemperature] = useState("");
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [list, summary] = await Promise.all([
        adminApi.applications({ temperature, status, q: query }),
        adminApi.stats(),
      ]);
      setItems(list.items);
      setStats(summary);
    } catch {
      toast.error("Не удалось загрузить заявки");
    } finally {
      setLoading(false);
    }
  }, [temperature, status, query]);

  useEffect(() => {
    void load();
  }, [load]);

  const changeStatus = async (id: number, next: ApplicationStatus) => {
    try {
      const updated = await adminApi.updateApplication(id, { status: next });
      setItems((current) =>
        current.map((item) => (item.id === id ? updated : item)),
      );
      toast.success("Статус обновлён");
    } catch {
      toast.error("Не удалось обновить статус");
    }
  };

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Всего заявок", value: stats?.total ?? 0 },
          { label: "Горячие", value: stats?.hot ?? 0 },
          { label: "Тёплые", value: stats?.warm ?? 0 },
          { label: "Средний скор", value: stats?.avg_score ?? 0 },
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

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Поиск по имени, контакту или тексту"
            className="h-10 rounded-xl pl-9"
          />
        </div>
        <select
          value={temperature}
          onChange={(event) => setTemperature(event.target.value)}
          className="h-10 rounded-xl border border-border bg-card px-3 text-[13.5px]"
          aria-label="Фильтр по температуре"
        >
          <option value="">Все температуры</option>
          <option value="hot">Горячие</option>
          <option value="warm">Тёплые</option>
          <option value="cold">Холодные</option>
        </select>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="h-10 rounded-xl border border-border bg-card px-3 text-[13.5px]"
          aria-label="Фильтр по статусу"
        >
          <option value="">Все статусы</option>
          {Object.entries(STATUS_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-muted-foreground">Загружаем заявки…</p>
      ) : items.length === 0 ? (
        <p className="mt-6 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Заявок пока нет. Отправьте тестовую с сайта или запустите
          <code className="mx-1 rounded bg-muted px-1.5 py-0.5 font-mono text-[12px]">
            seed_demo_applications
          </code>
          .
        </p>
      ) : (
        <div className="mt-5 space-y-2">
          {items.map((item) => {
            const isOpen = expanded === item.id;
            return (
              <div
                key={item.id}
                className="rounded-xl border border-border bg-card"
              >
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : item.id)}
                  className="flex w-full flex-wrap items-center gap-3 p-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-mono text-[13px] font-semibold",
                      TEMP_CLASS[item.temperature],
                    )}
                  >
                    {item.score}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14.5px] font-semibold text-foreground">
                      {item.name}
                    </p>
                    <p className="truncate text-[12.5px] text-muted-foreground">
                      {item.contact} · {formatDate(item.created_at)}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn("text-[11.5px]", TEMP_CLASS[item.temperature])}
                  >
                    {TEMP_LABEL[item.temperature]}
                  </Badge>
                  <span className="text-[12.5px] text-muted-foreground">
                    {STATUS_LABEL[item.status]}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>

                {isOpen ? (
                  <div className="border-t border-border p-4">
                    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
                      <div>
                        <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          Задача
                        </p>
                        <p className="mt-1.5 whitespace-pre-line text-[14px] leading-relaxed text-foreground">
                          {item.message || "Описание не заполнено"}
                        </p>

                        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[13px]">
                          <div>
                            <dt className="text-muted-foreground">Бюджет</dt>
                            <dd className="font-medium text-foreground">
                              {formatMoney(item.budget)}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground">Срок</dt>
                            <dd className="font-medium text-foreground">
                              {item.deadline_days
                                ? `${item.deadline_days} дн.`
                                : "—"}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground">Роль</dt>
                            <dd className="font-medium text-foreground">
                              {item.role || "—"}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground">Компания</dt>
                            <dd className="font-medium text-foreground">
                              {item.company_size || "—"}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground">Источник</dt>
                            <dd className="font-medium text-foreground">
                              {item.source} · {item.page}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground">UTM</dt>
                            <dd className="truncate font-medium text-foreground">
                              {item.utm || "—"}
                            </dd>
                          </div>
                        </dl>
                      </div>

                      <div>
                        <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          Из чего сложился скор
                        </p>
                        <ul className="mt-2 space-y-1.5 text-[13px]">
                          {Object.entries(item.score_breakdown)
                            .filter(([, value]) => typeof value === "number")
                            .map(([key, value]) => (
                              <li
                                key={key}
                                className="flex items-center justify-between gap-3 rounded-md border border-border bg-background/50 px-2.5 py-1.5"
                              >
                                <span className="text-muted-foreground">
                                  {SCORE_LABEL[key] ?? key}
                                </span>
                                <span className="font-mono font-medium text-foreground">
                                  +{String(value)}
                                </span>
                              </li>
                            ))}
                        </ul>

                        <label
                          htmlFor={`status-${item.id}`}
                          className="mt-4 block text-[12px] text-muted-foreground"
                        >
                          Статус заявки
                        </label>
                        <select
                          id={`status-${item.id}`}
                          value={item.status}
                          onChange={(event) =>
                            void changeStatus(
                              item.id,
                              event.target.value as ApplicationStatus,
                            )
                          }
                          className="mt-1 h-9 w-full rounded-lg border border-border bg-card px-2 text-[13px]"
                        >
                          {Object.entries(STATUS_LABEL).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
