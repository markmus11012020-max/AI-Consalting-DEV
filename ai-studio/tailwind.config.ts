import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        background: "#030712",
        foreground: "#f4f4f5",
        surface: {
          DEFAULT: "#090d16",
          elevated: "#0d1424",
        },
        border: "rgba(255, 255, 255, 0.08)",
        input: "rgba(255, 255, 255, 0.10)",
        ring: "#6366f1",
        primary: {
          DEFAULT: "#4f46e5",
          foreground: "#ffffff",
          soft: "#6366f1",
        },
        accent: {
          DEFAULT: "#a855f7",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#111827",
          foreground: "#f4f4f5",
        },
        muted: {
          DEFAULT: "#111827",
          foreground: "#a1a1aa",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "#090d16",
          foreground: "#f4f4f5",
        },
        popover: {
          DEFAULT: "#090d16",
          foreground: "#f4f4f5",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: [
          "var(--font-manrope)",
          "var(--font-inter)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        // Базовый кегль поднят для читаемости: 13px вместо 12px, 15px вместо 14px.
        xs: ["0.8125rem", { lineHeight: "1.25rem" }],
        sm: ["0.9375rem", { lineHeight: "1.5rem" }],
        "display-sm": ["2.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-md": ["3rem", { lineHeight: "1.08", letterSpacing: "-0.025em" }],
        "display-lg": ["3.75rem", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        glow: "0 0 60px -12px rgba(79, 70, 229, 0.45)",
        "glow-sm": "0 0 32px -10px rgba(168, 85, 247, 0.45)",
        card: "0 24px 60px -30px rgba(0, 0, 0, 0.9)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-64": "64px 64px",
      },
      keyframes: {
        "pulse-slow": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(0.85)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          from: { backgroundPosition: "-200% 0" },
          to: { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "pulse-slow": "pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in-up": "fade-in-up 0.7s ease-out both",
        shimmer: "shimmer 8s linear infinite",
        float: "float 7s ease-in-out infinite",
        "accordion-down": "accordion-down 0.25s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
