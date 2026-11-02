"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

export function ThemeToaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      position="top-center"
      toastOptions={{
        style: {
          background: "rgb(var(--card))",
          border: "1px solid rgb(var(--border))",
          color: "rgb(var(--foreground))",
        },
      }}
    />
  );
}
