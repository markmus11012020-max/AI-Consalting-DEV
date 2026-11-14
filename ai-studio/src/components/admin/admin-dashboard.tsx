"use client";

import { useCallback, useEffect, useState } from "react";
import { LogOut, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { ApplicationsPanel } from "@/components/admin/applications-panel";
import { MetricsPanel } from "@/components/admin/metrics-panel";
import { ServicesPanel } from "@/components/admin/services-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError, adminApi } from "@/lib/admin/api";
import type { AdminUser } from "@/types/admin";
import { cn } from "@/lib/utils";

type Tab = "applications" | "services" | "metrics";

const TABS: { id: Tab; label: string }[] = [
  { id: "applications", label: "Заявки" },
  { id: "services", label: "Услуги" },
  { id: "metrics", label: "Метрики" },
];

export function AdminDashboard() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<Tab>("applications");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    adminApi
      .me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setChecking(false));
  }, []);

  const logout = async () => {
    try {
      await adminApi.logout();
    } finally {
      setUser(null);
      toast.success("Вы вышли из панели");
    }
  };

  if (checking) {
    return (
      <div className="py-20 text-center text-sm text-muted-foreground">
        Проверяем сессию…
      </div>
    );
  }

  if (!user) {
    return <LoginForm onSuccess={setUser} />;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <p className="font-mono text-[11.5px] uppercase tracking-[0.18em] text-muted-foreground">
            admin panel
          </p>
          <p className="mt-1 text-[15px] font-semibold text-foreground">
            {user.email}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setRefreshKey((value) => value + 1)}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Обновить
          </Button>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="h-3.5 w-3.5" />
            Выйти
          </Button>
        </div>
      </div>

      <div className="mt-5 flex gap-1 rounded-full border border-border bg-card p-1">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              "flex-1 rounded-full px-4 py-2 text-[13.5px] font-medium transition-colors",
              tab === item.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={tab === item.id}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "applications" ? <ApplicationsPanel key={refreshKey} /> : null}
        {tab === "services" ? <ServicesPanel key={refreshKey} /> : null}
        {tab === "metrics" ? <MetricsPanel key={refreshKey} /> : null}
      </div>
    </div>
  );
}

function LoginForm({ onSuccess }: { onSuccess: (user: AdminUser) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const submit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setPending(true);
      setError(null);
      try {
        const result = await adminApi.login(email.trim(), password);
        onSuccess(result.admin);
        toast.success("Добро пожаловать");
      } catch (caught) {
        const message =
          caught instanceof ApiError
            ? caught.message
            : "Не удалось войти. Повторите попытку.";
        setError(message);
      } finally {
        setPending(false);
      }
    },
    [email, password, onSuccess],
  );

  return (
    <form
      onSubmit={submit}
      className="glow-card mx-auto mt-10 max-w-md rounded-2xl border border-border p-6 shadow-card sm:p-8"
    >
      <h2 className="font-display text-2xl font-bold text-foreground">Вход</h2>
      <p className="mt-1.5 text-[14px] text-muted-foreground">
        Доступ только для администраторов. Сессия хранится в HttpOnly-cookie.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <Label htmlFor="admin-email">E-mail</Label>
          <Input
            id="admin-email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1.5 h-11 rounded-xl"
          />
        </div>
        <div>
          <Label htmlFor="admin-password">Пароль</Label>
          <Input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1.5 h-11 rounded-xl"
          />
        </div>

        {error ? (
          <p
            role="alert"
            className="rounded-xl border border-destructive/25 bg-destructive/10 px-3 py-2.5 text-[13.5px] text-destructive"
          >
            {error}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Проверяем…" : "Войти"}
        </Button>
      </div>
    </form>
  );
}
