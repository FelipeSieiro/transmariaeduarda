import { SectionCard } from "@/components/ui-kit/primitives";
import { brlExato } from "@/data/mock";

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
  contrato: any;
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

  // Mapeamento seguro suportando tanto snake_case quanto camelCase
  const numero = contrato.numero || "";
  const inicio = contrato.inicio || contrato.data_inicio || "";
  const fim = contrato.fim || contrato.data_fim || "";
  const diaVenc = contrato.vencimentoDia ?? contrato.dia_vencimento ?? "";
  const formaPagamento = contrato.formaPagamento || contrato.forma_pagamento || "-";
  const valor = contrato.valorMensalidade ?? contrato.valor_mensalidade ?? 0;
  const observacoes = contrato.observacoes || "";

  return (
    <SectionCard
      title={`Contrato ${numero}`}
      description="Vigência e condições comerciais"
    >
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <Campo label="Número" value={numero} />
        <Campo label="Início" value={inicio} />
        <Campo label="Término" value={fim === "-" ? "" : fim} />
        <Campo label="Vencimento" value={diaVenc ? `Dia ${diaVenc}` : ""} />
        <Campo label="Pagamento" value={formaPagamento} />
        <Campo
          label="Mensalidade"
          value={typeof valor === "number" ? brlExato(valor) : String(valor)}
        />
      </div>
      <p className="mt-4 rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground">
        {observacoes || "Sem observações cadastradas."}
      </p>
    </SectionCard>
  );
}