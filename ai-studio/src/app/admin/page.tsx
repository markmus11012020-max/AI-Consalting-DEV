import type { Metadata } from "next";

import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "Админ-панель",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main className="min-h-dvh pb-20 pt-28 sm:pt-32">
      <Container>
        <div className="mb-8">
          <p className="font-mono text-[11.5px] uppercase tracking-[0.18em] text-muted-foreground">
            aillix / control room
          </p>
          <h1 className="mt-2 font-display text-[2rem] font-bold tracking-[-0.03em] text-foreground sm:text-[2.4rem]">
            Управление заявками и услугами
          </h1>
        </div>

        <AdminDashboard />
      </Container>
    </main>
  );
}
