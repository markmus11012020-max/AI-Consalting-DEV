import { Mail, Phone, Send, Sparkles } from "lucide-react";

import { Container } from "@/components/layout/container";
import { NAV, SITE } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/[0.07] bg-[#050912]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent"
      />

      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <a href="#top" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500">
                <Sparkles className="h-[18px] w-[18px] text-white" strokeWidth={2.2} />
              </span>
              <span className="font-display text-[16px] font-bold tracking-[0.14em] text-white">
                AI<span className="text-slate-500">.</span>STUDIO
              </span>
            </a>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              {SITE.company.legalName} — {SITE.company.role}. Внедряем
              генеративный ИИ в процессы, где важны качество данных,
              безопасность и предсказуемая стоимость.
            </p>

            <a
              href={`mailto:${SITE.contacts.email}`}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-300 transition-colors hover:border-indigo-400/40 hover:text-white"
            >
              <Mail className="h-4 w-4 text-indigo-300" />
              {SITE.contacts.email}
            </a>
          </div>

          <nav aria-label="Навигация в подвале">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Разделы
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className="text-slate-400 transition-colors hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#contact"
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  Контакты
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Связаться
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={SITE.contacts.telegramUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-2.5 text-slate-400 transition-colors hover:text-white"
                >
                  <Send className="h-4 w-4 text-indigo-300" />
                  {SITE.contacts.telegram}
                </a>
              </li>
              <li>
                <a
                  href={SITE.contacts.phoneHref}
                  className="flex items-center gap-2.5 text-slate-400 transition-colors hover:text-white"
                >
                  <Phone className="h-4 w-4 text-indigo-300" />
                  {SITE.contacts.phone}
                </a>
              </li>
              <li>
                <a
                  href={SITE.contacts.emailHref}
                  className="flex items-center gap-2.5 text-slate-400 transition-colors hover:text-white"
                >
                  <Mail className="h-4 w-4 text-indigo-300" />
                  {SITE.contacts.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/[0.07] pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.name}. Все права защищены.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href="/privacy"
              className="transition-colors hover:text-slate-300"
            >
              Политика обработки персональных данных
            </a>
            <span className="hidden sm:inline text-slate-700">|</span>
            <p>Информация на сайте не является публичной офертой</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
