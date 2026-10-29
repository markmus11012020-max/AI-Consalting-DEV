"use client";

import { useEffect } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ArrowRight, Mail, Phone, Send, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NAV, SITE } from "@/lib/site";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  activeId: string | null;
}

export function MobileNav({ open, onClose, activeId }: MobileNavProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <m.div
          key="mobile-nav"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="lg:hidden"
        >
          <div className="border-t border-white/[0.06] bg-[#050912]/95 backdrop-blur-xl">
            <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-6xl flex-col px-5 py-6 sm:min-h-[calc(100dvh-4.5rem)] sm:px-8">
              <nav aria-label="Мобильная навигация">
                <ul className="flex flex-col gap-1">
                  {NAV.map((item) => {
                    const isActive = activeId === item.id;
                    return (
                      <li key={item.id}>
                        <a
                          href={item.href}
                          onClick={onClose}
                          className={`flex items-center justify-between rounded-xl px-3 py-3 text-[16px] transition-colors ${
                            isActive
                              ? "bg-indigo-500/10 text-white"
                              : "text-slate-300 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          {item.label}
                          <ArrowRight className="h-4 w-4 opacity-40" />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="mt-5 grid gap-2 border-t border-white/[0.06] pt-5 text-sm text-slate-400">
                <a
                  href={SITE.contacts.emailHref}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 hover:text-white"
                >
                  <Mail className="h-4 w-4 text-indigo-300" />
                  {SITE.contacts.email}
                </a>
                <a
                  href={SITE.contacts.telegramUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 hover:text-white"
                >
                  <Send className="h-4 w-4 text-indigo-300" />
                  {SITE.contacts.telegram}
                </a>
                <a
                  href={SITE.contacts.phoneHref}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 hover:text-white"
                >
                  <Phone className="h-4 w-4 text-indigo-300" />
                  {SITE.contacts.phone}
                </a>
              </div>

              <div className="mt-auto pt-8">
                <Button asChild size="lg" className="w-full">
                  <a href="#contact" onClick={onClose}>
                    Связаться
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>

                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-full py-2 text-xs uppercase tracking-widest text-slate-500 hover:text-slate-300"
                >
                  <X className="h-3.5 w-3.5" />
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
