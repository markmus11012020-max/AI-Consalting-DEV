/**
 * Клиентский сбор поведенческих метрик.
 *
 * Данные не покидают сервер: события батчами уходят на свой `/api/metrics`
 * и складываются в PostgreSQL. Координаты курсора нормализованы в 0..1,
 * поэтому heatmap не зависит от разрешения экрана.
 */

export type MetricEventType =
  | "page_view"
  | "click"
  | "cursor"
  | "scroll"
  | "form_start"
  | "submit"
  | "return";

interface MetricEvent {
  session_id: string;
  event_type: MetricEventType;
  path: string;
  element?: string;
  x?: number;
  y?: number;
  viewport_w?: number;
  viewport_h?: number;
  duration_ms?: number;
  meta?: Record<string, unknown>;
}

const SESSION_KEY = "aillix:session";
const VISIT_KEY = "aillix:first-visit";
const FLUSH_INTERVAL = 8000;
const CURSOR_THROTTLE = 400;

let sessionId = "";
let queue: MetricEvent[] = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;
let started = false;
let lastCursorAt = 0;
let scrollSent = false;

function randomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 32);
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

export function getSessionId(): string {
  if (sessionId) return sessionId;
  if (typeof window === "undefined") return "";
  try {
    const stored = window.sessionStorage.getItem(SESSION_KEY);
    if (stored) {
      sessionId = stored;
      return sessionId;
    }
    sessionId = randomId();
    window.sessionStorage.setItem(SESSION_KEY, sessionId);
  } catch {
    sessionId = randomId();
  }
  return sessionId;
}

function push(event: Omit<MetricEvent, "session_id" | "path">): void {
  if (typeof window === "undefined") return;
  queue.push({
    ...event,
    session_id: getSessionId(),
    path: window.location.pathname,
  });
  if (queue.length >= 25) flush();
}

export function trackEvent(
  event_type: MetricEventType,
  payload: Partial<Omit<MetricEvent, "session_id" | "event_type" | "path">> = {},
): void {
  push({ event_type, ...payload });
}

export function flush(useBeacon = false): void {
  if (typeof window === "undefined" || queue.length === 0) return;
  const batch = queue;
  queue = [];

  const body = JSON.stringify({ events: batch });

  if (useBeacon && "sendBeacon" in navigator) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/metrics", blob);
    return;
  }

  void fetch("/api/metrics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // Метрики не должны ломать UX: тихо игнорируем сбой сети.
  });
}

function describeElement(target: Element | null): string {
  if (!target) return "";
  const element = target.closest("[data-track], a, button") ?? target;
  const tracked = element.getAttribute("data-track");
  if (tracked) return tracked;
  const tag = element.tagName.toLowerCase();
  const id = element.id ? `#${element.id}` : "";
  const label = element.textContent?.trim().slice(0, 40) ?? "";
  return `${tag}${id}${label ? `:${label}` : ""}`.slice(0, 120);
}

export function initMetrics(): () => void {
  if (typeof window === "undefined" || started) return () => {};
  started = true;

  // Возврат на сайт: фиксируем один раз за сессию.
  try {
    const firstVisit = window.localStorage.getItem(VISIT_KEY);
    const now = Date.now();
    if (firstVisit && now - Number(firstVisit) > 30 * 60 * 1000) {
      trackEvent("return");
    }
    window.localStorage.setItem(VISIT_KEY, String(now));
  } catch {
    // localStorage может быть недоступен — не критично.
  }

  trackEvent("page_view", {
    viewport_w: window.innerWidth,
    viewport_h: window.innerHeight,
  });

  const onClick = (event: MouseEvent) => {
    trackEvent("click", {
      element: describeElement(event.target as Element | null),
      x: event.clientX / Math.max(1, window.innerWidth),
      y: event.clientY / Math.max(1, window.innerHeight),
      viewport_w: window.innerWidth,
      viewport_h: window.innerHeight,
    });
  };

  const onPointerMove = (event: PointerEvent) => {
    const now = Date.now();
    if (now - lastCursorAt < CURSOR_THROTTLE) return;
    lastCursorAt = now;
    trackEvent("cursor", {
      x: event.clientX / Math.max(1, window.innerWidth),
      y: event.clientY / Math.max(1, window.innerHeight),
      viewport_w: window.innerWidth,
      viewport_h: window.innerHeight,
    });
  };

  const onScroll = () => {
    if (scrollSent) return;
    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    if (window.scrollY / scrollable >= 0.5) {
      scrollSent = true;
      trackEvent("scroll", { meta: { depth: 0.5 } });
    }
  };

  const onFormStart = () => {
    trackEvent("form_start");
    window.removeEventListener("focusin", onFormStart);
  };

  const onHidden = () => {
    if (document.visibilityState === "hidden") flush(true);
  };

  window.addEventListener("click", onClick, { passive: true });
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("focusin", onFormStart, { once: true });
  window.addEventListener("pagehide", () => flush(true));
  document.addEventListener("visibilitychange", onHidden);

  flushTimer = setInterval(() => flush(), FLUSH_INTERVAL);

  return () => {
    window.removeEventListener("click", onClick);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("focusin", onFormStart);
    document.removeEventListener("visibilitychange", onHidden);
    if (flushTimer) clearInterval(flushTimer);
    flush(true);
  };
}
