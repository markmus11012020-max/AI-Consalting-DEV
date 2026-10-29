import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter, Manrope } from "next/font/google";
import { Toaster } from "sonner";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MotionProvider } from "@/components/motion/motion-provider";
import { SITE } from "@/lib/site";

import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const title = "AI.STUDIO — Генеративный ИИ для реального бизнеса";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: title,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.company.legalName }],
  creator: SITE.company.legalName,
  keywords: [
    "генеративный ИИ",
    "ИИ-агенты",
    "RAG-системы",
    "внедрение ИИ",
    "разработка MVP",
    "ФЗ-152",
    "внедрение ИИ под ключ",
    "консалтинговая компания",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: SITE.name,
    title,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#030712",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`dark ${inter.variable} ${manrope.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <a
          href="#top"
          className="sr-only z-[100] rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Перейти к содержимому
        </a>

        <MotionProvider>
          <Header />
          {children}
          <Footer />
        </MotionProvider>

        <Toaster
          theme="dark"
          position="top-center"
          toastOptions={{
            style: {
              background: "#0b1120",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#f4f4f5",
            },
          }}
        />
      </body>
    </html>
  );
}
