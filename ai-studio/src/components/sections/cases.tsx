import { ArrowRight, ArrowUpRight, ChevronRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Icon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { GlowCard } from "@/components/ui/glow-card";
import { Tag } from "@/components/ui/tag";
import { PROJECTS } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Cases() {
  return (
    <Section id="cases" labelledBy="cases-title">
      <Container>
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              id="cases-title"
              eyebrow="Кейсы"
              title={
                <>
                  Не «использовали ИИ», а{" "}
                  <span className="text-gradient">получили результат</span>
                </>
              }
              description="Шесть реализованных систем: комплаенс, LegalTech, финансовые агенты, продажи, доступ к данным и обработка обращений. Детали под NDA раскрываем на созвоне."
            />

            <a
              href="#contact"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-[14.5px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              Запросить детали
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {PROJECTS.map((project, index) => (
            <Reveal key={project.id} delay={(index % 2) * 0.07} className="h-full">
              <GlowCard interactive className="flex h-full flex-col p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-xl border",
                        project.accent === "indigo" &&
                          "border-primary/25 bg-primary/10 text-primary",
                        project.accent === "purple" &&
                          "border-accent/25 bg-accent/10 text-accent",
                        project.accent === "teal" &&
                          "border-accent/25 bg-accent/10 text-accent",
                        project.accent === "amber" &&
                          "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
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
                    реализовано
                  </Badge>
                </div>

                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                  {project.summary}
                </p>

                {project.result ? (
                  <p className="mt-3 rounded-lg border border-success/20 bg-success/[0.06] px-3 py-2 text-[13.5px] font-medium text-success">
                    {project.result}
                  </p>
                ) : null}

                <ul className="mt-5 space-y-2 border-t border-border pt-5">
                  {project.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2.5 text-[14.5px] leading-relaxed text-foreground/80"
                    >
                      <ChevronRight
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary"
                        strokeWidth={2.5}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                  <div className="flex flex-wrap items-center gap-1.5 font-mono text-[12px] text-muted-foreground">
                    {project.flow.map((step, stepIndex) => (
                      <span key={step} className="flex items-center gap-1.5">
                        <span className="rounded border border-border bg-card px-1.5 py-0.5">
                          {step}
                        </span>
                        {stepIndex < project.flow.length - 1 ? (
                          <span className="text-primary/70">→</span>
                        ) : null}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
                  {project.stack.map((item) => (
                    <Tag key={item}>{item}</Tag>
                  ))}
                  {project.href ? (
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="ml-auto inline-flex items-center gap-1.5 text-[13.5px] font-medium text-primary hover:underline"
                    >
                      GitHub
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
