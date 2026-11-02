import { appendFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import type { LeadDelivery } from "@/lib/lead/types";

export interface DeliveryResult {
  channel: string;
  ok: boolean;
  code?: string;
}

export interface StoredLead {
  leadId: string;
  createdAt: string;
  lead: LeadDelivery;
  delivery: DeliveryResult[];
}

export async function storeLead(entry: StoredLead): Promise<void> {
  if (process.env.LEAD_STORE_DISABLED === "true") return;

  const path = resolve(
    process.cwd(),
    process.env.LEAD_STORE_PATH?.trim() || "data/leads.jsonl",
  );

  try {
    await mkdir(dirname(path), { recursive: true });
    await appendFile(path, `${JSON.stringify(entry)}\n`, "utf8");
  } catch (error) {
    // Заявка уже улетела в каналы; сбой локального лога не должен ломать форму.
    console.error("[lead] failed to persist lead", entry.leadId, error);
  }
}
