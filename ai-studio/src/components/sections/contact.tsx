import { Mail, Phone, Send } from "lucide-react";

import { LeadForm } from "@/components/lead/lead-form";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { CONTACT_CHANNELS, SITE } from "@/lib/site";

const CONTACT_ICONS = {
  telegram: Send,
  email: Mail,
  phone: Phone,
} as const;

export function Contact() {
  return (
    <Section id="contact" labelledBy="contact-title" className="pb-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_600px_at_50%_0%,rgba(79,70,229,0.12),transparent_70%)]"
      />

      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
          <Reveal>
            <Badge variant="accent" className="gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Открыты к новым проектам
            </Badge>

            <SectionHeading
              id="contact-title"
              className="mt-5"
              title={
                <>
                  Обсудим задачу{" "}
                  <span className="text-gradient">без продающих слайдов</span>
                </>
              }
              description="Расскажите, какой процесс хотите автоматизировать. Ответим с оценкой реализуемости, вариантами архитектуры и честным списком рисков."
            />

            <ul className="mt-8 space-y-3">
              {CONTACT_CHANNELS.map((channel) => {
                const ChannelIcon = CONTACT_ICONS[channel.id];
                return (
                  <li key={channel.id}>
                    <a
                      href={channel.href}
                      target={channel.id === "telegram" ? "_blank" : undefined}
                      rel={
                        channel.id === "telegram"
                          ? "noreferrer noopener"
                          : undefined
                      }
                      className="group flex items-center gap-3.5 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5 transition-all duration-300 hover:border-indigo-400/35 hover:bg-indigo-500/[0.06]"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-indigo-300 transition-colors group-hover:border-indigo-400/30 group-hover:bg-indigo-500/10">
                        <ChannelIcon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[12.5px] uppercase tracking-wide text-slate-500">
                          {channel.label}
                        </span>
                        <span className="block truncate text-[15px] font-medium text-slate-200">
                          {channel.value}
                        </span>
                      </span>
                      <span className="hidden shrink-0 text-[12px] text-slate-600 sm:block">
                        {channel.hint}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
              <p className="text-[14px] leading-relaxed text-slate-400">
                <span className="font-medium text-slate-200">
                  {SITE.company.legalName}
                </span>{" "}
                — {SITE.company.role}. Работаем командой: архитектор ИИ,
                backend- и ML-инженер.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <LeadForm />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
