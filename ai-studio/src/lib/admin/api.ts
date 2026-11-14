import type {
  AdminApplication,
  AdminService,
  AdminStats,
  AdminUser,
  ApplicationStatus,
  Heatmap,
  MetricsSummary,
} from "@/types/admin";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  if (response.status === 204) return undefined as T;

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = (data as { detail?: unknown } | null)?.detail;
    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail) && detail[0]?.msg
          ? String(detail[0].msg)
          : "Ошибка запроса";
    throw new ApiError(message, response.status);
  }

  return data as T;
}

export const adminApi = {
  login: (email: string, password: string) =>
    request<{ access_token: string; admin: AdminUser }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () => request<void>("/api/auth/logout", { method: "POST" }),

  me: () => request<AdminUser>("/api/auth/me"),

  stats: () => request<AdminStats>("/api/admin/stats"),

  applications: (params: {
    temperature?: string;
    status?: string;
    q?: string;
  }) => {
    const search = new URLSearchParams();
    if (params.temperature) search.set("temperature", params.temperature);
    if (params.status) search.set("status", params.status);
    if (params.q) search.set("q", params.q);
    return request<{ total: number; items: AdminApplication[] }>(
      `/api/admin/applications?${search.toString()}`,
    );
  },

  updateApplication: (
    id: number,
    payload: { status?: ApplicationStatus; admin_comment?: string },
  ) =>
    request<AdminApplication>(`/api/admin/applications/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  services: () => request<AdminService[]>("/api/admin/services"),

  createService: (payload: Partial<AdminService>) =>
    request<AdminService>("/api/admin/services", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateService: (id: number, payload: Partial<AdminService>) =>
    request<AdminService>(`/api/admin/services/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  deleteService: (id: number) =>
    request<AdminService>(`/api/admin/services/${id}`, { method: "DELETE" }),

  metricsSummary: () => request<MetricsSummary>("/api/admin/metrics/summary"),

  heatmap: (grid = 20) =>
    request<Heatmap>(`/api/admin/metrics/heatmap?grid=${grid}`),
};
