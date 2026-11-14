export interface AdminUser {
  id: number;
  email: string;
  is_active: boolean;
  created_at: string;
  last_login_at: string | null;
}

export interface AdminApplication {
  id: number;
  public_id: string;
  name: string;
  contact: string;
  contact_type: string;
  message: string;
  business_type: string;
  company_size: string;
  role: string;
  budget: number | null;
  deadline_days: number | null;
  task_volume: number;
  services: string[];
  source: string;
  page: string;
  utm: string;
  session_id: string;
  consent: boolean;
  score: number;
  temperature: "hot" | "warm" | "cold";
  score_breakdown: Record<string, number | Record<string, number>>;
  status: "new" | "in_progress" | "won" | "lost";
  admin_comment: string;
  created_at: string;
}

export interface AdminService {
  id: number;
  slug: string;
  title: string;
  summary: string;
  outcome: string;
  icon: string;
  accent: "indigo" | "teal" | "amber" | "rose";
  price_min: number;
  price_max: number;
  currency: string;
  duration_days_min: number;
  duration_days_max: number;
  highlights: string[];
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminStats {
  total: number;
  hot: number;
  warm: number;
  cold: number;
  by_status: Record<string, number>;
  avg_score: number;
}

export interface MetricsSummary {
  sessions: number;
  page_views: number;
  clicks: number;
  cursor_points: number;
  avg_session_seconds: number;
  returning_sessions: number;
}

export interface HeatmapCell {
  x: number;
  y: number;
  weight: number;
}

export interface Heatmap {
  total_points: number;
  grid: number;
  cells: HeatmapCell[];
}

export type ApplicationStatus = AdminApplication["status"];
