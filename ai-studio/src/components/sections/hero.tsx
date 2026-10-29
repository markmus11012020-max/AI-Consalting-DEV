import { ArrowRight, Check, ShieldCheck, Sparkles } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HERO_BADGES, HERO_PIPELINE } from "@/lib/content";
import { SITE, STACK_STRIP } from "@/lib/site";

const VALUE_PROPS = [
  "Live MVP за 2–4 недели",
  "RAG на ваших данных",
  "ФЗ-152 by design",
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
        className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-24 h-80 w-80 rounded-full bg-purple-600/15 blur-3xl"
      />

      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.06fr_0.94fr] lg:gap-16">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-2.5 pr-4 text-[14px] font-medium text-slate-300 backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-500" />
                </span>
                {SITE.tagline}
              </span>
            </Reveal>

            <Reveal delay={0.06}>
              <h1
                id="hero-title"
                className="mt-6 text-[2.45rem] font-bold leading-[1.08] tracking-[-0.03em] text-white sm:text-5xl lg:text-[3.9rem]"
              >
                Интегрируем{" "}
                <span className="text-gradient">Генеративный ИИ</span>{" "}
                в реальный бизнес
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-6 max-w-xl text-[16.5px] leading-relaxed text-slate-400 sm:text-[18px]">
                Проектируем автономных ИИ-агентов, интеллектуальные RAG-системы
                и Live MVP с боевой архитектурой. Без многомесячных циклов
                классической веб-разработки — и без компромиссов по данным.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <a href="#calculator">
                    Рассчитать стоимость MVP
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  <a href="#solutions">Смотреть проекты</a>
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <ul className="mt-9 flex flex-wrap gap-x-5 gap-y-2.5 text-[14.5px] text-slate-400">
                {VALUE_PROPS.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-400" strokeWidth={3} />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-10 border-t border-white/[0.07] pt-6">
                <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Технологический стек
                </p>
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[14px] text-slate-400">
                  {STACK_STRIP.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="h-1 w-1 rounded-full bg-indigo-400/70"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-6 rounded-[2rem] bg-indigo-500/10 blur-2xl"
            />

            <div
              aria-hidden="true"
              className="glow-card relative rounded-2xl border border-white/[0.08] p-5 shadow-card sm:p-6"
            >
              <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-400/70" />
                  <span className="h-2 w-2 rounded-full bg-amber-400/70" />
                  <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
                  <span className="ml-2 font-mono text-[12.5px] tracking-wide text-slate-500">
                    ai-studio/pipeline.ts
                  </span>
                </div>
                <Badge variant="success" className="gap-1.5 text-[11.5px]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  production
                </Badge>
              </div>

              <div className="mt-4 space-y-2.5">
                {HERO_PIPELINE.map((item, index) => (
                  <div
                    key={item.layer}
                    className="group flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition-colors hover:border-indigo-400/25 hover:bg-indigo-500/[0.06]"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] font-mono text-[11.5px] text-indigo-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[14.5px] font-semibold text-slate-100">
                          {item.layer}
                        </p>
                        <span className="font-mono text-[11.5px] text-slate-500">
                          {item.meta}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[13px] leading-relaxed text-slate-500">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/[0.07] pt-4">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 font-mono text-[11.5px] text-slate-400">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  PII masked
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 font-mono text-[11.5px] text-slate-400">
                  audit log: on
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 font-mono text-[11.5px] text-slate-400">
                  region: RU
                </span>
                <span className="ml-auto inline-flex items-center gap-1.5 text-[11.5px] text-slate-500">
                  <Sparkles className="h-3 w-3 text-purple-400" />
                  metadata-driven
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div className="mt-14 flex flex-wrap items-center gap-2 sm:mt-16">
            {HERO_BADGES.map((item) => (
              <Badge key={item} variant="outline" className="text-[12.5px]">
                {item}
              </Badge>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
