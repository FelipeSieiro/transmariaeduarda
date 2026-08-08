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
  contrato?: any;
  contratos?: any[];
}

export function AlunoContrato({ contrato, contratos }: AlunoContratoProps) {
  // Usar a lista de contratos se fornecida, senão usar o contrato único
  const listaContratos = contratos && contratos.length > 0 ? contratos : (contrato ? [contrato] : []);

  if (listaContratos.length === 0) {
    return (
      <SectionCard
        title="Contratos"
        description="Vigência e condições comerciais"
      >
        <p className="text-sm text-muted-foreground">
          Nenhum contrato encontrado para este aluno.
        </p>
      </SectionCard>
    );
  }

  return (
    <div className="space-y-4">
      {listaContratos.map((contratoItem: any, index: number) => {
        // Mapeamento seguro suportando tanto snake_case quanto camelCase
        const numero = contratoItem.numero || "";
        const inicio = contratoItem.inicio || contratoItem.data_inicio || "";
        const fim = contratoItem.fim || contratoItem.data_fim || "";
        const diaVenc = contratoItem.vencimentoDia ?? contratoItem.dia_vencimento ?? "";
        const formaPagamento = contratoItem.formaPagamento || contratoItem.forma_pagamento || "-";
        const valor = contratoItem.valorMensalidade ?? contratoItem.valor_mensalidade ?? 0;
        const observacoes = contratoItem.observacoes || "";
        const status = contratoItem.status || "";

        return (
          <SectionCard
            key={contratoItem.id || index}
            title={`Contrato ${numero}`}
            description={`Vigência e condições comerciais • Status: ${status}`}
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
      })}
    </div>
  );
}