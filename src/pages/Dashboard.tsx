// src/pages/Dashboard.tsx

import { Construction, LayoutDashboard, Database, TrendingUp, Bus } from "lucide-react";
import { SectionCard } from "@/components/ui-kit/primitives";

export default function Dashboard() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center justify-center min-h-[70vh] p-6 text-center">
      <div className="mb-6 flex size-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
        <Construction className="size-10" />
      </div>

      <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Página em Construção
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        Estamos finalizando a integração dos dados da sua base. Em breve, este painel apresentará uma análise consolidada em tempo real da sua operação escolar.
      </p>

      <div className="mt-10 grid w-full gap-4 sm:grid-cols-3">
        <StatusItem 
          icon={Database} 
          title="Consolidação" 
          desc="Integrando tabelas de Alunos, Rotas e Financeiro" 
        />
        <StatusItem 
          icon={TrendingUp} 
          title="Analytics" 
          desc="Gerando métricas de receita, fluxo de caixa e ocupação" 
        />
        <StatusItem 
          icon={Bus} 
          title="Operacional" 
          desc="Monitorando frota, motoristas e distribuição escolar" 
        />
      </div>

    </div>
  );
}

function StatusItem({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4">
      <Icon className="size-5 text-primary" />
      <span className="text-sm font-medium text-foreground">{title}</span>
      <span className="text-[11px] text-muted-foreground">{desc}</span>
    </div>
  );
}