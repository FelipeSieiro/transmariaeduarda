import type { ReactNode } from "react";

interface TableCardProps {
  // Rótulo exibido na faixa superior do card.
  label?: string;
  action?: ReactNode;
  // Mensagem exibida quando a listagem está vazia.
  emptyMessage: string;
  isEmpty: boolean;
  loading?: boolean;
  children: ReactNode;
}

// Moldura das tabelas das listagens (faixa de título, estado vazio e scroll horizontal).
export function TableCard({
  label = "Listagem principal",
  action,
  emptyMessage,
  isEmpty,
  loading = false,
  children,
}: TableCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card/50 shadow-2xs">
      <div className="flex items-center justify-between border-b border-border/40 bg-muted/20 px-4 py-3">
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
        {action}
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-muted-foreground animate-pulse">
          Carregando...
        </div>
      ) : isEmpty ? (
        <div className="p-12 text-center text-xs text-muted-foreground">
          {emptyMessage}
        </div>
      ) : (
        <div className="overflow-x-auto">{children}</div>
      )}
    </div>
  );
}
