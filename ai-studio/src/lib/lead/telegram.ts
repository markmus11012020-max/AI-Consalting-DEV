import { LeadTransportError, type LeadDelivery } from "@/lib/lead/types";

const TELEGRAM_API = "https://api.telegram.org";

export interface TelegramTarget {
  name: string;
  token: string;
  chatId: string;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function buildMessage(lead: LeadDelivery, leadId: string): string {
  const lines = [
    "<b>Новая заявка с сайта Aillix</b>",
    "",
    `<b>Имя:</b> ${escapeHtml(lead.name)}`,
    `<b>Контакт:</b> ${escapeHtml(lead.contact)}`,
    "",
    "<b>Задача:</b>",
    escapeHtml(lead.message),
  ];

  if (lead.estimate) {
    lines.push("", "<b>Конфигурация из калькулятора:</b>", escapeHtml(lead.estimate));
  }

  if (lead.utm) {
    lines.push("", `<b>UTM:</b> ${escapeHtml(lead.utm)}`);
  }

  lines.push(
    "",
    `<b>Источник:</b> ${escapeHtml(lead.source ?? "site")}`,
    `<b>ID:</b> <code>${escapeHtml(leadId)}</code>`,
  );

  return lines.join("\n");
}

export function getTelegramTargets(): TelegramTarget[] {
  const token1 = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const token2 = process.env.TELEGRAM_BOT_TOKEN_2?.trim() || token1;
  const chat1 = process.env.TELEGRAM_CHAT_ID_1?.trim();
  const chat2 = process.env.TELEGRAM_CHAT_ID_2?.trim();

  const targets: TelegramTarget[] = [];

  if (token1 && chat1) {
    targets.push({ name: "telegram-1", token: token1, chatId: chat1 });
  }

  if (token2 && chat2) {
    targets.push({ name: "telegram-2", token: token2, chatId: chat2 });
  }

  return targets;
}

export async function sendToTelegram(
  target: TelegramTarget,
  lead: LeadDelivery,
  leadId: string,
): Promise<void> {
  let response: Response;

  const keyboard =
    lead.contact.startsWith("@") && lead.contact.length > 1
      ? {
          inline_keyboard: [
            [
              {
                text: "Ответить в Telegram",
                url: `https://t.me/${lead.contact.slice(1)}`,
              },
            ],
          ],
        }
      : undefined;

  try {
    response = await fetch(
      `${TELEGRAM_API}/bot${target.token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: target.chatId,
          text: buildMessage(lead, leadId),
          parse_mode: "HTML",
          disable_web_page_preview: true,
          ...(keyboard ? { reply_markup: keyboard } : {}),
        }),
        signal: AbortSignal.timeout(10_000),
        cache: "no-store",
      },
    );
  } catch (error) {
    throw new LeadTransportError(
      `Telegram request failed: ${String(error)}`,
      "TELEGRAM_NETWORK",
    );
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new LeadTransportError(
      `Telegram responded with ${response.status}: ${body.slice(0, 200)}`,
      "TELEGRAM_HTTP",
    );
  }
}
