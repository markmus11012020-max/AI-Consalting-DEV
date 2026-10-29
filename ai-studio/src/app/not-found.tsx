import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-5 py-32">
      <div aria-hidden="true" className="absolute inset-0 bg-radial-glow" />

      <div className="relative text-center">
        <p className="font-mono text-sm tracking-[0.3em] text-indigo-400">404</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Такой страницы нет
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-400">
          Возможно, ссылка устарела. Вернитесь на главную — там калькулятор,
          проекты и форма заявки.
        </p>

        <Button asChild size="lg" className="mt-8">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            На главную
          </Link>
        </Button>
      </div>
    </main>
  );
}
