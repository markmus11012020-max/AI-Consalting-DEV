import {
  GraduationCap,
  Server,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { GlowCard } from "@/components/ui/glow-card";
import { Tag } from "@/components/ui/tag";
import {
  ABOUT_AWARDS,
  ABOUT_EDUCATION,
  ABOUT_SKILLS,
} from "@/lib/about";
import { cn } from "@/lib/utils";

const ACCENTS = {
  indigo: "border-primary/25 bg-primary/10 text-primary",
  purple: "border-accent/25 bg-accent/10 text-accent",
  teal: "border-accent/25 bg-accent/10 text-accent",
  amber: "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
} as const;

export function AboutSkills() {
  return (
    <Section id="skills" labelledBy="skills-title">
      <Container>
        <Reveal>
          <SectionHeading
            id="skills-title"
            eyebrow="Навыки"
            title={
              <>
                AI-продукт,{" "}
                <span className="text-gradient">backend и комплаенс</span>
              </>
            }
            description="Не список ради списка: стек, который используется в Call-Pilot, КликЮристе и инженерных проектах на GitHub."
          />
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {ABOUT_SKILLS.map((group, index) => (
            <Reveal key={group.id} delay={(index % 3) * 0.05} className="h-full">
              <GlowCard className="flex h-full flex-col p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl border",
                      ACCENTS[group.accent],
                    )}
                  >
                    {group.id === "ai" ? (
                      <Sparkles className="h-4 w-4" />
                    ) : group.id === "product" ? (
                      <Target className="h-4 w-4" />
                    ) : group.id === "backend" ? (
                      <Server className="h-4 w-4" />
                    ) : group.id === "compliance" ? (
                      <ShieldCheck className="h-4 w-4" />
                    ) : (
                      <Users className="h-4 w-4" />
                    )}
                  </span>
                  <h3 className="text-[16px] font-semibold text-foreground">
                    {group.title}
                  </h3>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
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

export function AboutEducation() {
  return (
    <Section id="education" labelledBy="education-title">
      <Container>
        <Reveal>
          <SectionHeading
            id="education-title"
            eyebrow="Образование"
            title={
              <>
                Экономика, управление и{" "}
                <span className="text-gradient">непрерывное обучение</span>
              </>
            }
            description="Высшее экономическое образование, повышение квалификации по ИИ-инструментам и профильные курсы по промпт-инжинирингу."
          />
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {ABOUT_EDUCATION.map((item, index) => (
            <Reveal key={item.id} delay={(index % 2) * 0.06} className="h-full">
              <GlowCard className="flex h-full flex-col p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                    <GraduationCap className="h-5 w-5" />
                  </span>
                  <Badge variant="outline" className="shrink-0">
                    {item.year}
                  </Badge>
                </div>
                <h3 className="mt-4 text-[17px] font-semibold leading-snug text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                  {item.place}
                </p>
                {item.note ? (
                  <p className="mt-3 text-[12.5px] font-medium uppercase tracking-[0.12em] text-primary">
                    {item.note}
                  </p>
                ) : null}
              </GlowCard>
            </Reveal>
          ))}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          {ABOUT_AWARDS.map((award) => (
            <Reveal key={award.id}>
              <GlowCard className="flex h-full flex-col justify-between gap-5 border-amber-500/25 bg-amber-500/[0.06] p-6 sm:p-7">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300">
                    <Trophy className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-300">
                      {award.year}
                    </p>
                    <h3 className="mt-1 text-[18px] font-semibold leading-snug text-foreground">
                      {award.title}
                    </h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                      {award.detail}
                    </p>
                  </div>
                </div>
              </GlowCard>
            </Reveal>
          ))}

          <Reveal>
            <GlowCard className="flex h-full flex-col justify-center p-6 sm:p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Что это даёт
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-foreground/85">
                Хакатон — проверка гипотез на скорости: AI-агент, RAG,
                T-Invest MCP, детерминированное ядро и HITL. Тот же подход —
                в продуктовых проектах Aillix.
              </p>
            </GlowCard>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
