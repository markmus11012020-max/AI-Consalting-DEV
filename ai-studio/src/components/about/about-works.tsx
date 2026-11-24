import { ArrowUpRight, ChevronRight } from "lucide-react";

import { Icon } from "@/components/icons";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { GlowCard } from "@/components/ui/glow-card";
import { Tag } from "@/components/ui/tag";
import { ABOUT_WORKS } from "@/lib/about";
import { cn } from "@/lib/utils";

const ACCENTS = {
  indigo: "border-primary/25 bg-primary/10 text-primary",
  purple: "border-accent/25 bg-accent/10 text-accent",
  teal: "border-accent/25 bg-accent/10 text-accent",
  amber: "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
} as const;

export function AboutWorks() {
  return (
    <Section id="works" labelledBy="works-title">
      <Container>
        <Reveal>
          <SectionHeading
            id="works-title"
            eyebrow="Реальные работы"
            title={
              <>
                Продукты, которые{" "}
                <span className="text-gradient">можно открыть</span>
              </>
            }
            description="Не концепты и не «демо на слайдах»: публичные сервисы, сайт практики и открытый код. Call-Pilot и КликЮрист можно проверить прямо сейчас."
          />
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {ABOUT_WORKS.map((work, index) => (
            <Reveal key={work.id} delay={(index % 2) * 0.07} className="h-full">
              <GlowCard
                interactive
                className="flex h-full flex-col p-6 sm:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-xl border",
                        ACCENTS[work.accent],
                      )}
                    >
                      <Icon name={work.icon} className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {work.category}
                      </p>
                      <h3 className="mt-1 text-[18px] font-semibold leading-tight text-foreground">
                        {work.title}
                      </h3>
                    </div>
                  </div>

                  {work.badge ? (
                    <Badge variant="success" className="hidden shrink-0 sm:inline-flex">
                      {work.badge}
                    </Badge>
                  ) : null}
                </div>

                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                  {work.summary}
                </p>

                {work.result ? (
                  <p className="mt-3 rounded-lg border border-success/20 bg-success/[0.06] px-3 py-2 text-[13.5px] font-medium text-success">
                    {work.result}
                  </p>
                ) : null}

                <ul className="mt-5 space-y-2 border-t border-border pt-5">
                  {work.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2.5 text-[14px] leading-relaxed text-foreground/80"
                    >
                      <ChevronRight
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary"
                        strokeWidth={2.5}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {work.metrics?.length ? (
                  <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl border border-border bg-muted/35 p-4">
                    {work.metrics.map((metric) => (
                      <div key={metric.label}>
                        <p className="font-display text-[21px] font-bold leading-none text-primary">
                          {metric.value}
                        </p>
                        <p className="mt-1 text-[11.5px] leading-snug text-muted-foreground">
                          {metric.label}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
                  {work.stack.map((item) => (
                    <Tag key={item}>{item}</Tag>
                  ))}
                  {work.href ? (
                    <a
                      href={work.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="ml-auto inline-flex items-center gap-1.5 text-[13.5px] font-medium text-primary hover:underline"
                    >
                      {work.hrefLabel ?? "Открыть"}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                </div>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
