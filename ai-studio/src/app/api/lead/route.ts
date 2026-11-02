import { NextResponse } from "next/server";

import { deliverLead } from "@/lib/lead/deliver";
import { leadSchema, toFieldErrors } from "@/lib/lead/schema";

export const dynamic = "force-dynamic";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 3;
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

  if (attempts.size > 5_000) {
    for (const [storedKey, timestamps] of attempts) {
      if (timestamps.every((timestamp) => now - timestamp > RATE_LIMIT_WINDOW_MS)) {
        attempts.delete(storedKey);
      }
    }
  }

  return false;
}

export async function POST(request: Request) {
  const raw = (await request.json().catch(() => null)) as
    | Record<string, unknown>
    | null;

  if (!raw) {
    return NextResponse.json(
      { ok: false, formError: "Некорректный запрос" },
      { status: 400 },
    );
  }

  // Honeypot: бот заполнил скрытое поле — имитируем успех.
  if (typeof raw.company === "string" && raw.company.trim().length > 0) {
    return NextResponse.json({ ok: true, delivered: false });
  }

  const parsed = leadSchema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        formError: "Проверьте выделенные поля",
        fieldErrors: toFieldErrors(parsed.error),
      },
      { status: 422 },
    );
  }

  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        ok: false,
        formError:
          "Слишком много заявок подряд. Попробуйте через 10 минут или напишите в Telegram.",
      },
      { status: 429 },
    );
  }

  const lead = parsed.data;

  try {
    const report = await deliverLead({
      name: lead.name,
      contact: lead.contact,
      message: lead.message,
      estimate: lead.estimate || undefined,
      utm: lead.utm || undefined,
      source: "site",
    });

    if (report.delivered > 0) {
      return NextResponse.json({
        ok: true,
        delivered: true,
        leadId: report.leadId,
      });
    }

    console.error("[lead] no channel delivered", report.results);

    if (process.env.NODE_ENV !== "production") {
      console.info("[lead] development fallback, payload:", lead);
      return NextResponse.json({
        ok: true,
        delivered: false,
        leadId: report.leadId,
      });
    }

    return NextResponse.json(
      {
        ok: false,
        leadId: report.leadId,
        formError:
          "Не удалось отправить заявку ни в один канал. Напишите в Telegram — ответим быстрее.",
      },
      { status: 503 },
    );
  } catch (error) {
    console.error("[lead] delivery failed", error);
    return NextResponse.json(
      {
        ok: false,
        formError:
          "Не удалось отправить заявку. Напишите в Telegram — ответим быстрее.",
      },
      { status: 500 },
    );
  }
}
