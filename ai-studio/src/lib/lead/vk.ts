import { LeadTransportError, type LeadDelivery } from "@/lib/lead/types";

const VK_API = "https://api.vk.com/method";

export interface VkTarget {
  name: string;
  token: string;
  userId: string;
}

function buildMessage(lead: LeadDelivery, leadId: string): string {
  const lines = [
    "Новая заявка с сайта Aillix",
    "",
    `Имя: ${lead.name}`,
    `Контакт: ${lead.contact}`,
    "",
    "Задача:",
    lead.message,
  ];

  if (lead.estimate) {
    lines.push("", "Калькулятор:", lead.estimate);
  }

  if (lead.utm) {
    lines.push("", `UTM: ${lead.utm}`);
  }

  lines.push(
    "",
    `Источник: ${lead.source ?? "site"}`,
    `ID: ${leadId}`,
  );

  return lines.join("\n");
}

export function getVkTarget(): VkTarget | null {
  const token = process.env.VK_GROUP_TOKEN?.trim();
  const userId = process.env.VK_USER_ID?.trim() || "1018631057";

  if (!token || !userId) return null;

  return { name: "vk", token, userId };
}

export async function sendToVk(
  target: VkTarget,
  lead: LeadDelivery,
  leadId: string,
): Promise<void> {
  const body = new URLSearchParams({
    user_id: target.userId,
    random_id: String(Math.floor(Math.random() * 2_000_000_000)),
    message: buildMessage(lead, leadId),
    access_token: target.token,
    v: process.env.VK_API_VERSION?.trim() || "5.199",
  });

  let response: Response;

  try {
    response = await fetch(`${VK_API}/messages.send`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
  } catch (error) {
    throw new LeadTransportError(
      `VK request failed: ${String(error)}`,
      "VK_NETWORK",
    );
  }

  const payload = (await response.json().catch(() => null)) as
    | { response?: number; error?: { error_code?: number; error_msg?: string } }
    | null;

  if (!response.ok || !payload || payload.error) {
    const code = payload?.error?.error_code;
    const message = payload?.error?.error_msg ?? `HTTP ${response.status}`;
    throw new LeadTransportError(
      `VK responded with ${code ?? response.status}: ${message}`,
      "VK_HTTP",
    );
  }
}
