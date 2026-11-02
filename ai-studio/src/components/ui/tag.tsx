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
          "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground",
        tone === "indigo" &&
          "border-primary/25 bg-primary/10 text-primary hover:border-primary/50 hover:bg-primary/15",
        tone === "purple" &&
          "border-accent/25 bg-accent/10 text-accent hover:border-accent/50 hover:bg-accent/15",
        className,
      )}
      {...props}
    />
  );
}
