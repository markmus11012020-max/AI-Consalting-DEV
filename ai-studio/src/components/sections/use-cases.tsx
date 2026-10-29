import { ArrowRight, Check, TrendingUp } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Icon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/glow-card";
import { AGENT_USE_CASE, USE_CASES } from "@/lib/content";

export function UseCases() {
  return (
    <Section id="use-cases" labelledBy="use-cases-title">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[46rem] -translate-x-1/2 rounded-full bg-indigo-600/[0.06] blur-3xl"
      />

      <Container className="relative">
        <Reveal>
          <SectionHeading
            id="use-cases-title"
            eyebrow="Направления"
            title={
              <>
                Где ИИ уже{" "}
                <span className="text-gradient">приносит деньги</span>
              </>
            }
            description="Пять задач, которые бизнес закрывает с ИИ каждый день. Начните с той, где потери времени или денег самые заметные."
          />
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {USE_CASES.map((item, index) => (
            <Reveal
              key={item.id}
              delay={(index % 2) * 0.08}
              className="h-full"
            >
              <GlowCard
                interactive
                className="flex h-full flex-col p-6 sm:p-7"
              >
                <div className="flex items-start gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-400/20 bg-gradient-to-br from-indigo-500/20 to-purple-500/10 text-indigo-300">
                    <Icon name={item.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-[18px] font-semibold leading-tight text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-slate-400">
                      {item.summary}
                    </p>
                  </div>
                </div>

                <ul className="mt-5 space-y-2.5 border-t border-white/[0.06] pt-5">
                  {item.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-2.5 text-[14.5px] leading-relaxed text-slate-300"
                    >
                      <Check
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-400"
                        strokeWidth={2.5}
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-auto flex items-center gap-2 pt-5 text-[13.5px] font-medium text-emerald-300/90">
                  <TrendingUp className="h-4 w-4 shrink-0" />
                  {item.result}
                </p>
              </GlowCard>
            </Reveal>
          ))}

          <Reveal delay={0.1} className="sm:col-span-2">
            <GlowCard className="relative overflow-hidden border-indigo-400/20 p-6 sm:p-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/[0.13] via-transparent to-purple-500/[0.13]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-purple-500/15 blur-3xl"
              />

              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
                <div className="max-w-2xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-purple-400/25 bg-purple-500/10 text-purple-300">
                      <Icon name={AGENT_USE_CASE.icon} className="h-5 w-5" />
                    </span>
                    <h3 className="text-[18px] font-semibold leading-tight text-white">
                      {AGENT_USE_CASE.title}
                    </h3>
                    <Badge variant="purple">Следующий уровень</Badge>
                  </div>

                  <p className="mt-4 text-[15.5px] leading-relaxed text-slate-300">
                    {AGENT_USE_CASE.summary}
                  </p>

                  <ul className="mt-4 flex flex-wrap gap-2">
                    {AGENT_USE_CASE.points.map((point) => (
                      <li
                        key={point}
                        className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[13px] text-slate-300"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-4 flex items-center gap-2 text-[13.5px] font-medium text-emerald-300/90">
                    <TrendingUp className="h-4 w-4 shrink-0" />
                    {AGENT_USE_CASE.result}
                  </p>
                </div>

                <Button
                  asChild
                  size="lg"
                  className="w-full shrink-0 sm:w-auto lg:self-center"
                >
                  <a href="#contact">
                    Подобрать сценарий
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </GlowCard>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
