import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Icon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/glow-card";
import { Tag } from "@/components/ui/tag";
import { TRADING_CASES } from "@/lib/content";
import { cn } from "@/lib/utils";

const STEPS = [
  "Формализуем стратегию и риск-профиль",
  "Собираем данные и бэктест",
  "Paper trading и testnet",
  "Запуск в работу с лимитами и мониторингом",
];

const SAFETY = [
  "API-ключи без права вывода средств",
  "Лимиты экспозиции и kill-switch",
  "Журнал решений и алерты",
  "Не храним средства клиента",
];

export function TradingBots() {
  return (
    <Section id="trading" labelledBy="trading-title">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-10 h-80 w-80 rounded-full bg-accent/[0.08] blur-3xl"
      />

      <Container className="relative">
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              id="trading-title"
              eyebrow="Aillix Quant"
              title={
                <>
                  Торговые боты, которые{" "}
                  <span className="text-gradient">переживают реальный рынок</span>
                </>
              }
              description="Разрабатываем алгоритмические торговые системы для криптобирж: от стратегии и бэктеста до исполнения, риск-контроля и PnL-дашборда."
            />
            <Badge variant="purple" className="w-fit gap-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              testnet / dry-run first
            </Badge>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {TRADING_CASES.map((project, index) => (
            <Reveal key={project.id} delay={index * 0.08} className="h-full">
              <GlowCard
                interactive
                className="flex h-full flex-col p-6 sm:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-xl border",
                        project.accent === "teal"
                          ? "border-accent/25 bg-accent/10 text-accent"
                          : "border-primary/25 bg-primary/10 text-primary",
                      )}
                    >
                      <Icon name={project.icon} className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {project.category}
                      </p>
                      <h3 className="mt-1 text-[18px] font-semibold leading-tight text-foreground">
                        {project.title}
                      </h3>
                    </div>
                  </div>
                  <Badge variant="success" className="hidden sm:inline-flex">
                    готово к запуску
                  </Badge>
                </div>

                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                  {project.summary}
                </p>

                <ul className="mt-5 space-y-2 border-t border-border pt-5">
                  {project.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2.5 text-[14.5px] leading-relaxed text-foreground/80"
                    >
                      <Check
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success"
                        strokeWidth={2.5}
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <Tag key={item}>{item}</Tag>
                  ))}
                </div>

                {project.href ? (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[14px] font-medium text-primary hover:underline"
                  >
                    Смотреть код
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                ) : null}
              </GlowCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <GlowCard className="p-6 sm:p-7">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Как запускаем
              </p>
              <ol className="mt-4 grid gap-3 sm:grid-cols-2">
                {STEPS.map((step, index) => (
                  <li key={step} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-border bg-card font-mono text-[11px] text-primary">
                      {index + 1}
                    </span>
                    <span className="text-[14.5px] leading-relaxed text-foreground/80">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </GlowCard>

            <GlowCard className="border-success/20 p-6 sm:p-7">
              <div className="flex items-center gap-2 text-success">
                <ShieldAlert className="h-4 w-4" />
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em]">
                  Безопасность
                </p>
              </div>
              <ul className="mt-4 space-y-2">
                {SAFETY.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 text-[14px] leading-relaxed text-muted-foreground"
                  >
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-border pt-3 text-[12px] leading-relaxed text-muted-foreground">
                Не является инвестиционной рекомендацией. Прошлые результаты не
                гарантируют будущие. Мы разрабатываем ПО и не управляем
                средствами клиента.
              </p>
            </GlowCard>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <a href="#contact">
                Обсудить стратегию
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a
                href="https://github.com/markmus11012020-max/dex-arb"
                target="_blank"
                rel="noreferrer noopener"
              >
                Смотреть код на GitHub
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
