"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Send, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ESTIMATE_EVENT, ESTIMATE_SUMMARY_KEY } from "@/lib/estimate";
import {
  BUDGET_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  DEADLINE_OPTIONS,
  ROLE_OPTIONS,
  detectContactType,
  leadSchema,
  toFieldErrors,
} from "@/lib/lead/schema";
import { getSessionId, trackEvent } from "@/lib/metrics/client";
import { SITE } from "@/lib/site";
import type { LeadField } from "@/types";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

const EMPTY_VALUES = {
  name: "",
  contact: "",
  message: "",
  businessType: "business" as "personal" | "business",
  companySize: "" as "" | "solo" | "small" | "medium" | "enterprise",
  role: "" as "" | "owner" | "ceo" | "head" | "manager" | "specialist",
  budget: "",
  deadlineDays: "",
  taskVolume: "1",
};

const SELECT_CLASS =
  "mt-1.5 h-11 w-full rounded-xl border border-border bg-card px-3 text-[14.5px] text-foreground focus-visible:border-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30";

export function LeadForm() {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [utm, setUtm] = useState("");
  const [errors, setErrors] = useState<Partial<Record<LeadField, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [estimateSummary, setEstimateSummary] = useState<string | null>(null);
  const [priority, setPriority] = useState<"hot" | "warm" | "cold" | null>(null);
  const successRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utmParts = ["source", "medium", "campaign", "term", "content"]
      .map((key) => {
        const value = params.get(`utm_${key}`);
        return value ? `${key}=${value}` : null;
      })
      .filter((part): part is string => Boolean(part));

    if (utmParts.length > 0) setUtm(utmParts.join("&"));
    if (params.toString()) {
      window.sessionStorage.setItem("ai-studio:utm", utmParts.join("&"));
    } else {
      const storedUtm = window.sessionStorage.getItem("ai-studio:utm");
      if (storedUtm) setUtm(storedUtm);
    }

    const storedSummary = window.sessionStorage.getItem(ESTIMATE_SUMMARY_KEY);
    if (storedSummary) setEstimateSummary(storedSummary);

    const onEstimate = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (typeof detail === "string" && detail.length > 0) {
        setEstimateSummary(detail);
      }
    };

    window.addEventListener(ESTIMATE_EVENT, onEstimate);
    return () => window.removeEventListener(ESTIMATE_EVENT, onEstimate);
  }, []);

  useEffect(() => {
    if (status === "success") {
      successRef.current?.focus();
    }
  }, [status]);

  const updateField =
    (field: keyof typeof EMPTY_VALUES) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const value = event.target.value;
      setValues((current) => ({ ...current, [field]: value }));
      setErrors((current) => {
        if (!current[field as LeadField]) return current;
        const next = { ...current };
        delete next[field as LeadField];
        return next;
      });
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    setFormError(null);

    const payload = {
      ...values,
      budget: values.budget === "" ? undefined : Number(values.budget),
      deadlineDays:
        values.deadlineDays === "" ? undefined : Number(values.deadlineDays),
      taskVolume: Number(values.taskVolume) || 1,
      consent,
      estimate: estimateSummary ?? "",
      utm,
      company: honeypot,
    };

    const parsed = leadSchema.safeParse(payload);

    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error));
      setStatus("error");
      toast.error("Проверьте поля формы");
      return;
    }

    setErrors({});
    setStatus("submitting");

    const data = parsed.data;
    const messageParts = [data.message];
    if (data.estimate) messageParts.push(`Конфигурация: ${data.estimate}`);

    const apiPayload = {
      name: data.name,
      contact: data.contact,
      contact_type: detectContactType(data.contact),
      message: messageParts.join("\n\n").slice(0, 4000),
      business_type: data.businessType,
      company_size: data.companySize,
      role: data.role,
      budget: data.budget && data.budget > 0 ? data.budget : undefined,
      deadline_days: data.deadlineDays,
      task_volume: data.taskVolume,
      services: data.estimate ? ["calculator"] : [],
      source: "site",
      page: typeof window === "undefined" ? "/" : window.location.pathname,
      utm: data.utm,
      session_id: getSessionId(),
      consent: data.consent,
    };

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiPayload),
      });

      if (response.status === 201) {
        const result = (await response.json()) as {
          public_id: string;
          score: number;
          temperature: "hot" | "warm" | "cold";
        };
        trackEvent("submit", { meta: { public_id: result.public_id } });
        setPriority(result.temperature);
        setStatus("success");
        setValues(EMPTY_VALUES);
        setConsent(false);
        setEstimateSummary(null);
        window.sessionStorage.removeItem(ESTIMATE_SUMMARY_KEY);
        toast.success("Заявка отправлена");
        return;
      }

      const problem = (await response.json().catch(() => null)) as
        | { detail?: string | Array<{ msg?: string }> }
        | null;
      const detail =
        typeof problem?.detail === "string"
          ? problem.detail
          : problem?.detail?.[0]?.msg ??
            "Не удалось отправить заявку. Попробуйте позже.";

      setStatus("error");
      setFormError(detail);
      toast.error(detail);
    } catch (error) {
      console.error("[lead] submit failed", error);
      setStatus("error");
      setFormError("Сеть недоступна. Проверьте соединение или напишите в Telegram.");
      toast.error("Не удалось отправить заявку");
    }
  };

  const clearEstimate = () => {
    setEstimateSummary(null);
    window.sessionStorage.removeItem(ESTIMATE_SUMMARY_KEY);
  };

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="glow-card flex h-full flex-col items-start justify-center rounded-2xl border border-success/25 p-7 outline-none sm:p-8"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-success/25 bg-success/10">
          <CheckCircle2 className="h-6 w-6 text-success" />
        </span>
        <h3 className="mt-5 text-xl font-semibold text-foreground">
          Заявка отправлена
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Ответим в течение рабочего дня. Если задача срочная — напишите в
          Telegram, так быстрее.
        </p>

        {priority ? (
          <p className="mt-4 rounded-xl border border-border bg-card/60 px-3 py-2 text-[13px] text-muted-foreground">
            Приоритет обращения:{" "}
            <span className="font-semibold text-foreground">
              {priority === "hot"
                ? "высокий — свяжемся в течение часа"
                : priority === "warm"
                  ? "обычный — ответим в течение рабочего дня"
                  : "стандартный — ответим в порядке очереди"}
            </span>
          </p>
        ) : null}

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <Button asChild variant="secondary">
            <a
              href={SITE.contacts.telegramUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              <Send className="h-4 w-4" />
              {SITE.contacts.telegram}
            </a>
          </Button>
          <Button asChild variant="ghost">
            <a
              href={SITE.contacts.telegramSalesUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              <Send className="h-4 w-4" />
              {SITE.contacts.telegramSales}
            </a>
          </Button>
          <Button variant="ghost" onClick={() => setStatus("idle")}>
            Отправить ещё одну
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="glow-card rounded-2xl border border-border p-5 shadow-card sm:p-7"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-foreground">Оставить заявку</h3>
        <span className="text-[12.5px] text-muted-foreground">Ответ в течение дня</span>
      </div>

      {estimateSummary ? (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-primary/25 bg-primary/10 p-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-primary">
              Конфигурация из калькулятора
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground">
              {estimateSummary}
            </p>
          </div>
          <button
            type="button"
            onClick={clearEstimate}
            aria-label="Убрать конфигурацию из заявки"
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}

      <div className="mt-5 space-y-4">
        <div>
          <Label htmlFor="lead-name">
            Имя <span className="text-primary">*</span>
          </Label>
          <Input
            id="lead-name"
            name="name"
            autoComplete="name"
            placeholder="Как к вам обращаться"
            value={values.name}
            onChange={updateField("name")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "lead-name-error" : undefined}
            className={cn(
              "mt-1.5 h-11 rounded-xl border-border bg-card placeholder:text-muted-foreground focus-visible:border-primary/25 focus-visible:ring-primary/30",
              errors.name && "border-destructive/60 focus-visible:ring-destructive/30",
            )}
          />
          {errors.name ? (
            <p id="lead-name-error" className="mt-1.5 text-[13px] text-destructive">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="lead-contact">
            Telegram или телефон <span className="text-primary">*</span>
          </Label>
          <Input
            id="lead-contact"
            name="contact"
            autoComplete="tel"
            placeholder="@username или +7 999 123-45-67"
            value={values.contact}
            onChange={updateField("contact")}
            aria-invalid={Boolean(errors.contact)}
            aria-describedby={
              errors.contact ? "lead-contact-error" : "lead-contact-hint"
            }
            className={cn(
              "mt-1.5 h-11 rounded-xl border-border bg-card placeholder:text-muted-foreground focus-visible:border-primary/25 focus-visible:ring-primary/30",
              errors.contact && "border-destructive/60 focus-visible:ring-destructive/30",
            )}
          />
          {errors.contact ? (
            <p
              id="lead-contact-error"
              className="mt-1.5 text-[13px] text-destructive"
            >
              {errors.contact}
            </p>
          ) : (
            <p id="lead-contact-hint" className="mt-1.5 text-[12.5px] text-muted-foreground">
              Никаких звонков «просто так» — только по вашей задаче.
            </p>
          )}
        </div>

        <fieldset className="rounded-xl border border-border bg-muted/30 p-3.5">
          <legend className="px-1 text-[12.5px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            О задаче
          </legend>

          <div className="mt-1 grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="lead-business">Для кого задача</Label>
              <select
                id="lead-business"
                name="businessType"
                value={values.businessType}
                onChange={updateField("businessType")}
                className={SELECT_CLASS}
              >
                <option value="business">Для бизнеса</option>
                <option value="personal">Личная задача</option>
              </select>
            </div>

            <div>
              <Label htmlFor="lead-company-size">Размер команды</Label>
              <select
                id="lead-company-size"
                name="companySize"
                value={values.companySize}
                onChange={updateField("companySize")}
                className={SELECT_CLASS}
              >
                {COMPANY_SIZE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="lead-role">Ваша роль</Label>
              <select
                id="lead-role"
                name="role"
                value={values.role}
                onChange={updateField("role")}
                className={SELECT_CLASS}
              >
                {ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="lead-budget">Бюджет</Label>
              <select
                id="lead-budget"
                name="budget"
                value={values.budget}
                onChange={updateField("budget")}
                className={SELECT_CLASS}
              >
                {BUDGET_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="lead-deadline">Когда нужно</Label>
              <select
                id="lead-deadline"
                name="deadlineDays"
                value={values.deadlineDays}
                onChange={updateField("deadlineDays")}
                className={SELECT_CLASS}
              >
                <option value="">Не выбрано</option>
                {DEADLINE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="lead-tasks">Сколько задач закрыть</Label>
              <select
                id="lead-tasks"
                name="taskVolume"
                value={values.taskVolume}
                onChange={updateField("taskVolume")}
                className={SELECT_CLASS}
              >
                {[1, 2, 3, 4, 5].map((count) => (
                  <option key={count} value={String(count)}>
                    {count === 5 ? "5 и более" : String(count)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <div>
          <div className="flex items-baseline justify-between gap-3">
            <Label htmlFor="lead-message">
              Описание задачи <span className="text-primary">*</span>
            </Label>
            <span className="text-[12px] text-muted-foreground">
              {values.message.length}/2000
            </span>
          </div>
          <Textarea
            id="lead-message"
            name="message"
            placeholder="Что за процесс, какие данные и системы уже есть, какой результат нужен"
            value={values.message}
            onChange={updateField("message")}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "lead-message-error" : undefined}
            className={cn(
              "mt-1.5 min-h-[110px] rounded-xl border-border bg-card placeholder:text-muted-foreground focus-visible:border-primary/25 focus-visible:ring-primary/30",
              errors.message && "border-destructive/60 focus-visible:ring-destructive/30",
            )}
          />
          {errors.message ? (
            <p
              id="lead-message-error"
              className="mt-1.5 text-[13px] text-destructive"
            >
              {errors.message}
            </p>
          ) : null}
        </div>

        {/* Honeypot для ботов */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="lead-company">Компания</label>
          <input
            id="lead-company"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
          />
        </div>

        <div className="flex items-start gap-2.5">
          <Checkbox
            id="lead-consent"
            checked={consent}
            onCheckedChange={(checked) => {
              setConsent(checked === true);
              setErrors((current) => {
                if (!current.consent) return current;
                const next = { ...current };
                delete next.consent;
                return next;
              });
            }}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? "lead-consent-error" : undefined}
            className="mt-0.5"
          />
          <div>
            <Label
              htmlFor="lead-consent"
              className="cursor-pointer text-[13.5px] font-normal leading-relaxed text-muted-foreground"
            >
              Согласен на обработку персональных данных в соответствии с{" "}
              <Link
                href="/privacy"
                className="text-primary underline-offset-2 hover:underline"
              >
                политикой
              </Link>
              .
            </Label>
            {errors.consent ? (
              <p
                id="lead-consent-error"
                className="mt-1 text-[13px] text-destructive"
              >
                {errors.consent}
              </p>
            ) : null}
          </div>
        </div>

        {formError ? (
          <p
            role="alert"
            className="rounded-xl border border-destructive/25 bg-destructive/10 px-3 py-2.5 text-[13.5px] text-destructive"
          >
            {formError}
          </p>
        ) : null}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Отправляем…
            </>
          ) : (
            <>
              Отправить заявку
              <Send className="h-4 w-4" />
            </>
          )}
        </Button>

        <p className="text-center text-[12px] leading-relaxed text-muted-foreground">
          Отвечает команда компании. Данные не передаются третьим лицам и не
          используются для обучения моделей.
        </p>
      </div>
    </form>
  );
}
