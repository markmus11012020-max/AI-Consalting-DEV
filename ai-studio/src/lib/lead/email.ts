import nodemailer, { type Transporter } from "nodemailer";

import { LeadTransportError, type LeadDelivery } from "@/lib/lead/types";

export interface EmailTarget {
  name: string;
  to: string;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function getEmailTargets(): EmailTarget[] {
  const recipients = [
    process.env.LEAD_EMAIL_TO_1?.trim(),
    process.env.LEAD_EMAIL_TO_2?.trim(),
  ].filter((value): value is string => Boolean(value));

  return recipients.map((to, index) => ({
    name: `email-${index + 1}`,
    to,
  }));
}

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const port = Number(process.env.SMTP_PORT ?? 465);

  if (!host || !user || !pass) {
    throw new LeadTransportError(
      "SMTP transport is not configured",
      "EMAIL_NOT_CONFIGURED",
    );
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: process.env.SMTP_SECURE === "false" ? false : port === 465,
      auth: { user, pass },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });
  }

  return transporter;
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function buildHtml(lead: LeadDelivery, leadId: string): string {
  const rows = [
    ["Имя", lead.name],
    ["Контакт", lead.contact],
    ["Задача", lead.message],
    ["Калькулятор", lead.estimate || "—"],
    ["UTM", lead.utm || "—"],
    ["Источник", lead.source ?? "site"],
    ["ID заявки", leadId],
  ];

  return `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#0f172a">
      <div style="background:#4f46e5;color:#fff;padding:20px 24px;border-radius:12px 12px 0 0">
        <h1 style="margin:0;font-size:20px">Новая заявка с сайта Aillix</h1>
      </div>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-top:0">
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#64748b;width:150px;vertical-align:top">${escapeHtml(label)}</td>
                <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;white-space:pre-wrap">${escapeHtml(value)}</td>
              </tr>`,
          )
          .join("")}
      </table>
      <p style="color:#64748b;font-size:12px;margin-top:16px">
        Aillix · заявка доставлена автоматически. Ответьте клиенту в удобном канале.
      </p>
    </div>
  `;
}

function buildText(lead: LeadDelivery, leadId: string): string {
  return [
    "Новая заявка с сайта Aillix",
    "",
    `Имя: ${lead.name}`,
    `Контакт: ${lead.contact}`,
    "",
    "Задача:",
    lead.message,
    "",
    `Калькулятор: ${lead.estimate || "—"}`,
    `UTM: ${lead.utm || "—"}`,
    `Источник: ${lead.source ?? "site"}`,
    `ID заявки: ${leadId}`,
  ].join("\n");
}

export async function sendToEmail(
  target: EmailTarget,
  lead: LeadDelivery,
  leadId: string,
): Promise<void> {
  const transport = getTransporter();
  const from =
    process.env.LEAD_EMAIL_FROM?.trim() || "Aillix <robot@aillix.ru>";

  try {
    await transport.sendMail({
      from,
      to: target.to,
      replyTo: isEmail(lead.contact) ? lead.contact : undefined,
      subject: `[Aillix] Новая заявка · ${lead.name}`,
      text: buildText(lead, leadId),
      html: buildHtml(lead, leadId),
    });
  } catch (error) {
    throw new LeadTransportError(
      `SMTP send failed: ${String(error)}`,
      "EMAIL_SEND_FAILED",
    );
  }
}
