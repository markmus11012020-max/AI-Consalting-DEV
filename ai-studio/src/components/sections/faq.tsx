import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ } from "@/lib/content";
import { SITE } from "@/lib/site";

export function Faq() {
  return (
    <Section id="faq" labelledBy="faq-title">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <Reveal>
            <SectionHeading
              id="faq-title"
              eyebrow="FAQ"
              title={
                <>
                  Частые вопросы{" "}
                  <span className="text-gradient">до старта</span>
                </>
              }
              description="Если нужного ответа нет — напишите в Telegram, отвечаем в течение рабочего дня."
            />

            <a
              href={SITE.contacts.telegramUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="group mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[14.5px] text-slate-300 transition-colors hover:border-indigo-400/40 hover:text-white"
            >
              {SITE.contacts.telegram}
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </Reveal>

          <Reveal delay={0.1}>
            <Accordion type="single" collapsible className="space-y-3">
              {FAQ.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
