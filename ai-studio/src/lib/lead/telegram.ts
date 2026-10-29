import { LeadTransportError, type LeadDelivery } from "@/lib/lead/types";

const TELEGRAM_API = "https://api.telegram.org";

function buildMessage(lead: LeadDelivery): string {
  const lines = [
    "Новая заявка с сайта AI.STUDIO",
    "",
    `Имя: ${lead.name}`,
    `Контакт: ${lead.contact}`,
    "",
    "Задача:",
    lead.message,
  ];

  if (lead.estimate) {
    lines.push("", "Конфигурация из калькулятора:", lead.estimate);
  }

  if (lead.utm) {
    lines.push("", `UTM: ${lead.utm}`);
  }

  lines.push("", `Источник: ${lead.source ?? "site"}`);

  return lines.join("\n");
}

export async function sendToTelegram(lead: LeadDelivery): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

  if (!token || !chatId) {
    throw new LeadTransportError(
      "Telegram transport is not configured",
      "TELEGRAM_NOT_CONFIGURED",
    );
  }

  let response: Response;

  try {
    response = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildMessage(lead),
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(8_000),
      cache: "no-store",
    });
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
