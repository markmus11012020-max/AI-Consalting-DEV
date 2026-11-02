import { Lock } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Icon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { TRUST } from "@/lib/content";

export function Trust() {
  return (
    <Section id="trust" labelledBy="trust-title">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6 sm:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
          />

          <div className="relative grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            <Reveal>
              <Badge variant="accent" className="gap-2">
                <Lock className="h-3 w-3" />
                Безопасность и комплаенс
              </Badge>

              <SectionHeading
                id="trust-title"
                className="mt-5 max-w-md"
                title={
                  <>
                    Данные остаются{" "}
                    <span className="text-gradient">под вашим контролем</span>
                  </>
                }
                description="Маскирование, разграничение доступа и аудит решений встроены в архитектуру с первого дня. Не как надстройка перед аудитом."
              />

              <p className="mt-6 rounded-xl border border-border bg-card p-4 text-[14px] leading-relaxed text-muted-foreground">
                Работаем по договору и NDA. Данные клиента не используются для
                обучения внешних моделей без отдельного письменного соглашения.
              </p>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2">
              {TRUST.map((item, index) => (
                <Reveal key={item.id} delay={index * 0.06} className="h-full">
                  <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/25 hover:bg-primary/10">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-primary">
                      <Icon name={item.icon} className="h-4 w-4" />
                    </span>
                    <h3 className="mt-3.5 text-[15px] font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
