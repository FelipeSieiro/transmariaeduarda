import { SectionCard } from "@/components/ui-kit/primitives";
import { brlExato } from "@/data/mock";
import type { Contrato } from "@/services/contratos.service";

function Campo({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 truncate text-sm font-medium">{value || "-"}</p>
    </div>
  );
}

interface AlunoContratoProps {
  contrato: Contrato | null;
}

export function AlunoContrato({ contrato }: AlunoContratoProps) {
  if (!contrato) {
    return (
      <SectionCard
        title="Contrato"
        description="Vigência e condições comerciais"
      >
        <p className="text-sm text-muted-foreground">
          Nenhum contrato encontrado para este aluno.
        </p>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title={`Contrato ${contrato.numero}`}
      description="Vigência e condições comerciais"
    >
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <Campo label="Número" value={contrato.numero} />
        <Campo label="Início" value={contrato.data_inicio} />
        <Campo label="Término" value={contrato.data_fim || ""} />
        <Campo label="Vencimento" value={`Dia ${contrato.dia_vencimento}`} />
        <Campo label="Pagamento" value={contrato.forma_pagamento} />
        <Campo
          label="Mensalidade"
          value={brlExato(contrato.valor_mensalidade)}
        />
      </div>
      <p className="mt-4 rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground">
        {contrato.observacoes || "Sem observações cadastradas."}
      </p>
    </SectionCard>
  );
}