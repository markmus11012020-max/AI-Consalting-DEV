"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app] unhandled error", error);
  }, [error]);

  return (
    <main className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-5 py-28">
      <div aria-hidden="true" className="absolute inset-0 bg-radial-glow" />

      <div className="relative max-w-md text-center">
        <h1 className="text-2xl font-semibold text-white sm:text-3xl">
          Что-то пошло не так
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          Ошибка уже записана в лог. Попробуйте обновить страницу — если не
          поможет, напишите в Telegram.
        </p>

        <Button className="mt-7" onClick={reset}>
          <RotateCcw className="h-4 w-4" />
          Попробовать снова
        </Button>
      </div>
    </main>
  );
}
