"use server";

import { headers } from "next/headers";

import { leadSchema, toFieldErrors } from "@/lib/lead/schema";
import { sendToTelegram } from "@/lib/lead/telegram";
import { LeadTransportError } from "@/lib/lead/types";
import type { LeadActionResult } from "@/types";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 3;

/**
 * Простой in-memory rate-limit. Для одного инстанса на VM этого достаточно;
 * при горизонтальном масштабировании заменяется на Redis/Upstash.
 */
const attempts = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const fresh = (attempts.get(key) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (fresh.length >= RATE_LIMIT_MAX) {
    attempts.set(key, fresh);
    return true;
  }

  fresh.push(now);
  attempts.set(key, fresh);

  // Защита от неограниченного роста Map
  if (attempts.size > 5_000) {
    for (const [storedKey, timestamps] of attempts) {
      if (timestamps.every((timestamp) => now - timestamp > RATE_LIMIT_WINDOW_MS)) {
        attempts.delete(storedKey);
      }
    }
  }

  return false;
}

async function resolveClientKey(): Promise<string> {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip")?.trim() ||
    "unknown";

  return ip;
}

export async function sendLead(input: unknown): Promise<LeadActionResult> {
  const raw = (input ?? {}) as Record<string, unknown>;

  // Honeypot: бот заполнил скрытое поле — имитируем успех, ничего не отправляя.
  if (typeof raw.company === "string" && raw.company.trim().length > 0) {
    return { ok: true, delivered: false };
  }

  const parsed = leadSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      formError: "Проверьте выделенные поля",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  const clientKey = await resolveClientKey();

  if (isRateLimited(clientKey)) {
    return {
      ok: false,
      formError:
        "Слишком много заявок подряд. Попробуйте через 10 минут или напишите в Telegram.",
    };
  }

  const lead = parsed.data;

  try {
    await sendToTelegram({
      name: lead.name,
      contact: lead.contact,
      message: lead.message,
      estimate: lead.estimate || undefined,
      utm: lead.utm || undefined,
      source: "site",
    });

    return { ok: true, delivered: true };
  } catch (error) {
    const code =
      error instanceof LeadTransportError ? error.code : "UNKNOWN_ERROR";

    console.error("[lead] delivery failed", code, error);

    // Локальная разработка без настроенного бота: заявка логируется,
    // пользователь видит успешный сценарий.
    if (
      code === "TELEGRAM_NOT_CONFIGURED" &&
      process.env.NODE_ENV !== "production"
    ) {
      console.info("[lead] development fallback, payload:", lead);
      return { ok: true, delivered: false };
    }

    return {
      ok: false,
      formError:
        "Не удалось отправить заявку. Напишите в Telegram — ответим быстрее.",
    };
  }
}
