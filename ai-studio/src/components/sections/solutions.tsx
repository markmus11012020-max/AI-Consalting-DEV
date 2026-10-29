import { ArrowRight, ChevronRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Icon } from "@/components/icons";
import { GlowCard } from "@/components/ui/glow-card";
import { Tag } from "@/components/ui/tag";
import { PROJECTS } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Solutions() {
  return (
    <Section id="solutions" labelledBy="solutions-title">
      <Container>
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              id="solutions-title"
              eyebrow="Проекты"
              title={
                <>
                  Архитектура{" "}
                  <span className="text-gradient">реализованных решений</span>
                </>
              }
              description="Шесть референсных систем: комплаенс, LegalTech, финансовые агенты, продажи, доступ к данным и обработка обращений. Детали под NDA раскрываем на созвоне."
            />

            <a
              href="#contact"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[14.5px] text-slate-300 transition-colors hover:border-indigo-400/40 hover:text-white"
            >
              Запросить детали
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {PROJECTS.map((project, index) => (
            <Reveal key={project.id} delay={(index % 2) * 0.08} className="h-full">
              <GlowCard
                interactive
                className="flex h-full flex-col p-6 sm:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-xl border",
                        project.accent === "indigo"
                          ? "border-indigo-400/25 bg-indigo-500/10 text-indigo-300"
                          : "border-purple-400/25 bg-purple-500/10 text-purple-300",
                      )}
                    >
                      <Icon name={project.icon} className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {project.category}
                      </p>
                      <h3 className="mt-1 text-[18px] font-semibold leading-tight text-white">
                        {project.title}
                      </h3>
                    </div>
                  </div>

                  <span
                    className="mt-1 hidden h-2 w-2 shrink-0 rounded-full bg-emerald-400/80 sm:block"
                    aria-hidden="true"
                  />
                </div>

                <p className="mt-4 text-[15px] leading-relaxed text-slate-400">
                  {project.summary}
                </p>

                <ul className="mt-5 space-y-2 border-t border-white/[0.06] pt-5">
                  {project.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2.5 text-[14.5px] leading-relaxed text-slate-300"
                    >
                      <ChevronRight
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-400"
                        strokeWidth={2.5}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 rounded-xl border border-white/[0.06] bg-black/20 px-3 py-2.5">
                  <div className="flex flex-wrap items-center gap-1.5 font-mono text-[12px] text-slate-400">
                    {project.flow.map((step, stepIndex) => (
                      <span key={step} className="flex items-center gap-1.5">
                        <span className="rounded border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5">
                          {step}
                        </span>
                        {stepIndex < project.flow.length - 1 ? (
                          <span className="text-indigo-400/70">→</span>
                        ) : null}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto flex flex-wrap gap-2 pt-5">
                  {project.stack.map((item) => (
                    <Tag key={item}>{item}</Tag>
                  ))}
                </div>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
