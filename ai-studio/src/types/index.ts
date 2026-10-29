export type IconName =
  | "brain"
  | "server"
  | "shield"
  | "bot"
  | "database"
  | "file-text"
  | "workflow"
  | "layers"
  | "lock"
  | "cpu"
  | "chart"
  | "target"
  | "headset"
  | "receipt"
  | "users";

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface ContactChannel {
  id: "email" | "telegram" | "phone";
  label: string;
  value: string;
  href: string;
  hint: string;
  icon: IconName;
}

export interface ExpertiseGroup {
  id: string;
  title: string;
  icon: IconName;
  summary: string;
  points: string[];
  tags: string[];
}

export interface UseCase {
  id: string;
  title: string;
  icon: IconName;
  summary: string;
  points: string[];
  result: string;
}

export interface ProjectCase {
  id: string;
  title: string;
  category: string;
  summary: string;
  highlights: string[];
  stack: string[];
  flow: string[];
  icon: IconName;
  accent: "indigo" | "purple";
}

export interface ProcessStep {
  id: string;
  title: string;
  duration: string;
  description: string;
  deliverables: string[];
}

export interface TrustItem {
  id: string;
  title: string;
  description: string;
  icon: IconName;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export type EstimateCategory = "platform" | "ai" | "integration";

export interface PricingOption {
  id: string;
  category: EstimateCategory;
  label: string;
  description: string;
  price: number;
  weeks: number;
  badge?: string;
}

export interface EstimateSelection {
  platform: string;
  ai: string;
  integrations: string[];
}

export interface EstimateLine {
  id: string;
  label: string;
  price: number;
  weeks: number;
}

export interface Estimate {
  total: number;
  totalMin: number;
  totalMax: number;
  weeks: number;
  weekMin: number;
  weekMax: number;
  supportMonthly: number;
  discount: number;
  lines: EstimateLine[];
}

export type LeadField = "name" | "contact" | "message" | "consent";

export interface LeadPayload {
  name: string;
  contact: string;
  message: string;
  estimate?: string;
  utm?: string;
  source?: string;
}

export interface LeadActionResult {
  ok: boolean;
  formError?: string;
  fieldErrors?: Partial<Record<LeadField, string>>;
  delivered?: boolean;
}
