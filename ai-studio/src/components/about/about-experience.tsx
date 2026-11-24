import { Check, ChevronRight, MapPin } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { GlowCard } from "@/components/ui/glow-card";
import { Tag } from "@/components/ui/tag";
import { ABOUT_EXPERIENCE } from "@/lib/about";

export function AboutExperience() {
  return (
    <Section id="experience" labelledBy="experience-title">
      <Container>
        <Reveal>
          <SectionHeading
            id="experience-title"
            eyebrow="Опыт"
            title={
              <>
                Более 20 лет в финансах,{" "}
                <span className="text-gradient">консалтинге и управлении</span>
              </>
            }
            description="Последние 2,5 года — AI-продукты. До этого — руководство подразделениями, B2B-консалтинг и работа с финансовыми продуктами. Для каждого места — обязанности и достижения."
          />
        </Reveal>

        <div className="mt-12 space-y-5">
          {ABOUT_EXPERIENCE.map((job, index) => (
            <Reveal key={job.id} delay={index * 0.05}>
              <GlowCard className="p-6 sm:p-7">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-primary">
                      {job.period}
                    </p>
                    <h3 className="mt-1 text-[20px] font-semibold leading-tight text-foreground">
                      {job.company}
                    </h3>
                    <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[14.5px] text-muted-foreground">
                      <span>{job.role}</span>
                      {job.location ? (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {job.location}
                        </span>
                      ) : null}
                    </p>
                  </div>

                  {index === 0 ? (
                    <Badge variant="accent" className="w-fit shrink-0">
                      текущее место
                    </Badge>
                  ) : null}
                </div>

                {job.note ? (
                  <p className="mt-3 rounded-lg border border-border bg-muted/35 px-3 py-2 text-[12.5px] leading-relaxed text-muted-foreground">
                    {job.note}
                  </p>
                ) : null}

                <div className="mt-5 grid gap-5 border-t border-border pt-5 lg:grid-cols-2">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Обязанности
                    </p>
                    <ul className="mt-3 space-y-2">
                      {job.responsibilities.map((item) => (
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
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-success">
                      Достижения
                    </p>
                    <ul className="mt-3 space-y-2">
                      {job.achievements.map((item) => (
                        <li
                          key={item}
                          className="flex gap-2.5 text-[14px] leading-relaxed text-foreground/80"
                        >
                          <Check
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success"
                            strokeWidth={2.5}
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {job.stack?.length ? (
                  <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
                    {job.stack.map((item) => (
                      <Tag key={item}>{item}</Tag>
                    ))}
                  </div>
                ) : null}
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
