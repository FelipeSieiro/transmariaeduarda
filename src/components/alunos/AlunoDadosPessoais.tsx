// src/components/alunos/AlunoDadosPessoais.tsx
import { SectionCard } from "@/components/ui-kit/primitives";

interface CampoProps {
  readonly label: string;
  readonly value?: string | null;
}

function Campo({ label, value }: CampoProps) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 truncate text-sm font-medium text-foreground">
        {value && value.trim() !== "" ? value : "-"}
      </p>
    </div>
  );
}

function formatarData(dataIso?: string | null): string {
  if (!dataIso || dataIso === "-") return "-";
  try {
    const dataLimpa = dataIso.includes("T") ? dataIso : `${dataIso}T00:00:00Z`;
    const data = new Date(dataLimpa);
    if (isNaN(data.getTime())) return dataIso;
    return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(data);
  } catch {
    return dataIso;
  }
}

interface AlunoDadosPessoaisProps {
  readonly aluno: any;
}

export function AlunoDadosPessoais({ aluno }: AlunoDadosPessoaisProps) {
  if (!aluno) return null;

  const dados = aluno.data || aluno;

  const matricula = dados.id
    ? `ALU-${dados.id.slice(0, 8).toUpperCase()}`
    : "-";

  // Trata escola se vier como string direta ou como objeto aninhado antigo
  const nomeEscola = 
    typeof dados.escola === "string" 
      ? dados.escola 
      : dados.escola?.nome ?? dados.escolas?.nome ?? "-";

  // Mapeando para as chaves reais que vieram no seu console.log (`nascimento` e `desde`)
  const dataNascimento = dados.nascimento || dados.data_nascimento;
  const alunoDesde = dados.desde || dados.data_inicio;

  return (
    <SectionCard
      title="Dados pessoais"
      description="Informações cadastrais do aluno"
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Campo label="Matrícula" value={matricula} />
        <Campo label="Nascimento" value={formatarData(dataNascimento)} />
        <Campo label="Escola" value={nomeEscola} />
        <Campo label="Série" value={dados.serie} />
        <Campo label="Turno" value={dados.turno} />
        <Campo label="Aluno desde" value={formatarData(alunoDesde)} />
      </div>
    </SectionCard>
  );
}