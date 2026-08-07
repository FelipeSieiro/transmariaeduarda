import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type StatCardTone = "primary" | "success" | "warning" | "info";

const tones: Record<StatCardTone, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-emerald-500/10 text-emerald-500",
  warning: "bg-amber-500/10 text-amber-500",
  info: "bg-sky-500/10 text-sky-500",
};

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: StatCardTone;
}

// Card compacto de métrica usado nos resumos das listagens.
export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
}: StatCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 p-3.5 shadow-2xs">
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg",
          tones[tone],
        )}
      >
        <Icon className="size-4" />
      </span>

      <div className="min-w-0">
        <p className="truncate text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="text-lg font-bold leading-tight text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}
