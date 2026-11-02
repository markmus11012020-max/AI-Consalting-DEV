import { Code2, Mail, Phone, Send } from "lucide-react";

import { Container } from "@/components/layout/container";
import { NAV, SITE } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-surface">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />

      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <a href="#top" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                <span className="font-display text-[18px] font-extrabold text-white">
                  A
                </span>
              </span>
              <span className="font-display text-[17px] font-bold tracking-[0.08em] text-foreground">
                Aillix<span className="text-primary">.</span>
              </span>
            </a>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {SITE.company.legalName} — {SITE.company.role}. Внедряем
              генеративный ИИ в процессы, где важны качество данных,
              безопасность и предсказуемая стоимость.
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              ИНН {SITE.company.inn}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={`mailto:${SITE.contacts.email}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                <Mail className="h-4 w-4 text-primary" />
                {SITE.contacts.email}
              </a>
              <a
                href="https://github.com/markmus11012020-max"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                <Code2 className="h-4 w-4 text-primary" />
                GitHub
              </a>
            </div>
          </div>

          <nav aria-label="Навигация в подвале">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Разделы
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Связаться
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={SITE.contacts.telegramUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Send className="h-4 w-4 text-primary" />
                  {SITE.contacts.telegram}
                </a>
              </li>
              <li>
                <a
                  href={SITE.contacts.telegramSalesUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Send className="h-4 w-4 text-primary" />
                  {SITE.contacts.telegramSales}
                </a>
              </li>
              <li>
                <a
                  href={SITE.contacts.phoneHref}
                  className="flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Phone className="h-4 w-4 text-primary" />
                  {SITE.contacts.phone}
                </a>
              </li>
              <li>
                <a
                  href={SITE.contacts.emailHref}
                  className="flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Mail className="h-4 w-4 text-primary" />
                  {SITE.contacts.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.name}. Все права защищены.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href="/privacy"
              className="transition-colors hover:text-foreground"
            >
              Политика обработки персональных данных
            </a>
            <span className="hidden text-border sm:inline">|</span>
            <p>Информация на сайте не является публичной офертой</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
