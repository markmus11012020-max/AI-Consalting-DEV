"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Menu, Sparkles, X } from "lucide-react";

import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { useActiveSection } from "@/hooks/use-active-section";
import { HEADER_NAV, SECTION_IDS } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeId = useActiveSection(SECTION_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || menuOpen
          ? "border-b border-white/[0.07] bg-[#030712]/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:h-[72px] sm:px-8">
        <a
          href="#top"
          className="group flex items-center gap-2.5 rounded-xl outline-none"
          aria-label="AI.STUDIO — на главную"
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-500 to-purple-500 shadow-[0_8px_24px_-8px_rgba(99,102,241,0.9)] transition-transform duration-300 group-hover:scale-105">
            <Sparkles className="h-[18px] w-[18px] text-white" strokeWidth={2.2} />
          </span>
          <span className="font-display text-[16px] font-bold tracking-[0.14em] text-white">
            AI<span className="text-slate-500">.</span>STUDIO
          </span>
        </a>

        <nav aria-label="Основная навигация" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {HEADER_NAV.map((item) => {
              const isActive = activeId === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors",
                      isActive
                        ? "text-white"
                        : "text-slate-400 hover:text-slate-100",
                    )}
                  >
                    {item.label}
                    {isActive ? (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-3 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent"
                      />
                    ) : null}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            size="sm"
            className="hidden h-9 px-4 text-[14.5px] sm:inline-flex"
          >
            <a href="#contact">
              Связаться
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </Button>

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-200 transition-colors hover:bg-white/[0.08] lg:hidden"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div id="mobile-navigation">
        <MobileNav
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          activeId={activeId}
        />
      </div>
    </header>
  );
}
