import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("surface-card flex flex-col", className)}>
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-5 py-4">
        <div className="min-w-0">
          <h3 className="truncate font-display text-sm font-semibold">{title}</h3>
          {description && <p className="truncate text-xs text-muted-foreground">{description}</p>}
        </div>
        {action}
      </header>
      <div className={cn("flex-1 p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="font-display text-sm font-semibold">{title}</p>
        <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
          {Array.from({ length: cols }).map((__, c) => (
            <Skeleton key={c} className="h-9 rounded-lg" />
          ))}
        </div>
      ))}
    </div>
  );
}

const statusStyles: Record<string, string> = {
  ativo: "bg-success/12 text-success",
  inativo: "bg-muted text-muted-foreground",
  suspenso: "bg-warning/15 text-warning",
  pago: "bg-success/12 text-success",
  pendente: "bg-warning/15 text-warning",
  atrasado: "bg-destructive/12 text-destructive",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium capitalize",
        statusStyles[status] ?? "bg-muted text-muted-foreground",
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
