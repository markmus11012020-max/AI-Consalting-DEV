import { Check } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { PROCESS } from "@/lib/content";

export function Process() {
  return (
    <Section id="process" labelledBy="process-title">
      <Container>
        <Reveal>
          <SectionHeading
            id="process-title"
            eyebrow="Процесс"
            title={
              <>
                От дискавери до прода{" "}
                <span className="text-gradient">за один цикл</span>
              </>
            }
            description="Короткие итерации с измеримым результатом на каждом шаге. Вы всегда знаете, что уже работает и сколько это стоит в запросах."
          />
        </Reveal>

        <div className="relative mt-12">
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-[46px] hidden h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent lg:block"
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((step, index) => (
              <Reveal key={step.id} delay={index * 0.07} className="h-full">
                <div className="glow-card relative flex h-full flex-col rounded-2xl border border-white/[0.06] p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-semibold text-white/15">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Badge variant="accent" className="text-[12px]">
                      {step.duration}
                    </Badge>
                  </div>

                  <h3 className="mt-4 text-[17px] font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-slate-400">
                    {step.description}
                  </p>

                  <ul className="mt-auto space-y-1.5 border-t border-white/[0.06] pt-4">
                    {step.deliverables.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-[13.5px] text-slate-400"
                      >
                        <Check className="h-3 w-3 shrink-0 text-emerald-400" strokeWidth={3} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
