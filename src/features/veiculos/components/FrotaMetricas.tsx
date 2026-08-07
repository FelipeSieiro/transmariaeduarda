import { Bus, CheckCircle2, Users2, Wrench } from "lucide-react";

import { StatCard } from "@/components/common/stat-card";

interface FrotaMetricasProps {
  total: number;
  ativos: number;
  manutencao: number;
  capacidadeTotal: number;
}

export function FrotaMetricas({
  total,
  ativos,
  manutencao,
  capacidadeTotal,
}: FrotaMetricasProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total de Veículos"
        value={total}
        icon={Bus}
        tone="primary"
      />
      <StatCard
        label="Ativos"
        value={ativos}
        icon={CheckCircle2}
        tone="success"
      />
      <StatCard
        label="Em Manutenção"
        value={manutencao}
        icon={Wrench}
        tone="warning"
      />
      <StatCard
        label="Capacidade Total"
        value={
          <>
            {capacidadeTotal}{" "}
            <span className="text-[10px] font-normal text-muted-foreground">
              lugares
            </span>
          </>
        }
        icon={Users2}
        tone="info"
      />
    </div>
  );
}
