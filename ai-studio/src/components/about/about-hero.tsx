import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Clock,
  Download,
  MapPin,
  Sparkles,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ABOUT_METRICS, ABOUT_PROFILE } from "@/lib/about";

const PROFILE_ROWS = [
  { icon: MapPin, label: "Локация", value: ABOUT_PROFILE.location },
  { icon: Briefcase, label: "Формат", value: "Full-time · удалённо / гибрид" },
  { icon: Clock, label: "Опыт", value: ABOUT_PROFILE.experience },
  { icon: Sparkles, label: "Фокус", value: "AI-агенты · RAG · HITL" },
] as const;

export function AboutHero() {
  return (
    <section
      id="top"
      aria-labelledby="about-title"
      className="relative overflow-hidden pb-16 pt-32 sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-40"
    >
      <div aria-hidden="true" className="absolute inset-0 bg-radial-glow" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[560px] bg-grid-faint opacity-70"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-24 h-80 w-80 rounded-full bg-accent/15 blur-3xl"
      />

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.06fr_0.94fr] lg:gap-14">
          <div>
            <Reveal>
              <Badge variant="accent" className="gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75 motion-reduce:hidden" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                </span>
                AI Product Manager · Самара
              </Badge>
            </Reveal>

            <Reveal delay={0.06}>
              <h1
                id="about-title"
                className="mt-6 text-balance text-[2rem] font-bold leading-[1.1] tracking-[-0.03em] text-foreground sm:text-[2.8rem] lg:text-[3.2rem]"
              >
                AI-продукты, которые{" "}
                <span className="text-gradient-ai">доходят до запуска</span>
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-6 max-w-2xl text-[16.5px] leading-relaxed text-muted-foreground sm:text-[18px]">
                {ABOUT_PROFILE.summary}
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <a href={ABOUT_PROFILE.pdfHref} download>
                    Скачать резюме PDF
                    <Download className="h-4 w-4" aria-hidden="true" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  <Link href="/#contact">
                    Обсудить проект
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <p className="mt-6 flex items-start gap-2 text-[13.5px] leading-relaxed text-muted-foreground">
                <BadgeCheck
                  className="mt-0.5 h-4 w-4 shrink-0 text-success"
                  aria-hidden="true"
                />
                {ABOUT_PROFILE.hackathon}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="relative hidden lg:block">
            <div
              aria-hidden="true"
              className="absolute -inset-6 rounded-[2rem] bg-primary/10 blur-2xl"
            />

            <div className="glow-card relative rounded-2xl border border-border p-5 shadow-card sm:p-6">
              <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary to-accent font-display text-[15px] font-bold text-white shadow-[0_8px_24px_-8px_rgba(99,102,241,0.9)]">
                    ГМ
                  </span>
                  <div>
                    <p className="text-[15px] font-semibold text-foreground">
                      {ABOUT_PROFILE.shortName}
                    </p>
                    <p className="text-[12px] text-muted-foreground">
                      {ABOUT_PROFILE.role}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  открыта
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {PROFILE_ROWS.map((row) => {
                  const Icon = row.icon;
                  return (
                    <div
                      key={row.label}
                      className="flex items-start gap-2.5 text-[13px]"
                    >
                      <Icon
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <div className="min-w-0">
                        <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                          {row.label}
                        </p>
                        <p className="mt-0.5 font-medium leading-snug text-foreground">
                          {row.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
                {ABOUT_METRICS.map((metric) => (
                  <div key={metric.label}>
                    <p className="font-display text-[21px] font-bold leading-none text-primary">
                      {metric.value}
                    </p>
                    <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-3 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {ABOUT_METRICS.map((metric, index) => (
            <Reveal key={metric.label} delay={0.06 * index}>
              <div className="glow-card h-full rounded-xl border border-border p-4">
                <p className="font-display text-[26px] font-bold leading-none tracking-[-0.03em] text-primary">
                  {metric.value}
                </p>
                <p className="mt-2 text-[13.5px] leading-snug text-muted-foreground">
                  {metric.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
