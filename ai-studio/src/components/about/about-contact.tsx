import {
  Code2,
  Download,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/glow-card";
import { ABOUT_CONTACTS, ABOUT_PROFILE } from "@/lib/about";
import { SITE } from "@/lib/site";

const CONTACT_ICONS = {
  telegram: Send,
  email: Mail,
  phone: Phone,
  github: Code2,
} as const;

export function AboutContact() {
  return (
    <Section id="contact" labelledBy="about-contact-title" className="pb-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_600px_at_50%_0%,rgba(79,70,229,0.12),transparent_70%)]"
      />

      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
          <Reveal>
            <Badge variant="accent" className="gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              Открыта к предложениям
            </Badge>

            <h2
              id="about-contact-title"
              className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
            >
              Обсудим роль{" "}
              <span className="text-gradient">или проект</span>
            </h2>

            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-[18px]">
              Full-time, удалённо / гибрид / офис, Самара. Готова к редким
              командировкам. Условия обсуждаются на созвоне — без зарплаты в
              публичном профиле.
            </p>

            <div className="mt-6 flex flex-col gap-2 text-[14px] text-muted-foreground">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                {ABOUT_PROFILE.location}
              </p>
              <p>
                <span className="font-medium text-foreground">
                  {SITE.company.legalName}
                </span>
                , самозанятая (НПД). Работа по договору, чек через «Мой налог».
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <a href={ABOUT_PROFILE.pdfHref} download>
                  Скачать резюме PDF
                  <Download className="h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                <a href={ABOUT_PROFILE.telegram} target="_blank" rel="noreferrer noopener">
                  Написать в Telegram
                  <Send className="h-4 w-4" />
                </a>
              </Button>
            </div>

            <p className="mt-3 text-[13px] text-muted-foreground">
              Для HR-систем доступна{" "}
              <a
                href={ABOUT_PROFILE.docxHref}
                download
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                версия в DOCX
              </a>
              .
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <GlowCard className="p-6 sm:p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Прямые контакты
              </p>

              <ul className="mt-4 space-y-3">
                {ABOUT_CONTACTS.map((contact) => {
                  const Icon = CONTACT_ICONS[contact.id];
                  const isExternal = contact.href.startsWith("http");

                  return (
                    <li key={contact.id}>
                      <a
                        href={contact.href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noreferrer noopener" : undefined}
                        className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 transition-all duration-300 hover:border-primary/35 hover:bg-primary/[0.04]"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-primary transition-colors group-hover:border-primary/30 group-hover:bg-primary/10">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[11.5px] uppercase tracking-wide text-muted-foreground">
                            {contact.label}
                          </span>
                          <span className="block truncate text-[15px] font-medium text-foreground">
                            {contact.value}
                          </span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-5 rounded-xl border border-border bg-muted/35 p-4">
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  Предпочтительный канал — Telegram. Для документов и ТЗ —
                  e-mail. Резюме в PDF доступно без регистрации.
                </p>
              </div>
            </GlowCard>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
