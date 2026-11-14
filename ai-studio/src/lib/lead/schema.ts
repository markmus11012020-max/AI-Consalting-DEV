import { z } from "zod";

import type { LeadField } from "@/types";

const TELEGRAM_RE = /^@[a-zA-Z][a-zA-Z0-9_]{4,31}$/;
const PHONE_RE = /^\+?[\d\s()-]{10,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const BUDGET_OPTIONS = [
  { value: "0", label: "Пока не определён" },
  { value: "30000", label: "до 50 000 ₽" },
  { value: "80000", label: "50 000 – 150 000 ₽" },
  { value: "150000", label: "150 000 – 300 000 ₽" },
  { value: "300000", label: "от 300 000 ₽" },
] as const;

export const DEADLINE_OPTIONS = [
  { value: "7", label: "В течение недели" },
  { value: "14", label: "До двух недель" },
  { value: "30", label: "В течение месяца" },
  { value: "60", label: "1–2 месяца" },
  { value: "180", label: "Без жёсткого срока" },
] as const;

export const COMPANY_SIZE_OPTIONS = [
  { value: "", label: "Не указывать" },
  { value: "solo", label: "Только я" },
  { value: "small", label: "До 15 человек" },
  { value: "medium", label: "15–100 человек" },
  { value: "enterprise", label: "Более 100 человек" },
] as const;

export const ROLE_OPTIONS = [
  { value: "", label: "Не указывать" },
  { value: "owner", label: "Владелец / основатель" },
  { value: "ceo", label: "Директор / CEO" },
  { value: "head", label: "Руководитель направления" },
  { value: "manager", label: "Менеджер" },
  { value: "specialist", label: "Специалист" },
] as const;

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Укажите имя — минимум 2 символа")
    .max(80, "Имя слишком длинное"),
  contact: z
    .string()
    .trim()
    .min(5, "Укажите Telegram, e-mail или телефон для связи")
    .max(120, "Слишком длинное значение")
    .refine(
      (value) =>
        TELEGRAM_RE.test(value) || PHONE_RE.test(value) || EMAIL_RE.test(value),
      "Укажите Telegram вида @username, e-mail или телефон",
    ),
  message: z
    .string()
    .trim()
    .min(10, "Опишите задачу — минимум 10 символов")
    .max(2000, "Не больше 2000 символов"),
  consent: z
    .boolean()
    .refine((value) => value === true, "Без согласия мы не можем обработать заявку"),
  businessType: z.enum(["personal", "business"]).default("business"),
  companySize: z.enum(["", "solo", "small", "medium", "enterprise"]).default(""),
  role: z
    .enum(["", "owner", "ceo", "head", "manager", "specialist"])
    .default(""),
  budget: z.number().int().min(0).max(100_000_000).optional(),
  deadlineDays: z.number().int().min(1).max(3650).optional(),
  taskVolume: z.coerce.number().int().min(1).max(50).default(1),
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

export function detectContactType(
  value: string,
): "telegram" | "email" | "phone" {
  const contact = value.trim();
  if (TELEGRAM_RE.test(contact)) return "telegram";
  if (EMAIL_RE.test(contact)) return "email";
  return "phone";
}

export function isTelegram(value: string): boolean {
  return TELEGRAM_RE.test(value.trim());
}

export function isPhone(value: string): boolean {
  return PHONE_RE.test(value.trim());
}
