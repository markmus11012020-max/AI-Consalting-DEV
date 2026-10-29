import { z } from "zod";

import type { LeadField } from "@/types";

const TELEGRAM_RE = /^@[a-zA-Z][a-zA-Z0-9_]{4,31}$/;
const PHONE_RE = /^\+?[\d\s()-]{10,20}$/;

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Укажите имя — минимум 2 символа")
    .max(80, "Имя слишком длинное"),
  contact: z
    .string()
    .trim()
    .min(5, "Укажите Telegram или телефон для связи")
    .max(120, "Слишком длинное значение")
    .refine(
      (value) => TELEGRAM_RE.test(value) || PHONE_RE.test(value),
      "Укажите Telegram вида @username или телефон в формате +7 999 123-45-67",
    ),
  message: z
    .string()
    .trim()
    .min(10, "Опишите задачу — минимум 10 символов")
    .max(2000, "Не больше 2000 символов"),
  consent: z
    .boolean()
    .refine((value) => value === true, "Без согласия мы не можем обработать заявку"),
  estimate: z.string().max(1500).optional().default(""),
  utm: z.string().max(500).optional().default(""),
  company: z.string().max(0).optional().default(""),
});

export type LeadInput = z.infer<typeof leadSchema>;

const LEAD_FIELDS: readonly LeadField[] = [
  "name",
  "contact",
  "message",
  "consent",
];

export function toFieldErrors(
  error: z.ZodError,
): Partial<Record<LeadField, string>> {
  const errors: Partial<Record<LeadField, string>> = {};

  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key !== "string") continue;
    if (!LEAD_FIELDS.includes(key as LeadField)) continue;
    const field = key as LeadField;
    if (!errors[field]) errors[field] = issue.message;
  }

  return errors;
}

export function isTelegram(value: string): boolean {
  return TELEGRAM_RE.test(value.trim());
}

export function isPhone(value: string): boolean {
  return PHONE_RE.test(value.trim());
}
