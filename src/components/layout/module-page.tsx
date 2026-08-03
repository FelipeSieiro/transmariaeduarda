import type { LucideIcon } from "lucide-react";
import { Construction, Download, Plus, Search } from "lucide-react";

import { SectionCard, TableSkeleton } from "@/components/ui-kit/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ModulePage({
  titulo,
  descricao,
  icon: Icon,
  destaques,
}: {
  titulo: string;
  descricao: string;
  icon: LucideIcon;
  destaques: Array<{ label: string; valor: string }>;
}) {
  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="size-5" />
          </span>
          <div className="min-w-0">
            <h1 className="truncate font-display text-2xl font-semibold tracking-tight sm:text-3xl">{titulo}</h1>
            <p className="truncate text-sm text-muted-foreground">{descricao}</p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" className="rounded-xl">
            <Download className="size-4" /> Exportar
          </Button>
          <Button className="rounded-xl">
            <Plus className="size-4" /> Novo registro
          </Button>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {destaques.map((d) => (
          <div key={d.label} className="surface-card p-4">
            <p className="truncate text-xs uppercase tracking-wide text-muted-foreground">{d.label}</p>
            <p className="mt-2 font-display text-2xl font-semibold tracking-tight">{d.valor}</p>
          </div>
        ))}
      </div>

      <SectionCard
        title={`Registros de ${titulo.toLowerCase()}`}
        description="Pesquisa instantânea, filtros avançados, ordenação e paginação"
        action={
          <div className="relative w-44 sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Pesquisar…" className="h-9 rounded-xl pl-9" />
          </div>
        }
      >
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-dashed border-border bg-muted/40 p-4">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-gold/15 text-gold-foreground dark:text-gold">
            <Construction className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium">Módulo estruturado e pronto para conteúdo</p>
            <p className="text-xs text-muted-foreground">
              Layout, rota, breadcrumb e design system já aplicados. As tabelas e gráficos deste módulo entram na
              próxima rodada, seguindo o mesmo padrão de Alunos.
            </p>
          </div>
        </div>
        <TableSkeleton rows={6} cols={6} />
      </SectionCard>
    </div>
  );
}
