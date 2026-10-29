import * as React from "react";

import { cn } from "@/lib/utils";

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export function GlowCard({
  className,
  interactive = false,
  ...props
}: GlowCardProps) {
  return (
    <div
      className={cn(
        "glow-card rounded-2xl border border-white/[0.06]",
        interactive && "glow-card-hover",
        className,
      )}
      {...props}
    />
  );
}
