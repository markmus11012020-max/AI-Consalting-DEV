import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  labelledBy?: string;
}

/**
 * Базовая секция страницы.
 *
 * `overflow-x-clip` (а не `overflow-x-hidden`) обрезает декоративные свечения
 * по горизонтали, но не создаёт scroll-контейнер — поэтому `lg:sticky`
 * внутри калькулятора продолжает работать.
 */
export function Section({ id, children, className, labelledBy }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "relative overflow-x-clip py-20 sm:py-24 lg:py-28",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SectionDivider() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto h-px w-full max-w-6xl bg-gradient-to-r from-transparent via-white/10 to-transparent"
    />
  );
}
