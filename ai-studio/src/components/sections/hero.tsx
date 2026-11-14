import { ArrowRight, ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";

import { LaunchTimelineDialog } from "@/components/hero/launch-timeline-dialog";
import { Icon } from "@/components/icons";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { HERO_CAPABILITIES } from "@/lib/content";
import { cn } from "@/lib/utils";

const CHAT_MESSAGES = [
  {
    from: "user",
    text: "Собери план на неделю и проверь, сколько ушло на подписки",
  },
  {
    from: "agent",
    text: "Готово: 6 задач в календаре, 2 встречи перенёс. По подпискам — 3 480 ₽, одну можно отключить и сэкономить 790 ₽.",
  },
  {
    from: "user",
    text: "Отправь отчёт в бухгалтерию и напомни в пятницу",
  },
] as const;

const CHAT_CHIPS = ["Telegram", "Web", "Данные под контролем"] as const;

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
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
        <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card py-1.5 pl-2.5 pr-4 text-[13.5px] font-medium text-muted-foreground backdrop-blur sm:text-[14px]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75 motion-reduce:hidden" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                ИИ-автоматизация для жизни и бизнеса
              </span>
            </Reveal>

            <Reveal delay={0.06}>
              <h1
                id="hero-title"
                className="mt-6 text-[2.1rem] font-bold leading-[1.1] tracking-[-0.03em] text-foreground sm:text-[2.75rem] lg:text-[3.4rem]"
              >
                Персональные ИИ-агенты:{" "}
                <span className="text-gradient-ai">
                  заберут рутину, сэкономят бюджет, увеличат прибыль и вернут
                  время для жизни
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-6 max-w-2xl text-[16.5px] leading-relaxed text-muted-foreground sm:text-[18px]">
                Создаем и настраиваем умных помощников под ваши личные и
                бизнес-задачи за срок от 3-х дней{" "}
                <LaunchTimelineDialog>
                  (зависит от объема проекта)
                </LaunchTimelineDialog>
                . Работают в привычных мессенджерах и обеспечивают анонимность
                данных.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <a href="#contact">
                    Обсудить задачу
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  <a href="#cases">Посмотреть примеры</a>
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <p className="mt-6 flex items-center gap-2 text-[13.5px] text-muted-foreground">
                <ShieldCheck className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                Анонимность данных по умолчанию: без передачи третьим лицам.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="relative hidden lg:block">
            <div
              aria-hidden="true"
              className="absolute -inset-6 rounded-[2rem] bg-primary/10 blur-2xl"
            />

            <div
              aria-hidden="true"
              className="glow-card relative rounded-2xl border border-border p-5 shadow-card sm:p-6"
            >
              <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground">
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[14.5px] font-semibold text-foreground">
                      Личный ассистент
                    </p>
                    <p className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-success" />
                      online · отвечает за секунды
                    </p>
                  </div>
                </div>
                <span className="rounded-md border border-border bg-card px-2 py-1 font-mono text-[11px] text-muted-foreground">
                  AI
                </span>
              </div>

              <div className="mt-4 space-y-2.5">
                {CHAT_MESSAGES.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "max-w-[88%] rounded-2xl border px-3.5 py-2.5 text-[13.5px] leading-relaxed",
                      message.from === "agent"
                        ? "border-primary/25 bg-primary/[0.07] text-foreground"
                        : "ml-auto border-border bg-card/70 text-foreground/85",
                    )}
                  >
                    {message.text}
                  </div>
                ))}
                <div className="flex items-center gap-1.5 pl-1 pt-1">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/60 motion-reduce:animate-none" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/60 [animation-delay:150ms] motion-reduce:animate-none" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/60 [animation-delay:300ms] motion-reduce:animate-none" />
                  <span className="ml-1 font-mono text-[11px] text-muted-foreground">
                    печатает…
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                {CHAT_CHIPS.map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 font-mono text-[11px] text-muted-foreground"
                  >
                    {chip === "Данные под контролем" ? (
                      <ShieldCheck className="h-3 w-3 text-success" aria-hidden="true" />
                    ) : null}
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-3 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {HERO_CAPABILITIES.map((item, index) => (
            <Reveal key={item.id} delay={0.08 * index}>
              <div className="glow-card group h-full rounded-xl border border-border p-4 transition-colors hover:border-primary/30">
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg border",
                    item.accent === "indigo"
                      ? "border-primary/25 bg-primary/10 text-primary"
                      : "border-accent/25 bg-accent/10 text-accent",
                  )}
                >
                  <Icon name={item.icon} className="h-4 w-4" />
                </span>
                <p className="mt-3 text-[14.5px] font-semibold text-foreground">
                  {item.title}
                </p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <a
            href="#services"
            className="mt-6 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-primary transition-colors hover:text-primary-soft hover:underline"
          >
            Как мы работаем и что входит в проект
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </Reveal>
      </Container>
    </section>
  );
}
