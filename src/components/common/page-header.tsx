import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

interface ListPageHeaderProps {
  title: string;
  subtitle: string;
  actions?: ReactNode;
}

// Cabeçalho das listagens (título + contagem + ações).
export function ListPageHeader({
  title,
  subtitle,
  actions,
}: ListPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border/40 pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
      </div>

      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

interface DetailPageHeaderProps {
  title: string;
  subtitle?: ReactNode;
  icon: LucideIcon;
  backTo: string;
  actions?: ReactNode;
}

// Cabeçalho das telas de detalhe e formulário (voltar + ícone + título + ações).
export function DetailPageHeader({
  title,
  subtitle,
  icon: Icon,
  backTo,
  actions,
}: DetailPageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl text-muted-foreground hover:text-foreground"
          aria-label="Voltar"
          onClick={() => navigate(backTo)}
        >
          <ArrowLeft className="size-4" />
        </Button>

        <span className="inline-flex rounded-xl bg-primary/10 p-2 text-primary">
          <Icon className="size-5" />
        </span>

        <div className="min-w-0 space-y-0.5">
          <h1 className="truncate font-display text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {subtitle && (
            <div className="text-sm text-muted-foreground">{subtitle}</div>
          )}
        </div>
      </div>

      {actions && <div className="flex gap-2">{actions}</div>}
    </header>
  );
}
