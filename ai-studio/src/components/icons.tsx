import {
  Brain,
  Server,
  ShieldCheck,
  Bot,
  Database,
  FileText,
  Workflow,
  Layers,
  Lock,
  Cpu,
  ChartNoAxesColumn,
  Target,
  Headset,
  Receipt,
  Users,
  type LucideIcon,
} from "lucide-react";

import type { IconName } from "@/types";

const ICONS: Record<IconName, LucideIcon> = {
  brain: Brain,
  server: Server,
  shield: ShieldCheck,
  bot: Bot,
  database: Database,
  "file-text": FileText,
  workflow: Workflow,
  layers: Layers,
  lock: Lock,
  cpu: Cpu,
  chart: ChartNoAxesColumn,
  target: Target,
  headset: Headset,
  receipt: Receipt,
  users: Users,
};

export function Icon({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  const Component = ICONS[name] ?? Brain;
  return <Component className={className} aria-hidden="true" />;
}
