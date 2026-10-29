"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Загружает только DOM-анимации вместо полного рантайма framer-motion.
 * Вместе с `m.div` вместо `motion.div` это экономит ~20 КБ первого бандла.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
