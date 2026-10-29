"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Send, X } from "lucide-react";
import { toast } from "sonner";

import { sendLead } from "@/components/lead/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ESTIMATE_EVENT, ESTIMATE_SUMMARY_KEY } from "@/lib/estimate";
import { leadSchema, toFieldErrors } from "@/lib/lead/schema";
import { SITE } from "@/lib/site";
import type { LeadField } from "@/types";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

const EMPTY_VALUES = { name: "", contact: "", message: "" };

export function LeadForm() {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [utm, setUtm] = useState("");
  const [errors, setErrors] = useState<Partial<Record<LeadField, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [estimateSummary, setEstimateSummary] = useState<string | null>(null);
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
    (field: "name" | "contact" | "message") =>
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      const value = event.target.value;
      setValues((current) => ({ ...current, [field]: value }));
      setErrors((current) => {
        if (!current[field]) return current;
        const next = { ...current };
        delete next[field];
        return next;
      });
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    setFormError(null);

    const payload = {
      ...values,
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

    try {
      const result = await sendLead(parsed.data);

      if (result.ok) {
        setStatus("success");
        setValues(EMPTY_VALUES);
        setConsent(false);
        setEstimateSummary(null);
        window.sessionStorage.removeItem(ESTIMATE_SUMMARY_KEY);
        toast.success("Заявка отправлена");
        return;
      }

      setStatus("error");
      setErrors(result.fieldErrors ?? {});
      setFormError(result.formError ?? "Не удалось отправить заявку");
      toast.error(result.formError ?? "Не удалось отправить заявку");
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
        className="glow-card flex h-full flex-col items-start justify-center rounded-2xl border border-emerald-400/20 p-7 outline-none sm:p-8"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-500/10">
          <CheckCircle2 className="h-6 w-6 text-emerald-400" />
        </span>
        <h3 className="mt-5 text-xl font-semibold text-white">
          Заявка отправлена
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Ответим в течение рабочего дня. Если задача срочная — напишите в
          Telegram, так быстрее.
        </p>

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
      className="glow-card rounded-2xl border border-white/[0.08] p-5 shadow-card sm:p-7"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">Оставить заявку</h3>
        <span className="text-[12.5px] text-slate-500">Ответ в течение дня</span>
      </div>

      {estimateSummary ? (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-indigo-400/25 bg-indigo-500/[0.07] p-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-indigo-300">
              Конфигурация из калькулятора
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-slate-300">
              {estimateSummary}
            </p>
          </div>
          <button
            type="button"
            onClick={clearEstimate}
            aria-label="Убрать конфигурацию из заявки"
            className="rounded-md p-1 text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-300"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}

      <div className="mt-5 space-y-4">
        <div>
          <Label htmlFor="lead-name">
            Имя <span className="text-indigo-400">*</span>
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
              "mt-1.5 h-11 rounded-xl border-white/10 bg-white/[0.03] placeholder:text-slate-600 focus-visible:border-indigo-400/50 focus-visible:ring-indigo-500/30",
              errors.name && "border-red-400/60 focus-visible:ring-red-500/30",
            )}
          />
          {errors.name ? (
            <p id="lead-name-error" className="mt-1.5 text-[13px] text-red-400">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="lead-contact">
            Telegram или телефон <span className="text-indigo-400">*</span>
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
              "mt-1.5 h-11 rounded-xl border-white/10 bg-white/[0.03] placeholder:text-slate-600 focus-visible:border-indigo-400/50 focus-visible:ring-indigo-500/30",
              errors.contact && "border-red-400/60 focus-visible:ring-red-500/30",
            )}
          />
          {errors.contact ? (
            <p
              id="lead-contact-error"
              className="mt-1.5 text-[13px] text-red-400"
            >
              {errors.contact}
            </p>
          ) : (
            <p id="lead-contact-hint" className="mt-1.5 text-[12.5px] text-slate-600">
              Никаких звонков «просто так» — только по вашей задаче.
            </p>
          )}
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-3">
            <Label htmlFor="lead-message">
              Описание задачи <span className="text-indigo-400">*</span>
            </Label>
            <span className="text-[12px] text-slate-600">
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
              "mt-1.5 min-h-[110px] rounded-xl border-white/10 bg-white/[0.03] placeholder:text-slate-600 focus-visible:border-indigo-400/50 focus-visible:ring-indigo-500/30",
              errors.message && "border-red-400/60 focus-visible:ring-red-500/30",
            )}
          />
          {errors.message ? (
            <p
              id="lead-message-error"
              className="mt-1.5 text-[13px] text-red-400"
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
              className="cursor-pointer text-[13.5px] font-normal leading-relaxed text-slate-400"
            >
              Согласен на обработку персональных данных в соответствии с{" "}
              <Link
                href="/privacy"
                className="text-indigo-300 underline-offset-2 hover:underline"
              >
                политикой
              </Link>
              .
            </Label>
            {errors.consent ? (
              <p
                id="lead-consent-error"
                className="mt-1 text-[13px] text-red-400"
              >
                {errors.consent}
              </p>
            ) : null}
          </div>
        </div>

        {formError ? (
          <p
            role="alert"
            className="rounded-xl border border-red-400/25 bg-red-500/[0.07] px-3 py-2.5 text-[13.5px] text-red-300"
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

        <p className="text-center text-[12px] leading-relaxed text-slate-600">
          Отвечает команда компании. Данные не передаются третьим лицам и не
          используются для обучения моделей.
        </p>
      </div>
    </form>
  );
}
