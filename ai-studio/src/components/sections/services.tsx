import { ArrowRight, Check } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Icon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/glow-card";
import { SERVICES } from "@/lib/content";
import { cn } from "@/lib/utils";

const ACCENTS = {
  indigo: "border-primary/25 bg-primary/10 text-primary",
  teal: "border-accent/25 bg-accent/10 text-accent",
  amber: "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  rose: "border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300",
} as const;

export function Services() {
  return (
    <Section id="services" labelledBy="services-title">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[46rem] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-3xl"
      />

      <Container className="relative">
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              id="services-title"
              eyebrow="Услуги"
              title={
                <>
                  Что можно запустить{" "}
                  <span className="text-gradient">в этом квартале</span>
                </>
              }
              description="Продуктовые пакеты с понятным результатом. Точная смета — после дискавери: объём данных, интеграции и требования к контуру влияют на итог."
            />
            <Badge variant="accent" className="w-fit">
              Работаем по договору и NDA
            </Badge>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {SERVICES.map((service, index) => (
            <Reveal
              key={service.id}
              delay={(index % 3) * 0.06}
              className="h-full"
            >
              <GlowCard
                interactive
                className="flex h-full flex-col p-6 sm:p-7"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border",
                      ACCENTS[service.accent],
                    )}
                  >
                    <Icon name={service.icon} className="h-5 w-5" />
                  </span>
                  <div className="text-right">
                    <p className="text-[15px] font-semibold text-foreground">
                      {service.price}
                    </p>
                    <p className="text-[12.5px] text-muted-foreground">
                      {service.weeks}
                    </p>
                  </div>
                </div>

                <h3 className="mt-4 text-[18px] font-semibold leading-tight text-foreground">
                  {service.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                  {service.summary}
                </p>

                <ul className="mt-4 space-y-2 border-t border-border pt-4">
                  {service.highlights.map((item) => (
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

                <p className="mt-auto flex items-start gap-2 pt-4 text-[14px] font-medium text-success">
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0" />
                  {service.outcome}
                </p>

                <Button asChild variant="secondary" className="mt-5 w-full">
                  <a href="#contact">
                    Обсудить задачу
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
