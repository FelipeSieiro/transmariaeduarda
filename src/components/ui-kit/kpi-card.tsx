import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

export interface KpiCardProps {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
  hint?: string;
  icon: LucideIcon;
  accent?: "primary" | "gold" | "info" | "destructive";
}

const accents: Record<NonNullable<KpiCardProps["accent"]>, string> = {
  primary: "bg-primary/10 text-primary",
  gold: "bg-gold/15 text-gold-foreground dark:text-gold",
  info: "bg-info/10 text-info",
  destructive: "bg-destructive/10 text-destructive",
};

export function KpiCard({
  label,
  value,
  delta,
  trend = "flat",
  hint,
  icon: Icon,
  accent = "primary",
}: KpiCardProps) {
  const TrendIcon = trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;

  return (
    <div className="surface-card group animate-fade-in p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]">
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <span className={cn("grid size-8 shrink-0 place-items-center rounded-xl", accents[accent])}>
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 font-display text-2xl font-semibold tracking-tight">{value}</p>
      <div className="mt-1.5 flex items-center gap-2 text-xs">
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-medium",
              trend === "up" && "bg-success/12 text-success",
              trend === "down" && "bg-destructive/12 text-destructive",
              trend === "flat" && "bg-muted text-muted-foreground",
            )}
          >
            <TrendIcon className="size-3" />
            {delta}
          </span>
        )}
        {hint && <span className="truncate text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}
