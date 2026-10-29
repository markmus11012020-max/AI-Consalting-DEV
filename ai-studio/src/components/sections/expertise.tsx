import { Check } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Icon } from "@/components/icons";
import { GlowCard } from "@/components/ui/glow-card";
import { Tag } from "@/components/ui/tag";
import { EXPERTISE } from "@/lib/content";

export function Expertise() {
  return (
    <Section id="expertise" labelledBy="expertise-title">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-indigo-600/[0.07] blur-3xl"
      />

      <Container className="relative">
        <Reveal>
          <SectionHeading
            id="expertise-title"
            eyebrow="Экспертиза"
            title={
              <>
                Инженерия ИИ, а не{" "}
                <span className="text-gradient">демо на промптах</span>
              </>
            }
            description="Три компетенции, которые закрывают путь от идеи до продакшена: поведение модели, сервисный слой и требования регуляторов."
          />
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-2xl gap-5 lg:max-w-none lg:grid-cols-3">
          {EXPERTISE.map((group, index) => (
            <Reveal key={group.id} delay={index * 0.08} className="h-full">
              <GlowCard
                interactive
                className="flex h-full flex-col p-6 sm:p-7"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-400/20 bg-gradient-to-br from-indigo-500/20 to-purple-500/10 text-indigo-300">
                    <Icon name={group.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="text-[18px] font-semibold leading-tight text-white">
                    {group.title}
                  </h3>
                </div>

                <p className="mt-4 text-[15px] leading-relaxed text-slate-400">
                  {group.summary}
                </p>

                <ul className="mt-5 space-y-2.5 border-t border-white/[0.06] pt-5">
                  {group.points.map((point) => (
                    <li key={point} className="flex gap-2.5 text-[14.5px] leading-relaxed text-slate-300">
                      <Check
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-400"
                        strokeWidth={2.5}
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-wrap gap-2 pt-6">
                  {group.tags.map((tag) => (
                    <Tag key={tag} tone="indigo">
                      {tag}
                    </Tag>
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
