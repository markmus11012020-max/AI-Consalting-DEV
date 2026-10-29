import * as React from "react";

import { cn } from "@/lib/utils";

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: "default" | "indigo" | "purple";
}

export function Tag({ className, tone = "default", ...props }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex cursor-default items-center rounded-md border px-2 py-1 text-[12.5px] font-medium tracking-wide transition-colors duration-300",
        tone === "default" &&
          "border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/25 hover:text-slate-200",
        tone === "indigo" &&
          "border-indigo-400/25 bg-indigo-500/[0.08] text-indigo-200 hover:border-indigo-400/60 hover:bg-indigo-500/15",
        tone === "purple" &&
          "border-purple-400/25 bg-purple-500/[0.08] text-purple-200 hover:border-purple-400/60 hover:bg-purple-500/15",
        className,
      )}
      {...props}
    />
  );
}
