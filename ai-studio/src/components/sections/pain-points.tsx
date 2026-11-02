import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Icon } from "@/components/icons";
import { GlowCard } from "@/components/ui/glow-card";
import { PAIN_POINTS } from "@/lib/content";

export function PainPoints() {
  return (
    <Section id="pains" labelledBy="pains-title">
      <Container>
        <Reveal>
          <SectionHeading
            id="pains-title"
            eyebrow="Знакомая ситуация?"
            title={
              <>
                ИИ уже пробовали, но{" "}
                <span className="text-gradient">до продакшена не дошло</span>
              </>
            }
            description="Мы закрываем разрыв между «красивым демо» и рабочим сервисом, которым пользуются каждый день."
          />
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {PAIN_POINTS.map((item, index) => (
            <Reveal key={item.id} delay={(index % 2) * 0.07} className="h-full">
              <GlowCard className="flex h-full flex-col p-6 sm:p-7">
                <div className="flex items-start gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                    <Icon name={item.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-[18px] font-semibold leading-tight text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>

                <p className="mt-auto flex items-start gap-2 border-t border-border pt-5 text-[14.5px] font-medium text-success">
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0" />
                  {item.result}
                </p>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
