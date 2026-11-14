"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminApi } from "@/lib/admin/api";
import type { AdminService } from "@/types/admin";

type FormState = {
  slug: string;
  title: string;
  summary: string;
  outcome: string;
  icon: string;
  accent: AdminService["accent"];
  price_min: string;
  price_max: string;
  duration_days_min: string;
  duration_days_max: string;
  highlights: string;
  sort_order: string;
  is_active: boolean;
};

const EMPTY_FORM: FormState = {
  slug: "",
  title: "",
  summary: "",
  outcome: "",
  icon: "bot",
  accent: "indigo",
  price_min: "50000",
  price_max: "150000",
  duration_days_min: "7",
  duration_days_max: "21",
  highlights: "",
  sort_order: "100",
  is_active: true,
};

function toForm(service: AdminService): FormState {
  return {
    slug: service.slug,
    title: service.title,
    summary: service.summary,
    outcome: service.outcome,
    icon: service.icon,
    accent: service.accent,
    price_min: String(service.price_min),
    price_max: String(service.price_max),
    duration_days_min: String(service.duration_days_min),
    duration_days_max: String(service.duration_days_max),
    highlights: service.highlights.join(", "),
    sort_order: String(service.sort_order),
    is_active: service.is_active,
  };
}

export function ServicesPanel() {
  const [services, setServices] = useState<AdminService[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminService | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setServices(await adminApi.services());
    } catch {
      toast.error("Не удалось загрузить услуги");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  };

  const openEdit = (service: AdminService) => {
    setEditing(service);
    setForm(toForm(service));
    setOpen(true);
  };

  const update = (field: keyof FormState, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        slug: form.slug.trim(),
        title: form.title.trim(),
        summary: form.summary.trim(),
        outcome: form.outcome.trim(),
        icon: form.icon.trim() || "bot",
        accent: form.accent,
        price_min: Number(form.price_min),
        price_max: Number(form.price_max),
        duration_days_min: Number(form.duration_days_min),
        duration_days_max: Number(form.duration_days_max),
        highlights: form.highlights
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        sort_order: Number(form.sort_order) || 0,
        is_active: form.is_active,
      };

      if (editing) {
        await adminApi.updateService(editing.id, payload);
        toast.success("Услуга обновлена");
      } else {
        await adminApi.createService(payload);
        toast.success("Услуга создана");
      }
      setOpen(false);
      await load();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Не удалось сохранить услугу",
      );
    } finally {
      setSaving(false);
    }
  };

  const remove = async (service: AdminService) => {
    if (
      !window.confirm(
        `Скрыть услугу «${service.title}»? Она останется в истории заявок.`,
      )
    ) {
      return;
    }
    try {
      await adminApi.deleteService(service.id);
      toast.success("Услуга скрыта с сайта");
      await load();
    } catch {
      toast.error("Не удалось скрыть услугу");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13.5px] text-muted-foreground">
          {services.length} услуг · мягкое удаление сохраняет историю заявок
        </p>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-3.5 w-3.5" />
          Добавить
        </Button>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-muted-foreground">Загружаем услуги…</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead className="bg-muted/50 text-[12px] uppercase tracking-[0.1em] text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 font-medium">Услуга</th>
                <th className="px-4 py-2.5 font-medium">Цена</th>
                <th className="px-4 py-2.5 font-medium">Срок</th>
                <th className="px-4 py-2.5 font-medium">Статус</th>
                <th className="px-4 py-2.5 text-right font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr
                  key={service.id}
                  className="border-t border-border text-[13.5px]"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">
                      {service.title}
                    </p>
                    <p className="font-mono text-[11.5px] text-muted-foreground">
                      {service.slug}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Intl.NumberFormat("ru-RU").format(service.price_min)} —{" "}
                    {new Intl.NumberFormat("ru-RU").format(service.price_max)} ₽
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {service.duration_days_min}–{service.duration_days_max} дн.
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={service.is_active ? "success" : "outline"}
                      className="text-[11.5px]"
                    >
                      {service.is_active ? "Активна" : "Скрыта"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(service)}
                        aria-label={`Редактировать ${service.title}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => void remove(service)}
                        aria-label={`Скрыть ${service.title}`}
                        disabled={!service.is_active}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Редактирование услуги" : "Новая услуга"}
            </DialogTitle>
            <DialogDescription>
              Данные сразу попадают в PostgreSQL и на сайт (кэш обновляется
              каждые 5 минут).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={save} className="mt-5 grid gap-3.5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="svc-title">Название</Label>
              <Input
                id="svc-title"
                required
                value={form.title}
                onChange={(event) => update("title", event.target.value)}
                className="mt-1.5 h-10 rounded-lg"
              />
            </div>

            <div>
              <Label htmlFor="svc-slug">Slug</Label>
              <Input
                id="svc-slug"
                required
                pattern="[a-z0-9-]+"
                value={form.slug}
                onChange={(event) => update("slug", event.target.value)}
                className="mt-1.5 h-10 rounded-lg font-mono"
              />
            </div>

            <div>
              <Label htmlFor="svc-icon">Иконка</Label>
              <Input
                id="svc-icon"
                value={form.icon}
                onChange={(event) => update("icon", event.target.value)}
                className="mt-1.5 h-10 rounded-lg font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="svc-summary">Описание</Label>
              <Textarea
                id="svc-summary"
                required
                value={form.summary}
                onChange={(event) => update("summary", event.target.value)}
                className="mt-1.5 min-h-[70px] rounded-lg"
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="svc-outcome">Результат</Label>
              <Input
                id="svc-outcome"
                value={form.outcome}
                onChange={(event) => update("outcome", event.target.value)}
                className="mt-1.5 h-10 rounded-lg"
              />
            </div>

            <div>
              <Label htmlFor="svc-price-min">Цена от, ₽</Label>
              <Input
                id="svc-price-min"
                type="number"
                min={0}
                required
                value={form.price_min}
                onChange={(event) => update("price_min", event.target.value)}
                className="mt-1.5 h-10 rounded-lg"
              />
            </div>

            <div>
              <Label htmlFor="svc-price-max">Цена до, ₽</Label>
              <Input
                id="svc-price-max"
                type="number"
                min={0}
                required
                value={form.price_max}
                onChange={(event) => update("price_max", event.target.value)}
                className="mt-1.5 h-10 rounded-lg"
              />
            </div>

            <div>
              <Label htmlFor="svc-days-min">Срок от, дней</Label>
              <Input
                id="svc-days-min"
                type="number"
                min={1}
                value={form.duration_days_min}
                onChange={(event) =>
                  update("duration_days_min", event.target.value)
                }
                className="mt-1.5 h-10 rounded-lg"
              />
            </div>

            <div>
              <Label htmlFor="svc-days-max">Срок до, дней</Label>
              <Input
                id="svc-days-max"
                type="number"
                min={1}
                value={form.duration_days_max}
                onChange={(event) =>
                  update("duration_days_max", event.target.value)
                }
                className="mt-1.5 h-10 rounded-lg"
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="svc-highlights">
                Пункты списка (через запятую)
              </Label>
              <Input
                id="svc-highlights"
                value={form.highlights}
                onChange={(event) => update("highlights", event.target.value)}
                className="mt-1.5 h-10 rounded-lg"
              />
            </div>

            <div>
              <Label htmlFor="svc-accent">Акцент</Label>
              <select
                id="svc-accent"
                value={form.accent}
                onChange={(event) =>
                  update("accent", event.target.value as FormState["accent"])
                }
                className="mt-1.5 h-10 w-full rounded-lg border border-border bg-card px-2 text-[13.5px]"
              >
                <option value="indigo">indigo</option>
                <option value="teal">teal</option>
                <option value="amber">amber</option>
                <option value="rose">rose</option>
              </select>
            </div>

            <div>
              <Label htmlFor="svc-order">Сортировка</Label>
              <Input
                id="svc-order"
                type="number"
                value={form.sort_order}
                onChange={(event) => update("sort_order", event.target.value)}
                className="mt-1.5 h-10 rounded-lg"
              />
            </div>

            <label className="flex items-center gap-2 text-[13.5px] text-muted-foreground sm:col-span-2">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(event) => update("is_active", event.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              Показывать на сайте
            </label>

            <DialogFooter className="sm:col-span-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Сохраняем…" : "Сохранить"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
