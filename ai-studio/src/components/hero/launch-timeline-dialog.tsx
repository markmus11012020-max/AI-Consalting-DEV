"use client";

import { ArrowRight, CalendarClock } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LAUNCH_STAGES } from "@/lib/content";
import { cn } from "@/lib/utils";

interface LaunchTimelineDialogProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Кнопка «зависит от объема проекта» в подзаголовке Hero.
 * Открывает модалку со сроками запуска и ведёт к форме заявки.
 */
export function LaunchTimelineDialog({
  children,
  className,
}: LaunchTimelineDialogProps) {
  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          "inline rounded-[4px] font-medium text-primary underline decoration-primary/40 decoration-dotted decoration-2 underline-offset-[3px]",
          "transition-colors hover:text-primary-soft hover:decoration-primary/70",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          className,
        )}
        aria-haspopup="dialog"
      >
        {children}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-primary">
            <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
            Сроки запуска
          </span>
          <DialogTitle>От чего зависят сроки запуска?</DialogTitle>
          <DialogDescription>
            Срок зависит от количества сценариев, интеграций и требований к
            безопасности. Ниже — три уровня сложности с реальными диапазонами.
          </DialogDescription>
        </DialogHeader>

        <ol className="mt-6 space-y-3">
          {LAUNCH_STAGES.map((stage, index) => (
            <li
              key={stage.id}
              className="relative rounded-xl border border-border bg-card/60 p-4 transition-colors hover:border-primary/30"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border bg-background font-mono text-[11.5px] text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[15px] font-semibold text-foreground">
                    {stage.title}
                  </p>
                </div>
                <span className="rounded-full border border-accent/25 bg-accent/10 px-2.5 py-0.5 font-mono text-[12px] font-medium text-accent">
                  {stage.term}
                </span>
              </div>
              <p className="mt-2 pl-[2.1rem] text-[14px] leading-relaxed text-muted-foreground">
                {stage.description}
              </p>
            </li>
          ))}
        </ol>

        <DialogFooter>
          <a
            href="#contact"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-[0_14px_40px_-16px_rgba(79,70,229,0.65)] transition-all hover:bg-primary-soft sm:w-auto"
          >
            Узнать точный срок для моей задачи
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
