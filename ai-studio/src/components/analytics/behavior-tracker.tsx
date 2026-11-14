"use client";

import { useEffect } from "react";

import { initMetrics } from "@/lib/metrics/client";

export function BehaviorTracker() {
  useEffect(() => initMetrics(), []);
  return null;
}
