import { Check } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Icon } from "@/components/icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { STACK_GROUPS } from "@/lib/content";

export function TechStack() {
  return (
    <Section id="tech" labelledBy="tech-title">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <Reveal>
            <SectionHeading
              id="tech-title"
              eyebrow="Технологии"
              title={
                <>
                  Стек — под задачу,{" "}
                  <span className="text-gradient">а не наоборот</span>
                </>
              }
              description="Не продаём «модный стек». Выбираем инструменты под нагрузку, данные и требования регуляторов. Полный список — в аккордеоне."
            />
            <p className="mt-6 rounded-xl border border-border bg-card p-4 text-[14px] leading-relaxed text-muted-foreground">
              В основе — Python/FastAPI, Java/Spring Boot, PostgreSQL, Docker и
              Yandex Cloud. Для торговых систем — Hyperliquid, dYdX, GMX,
              асинхронный Python и риск-контур.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <Accordion type="multiple" className="space-y-3">
              {STACK_GROUPS.map((group) => (
                <AccordionItem key={group.id} value={group.id}>
                  <AccordionTrigger>
                    <span className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                        <Icon name={group.icon} className="h-4 w-4" />
                      </span>
                      <span className="text-left">
                        <span className="block">{group.title}</span>
                        <span className="mt-0.5 block text-[12.5px] font-normal text-muted-foreground">
                          {group.summary}
                        </span>
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="flex gap-2 text-[14px] leading-relaxed text-muted-foreground"
                        >
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
