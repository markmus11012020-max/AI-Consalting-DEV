import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[12.5px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-purple-400"
          />
          {eyebrow}
        </p>
      ) : null}

      <h2
        id={id}
        className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
      >
        {title}
      </h2>

      {description ? (
        <p className="mt-4 text-base leading-relaxed text-slate-400 sm:text-[18px]">
          {description}
        </p>
      ) : null}
    </div>
  );
}
