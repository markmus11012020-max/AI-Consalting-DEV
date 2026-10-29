import type { LeadPayload } from "@/types";

export interface LeadDelivery extends LeadPayload {
  source?: string;
}

export interface LeadTransport {
  name: string;
  send(lead: LeadDelivery): Promise<void>;
}

export class LeadTransportError extends Error {
  constructor(
    message: string,
    readonly code: string,
  ) {
    super(message);
    this.name = "LeadTransportError";
  }
}
