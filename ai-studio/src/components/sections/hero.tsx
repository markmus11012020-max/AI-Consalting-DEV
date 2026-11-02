import { ArrowRight, ArrowUpRight, Check, ShieldCheck } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HERO_BADGES, HERO_PROOF } from "@/lib/content";
import { SITE } from "@/lib/site";

const VALUE_PROPS = [
  "от 2 недель до MVP",
  "NDA и ФЗ-152",
  "код на GitHub",
];

const RESULT_ROWS = [
  {
    title: "Агент в проде",
    detail: "Диалоги, CRM, передача человеку",
    meta: "24/7",
  },
  {
    title: "RAG на ваших данных",
    detail: "Цитаты, доступы, контроль галлюцинаций",
    meta: "RU",
  },
  {
    title: "Код и доступы у вас",
    detail: "Репозиторий, Docker, документация",
    meta: "GitHub",
  },
];

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative overflow-hidden pb-20 pt-32 sm:pb-24 sm:pt-36 lg:pb-28 lg:pt-40"
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
        <div className="grid items-center gap-14 lg:grid-cols-[1.06fr_0.94fr] lg:gap-16">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card py-1.5 pl-2.5 pr-4 text-[14px] font-medium text-muted-foreground backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                {SITE.tagline}
              </span>
            </Reveal>

            <Reveal delay={0.06}>
              <h1
                id="hero-title"
                className="mt-6 text-[2.45rem] font-bold leading-[1.08] tracking-[-0.03em] text-foreground sm:text-5xl lg:text-[3.9rem]"
              >
                ИИ-агенты и торговые боты, которые{" "}
                <span className="text-gradient">работают в проде</span>
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted-foreground sm:text-[18px]">
                Проектируем, запускаем и сопровождаем ИИ-решения за 2–4 недели.
                Фиксируем критерии успеха, передаём код и защищаем данные — без
                многомесячных циклов классической разработки.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <a href="#calculator">
                    Получить смету за 2 минуты
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  <a href="#cases">Смотреть кейсы</a>
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <ul className="mt-9 flex flex-wrap gap-x-5 gap-y-2.5 text-[14.5px] text-muted-foreground">
                {VALUE_PROPS.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-success" strokeWidth={3} />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-10 grid max-w-xl grid-cols-2 gap-4 border-t border-border pt-6 sm:grid-cols-4">
                {HERO_PROOF.map((item) => (
                  <div key={item.label}>
                    <p className="font-display text-2xl font-bold tracking-tight text-foreground">
                      {item.value}
                    </p>
                    <p className="mt-1 text-[12.5px] leading-tight text-muted-foreground">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-6 rounded-[2rem] bg-primary/10 blur-2xl"
            />

            <div className="glow-card relative rounded-2xl border border-border p-5 shadow-card sm:p-6">
              <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
                <div>
                  <p className="font-mono text-[11.5px] uppercase tracking-[0.18em] text-muted-foreground">
                    aillix / production
                  </p>
                  <p className="mt-1 text-[15px] font-semibold text-foreground">
                    Что получает клиент
                  </p>
                </div>
                <Badge variant="success" className="gap-1.5 text-[11.5px]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                  online
                </Badge>
              </div>

              <div className="mt-4 space-y-2.5">
                {RESULT_ROWS.map((item, index) => (
                  <div
                    key={item.title}
                    className="group flex items-start gap-3 rounded-xl border border-border bg-card/60 p-3 transition-colors hover:border-primary/30 hover:bg-primary/[0.04]"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border bg-card font-mono text-[11.5px] text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[14.5px] font-semibold text-foreground">
                          {item.title}
                        </p>
                        <span className="font-mono text-[11.5px] text-muted-foreground">
                          {item.meta}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Последний кейс
                </p>
                <p className="mt-1 text-[14.5px] font-semibold text-foreground">
                  FinTech Compliance AI-Orchestrator
                </p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
                  Java 17 · Spring Boot · PostgreSQL · audit trail
                </p>
                <a
                  href="#cases"
                  className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-medium text-primary hover:underline"
                >
                  Смотреть кейс
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 font-mono text-[11.5px] text-muted-foreground">
                  <ShieldCheck className="h-3 w-3 text-success" />
                  PII masked
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 font-mono text-[11.5px] text-muted-foreground">
                  audit log
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 font-mono text-[11.5px] text-muted-foreground">
                  region: RU
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div className="mt-14 flex flex-wrap items-center gap-2 sm:mt-16">
            {HERO_BADGES.map((item) => (
              <Badge key={item} variant="outline" className="text-[13px]">
                {item}
              </Badge>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
