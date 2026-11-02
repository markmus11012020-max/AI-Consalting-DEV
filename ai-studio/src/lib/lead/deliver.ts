import { randomUUID } from "node:crypto";

import { getEmailTargets, sendToEmail } from "@/lib/lead/email";
import { storeLead, type DeliveryResult } from "@/lib/lead/store";
import { getTelegramTargets, sendToTelegram } from "@/lib/lead/telegram";
import { LeadTransportError, type LeadDelivery } from "@/lib/lead/types";
import { getVkTarget, sendToVk } from "@/lib/lead/vk";

export interface DeliveryReport {
  leadId: string;
  delivered: number;
  failed: number;
  results: DeliveryResult[];
}

interface Job {
  channel: string;
  run: () => Promise<void>;
}

function buildJobs(lead: LeadDelivery, leadId: string): Job[] {
  const jobs: Job[] = [];

  for (const target of getTelegramTargets()) {
    jobs.push({
      channel: target.name,
      run: () => sendToTelegram(target, lead, leadId),
    });
  }

  for (const target of getEmailTargets()) {
    jobs.push({
      channel: target.name,
      run: () => sendToEmail(target, lead, leadId),
    });
  }

  const vk = getVkTarget();
  if (vk) {
    jobs.push({
      channel: vk.name,
      run: () => sendToVk(vk, lead, leadId),
    });
  }

  return jobs;
}

export async function deliverLead(lead: LeadDelivery): Promise<DeliveryReport> {
  const leadId = randomUUID();
  const jobs = buildJobs(lead, leadId);
  const settled = await Promise.allSettled(jobs.map((job) => job.run()));

  const results: DeliveryResult[] = settled.map((result, index) => {
    const channel = jobs[index]?.channel ?? `channel-${index + 1}`;

    if (result.status === "fulfilled") {
      return { channel, ok: true };
    }

    const code =
      result.reason instanceof LeadTransportError
        ? result.reason.code
        : "UNKNOWN_ERROR";

    console.error(`[lead] ${channel} failed`, code, result.reason);
    return { channel, ok: false, code };
  });

  const delivered = results.filter((result) => result.ok).length;

  await storeLead({
    leadId,
    createdAt: new Date().toISOString(),
    lead,
    delivery: results,
  });

  return {
    leadId,
    delivered,
    failed: results.length - delivered,
    results,
  };
}
