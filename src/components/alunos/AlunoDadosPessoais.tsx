// src/components/alunos/AlunoDadosPessoais.tsx
import { SectionCard } from "@/components/ui-kit/primitives";
import type { Aluno } from "@/types";

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
  if (!dataIso) return "-";
  try {
    const data = new Date(dataIso);
    if (isNaN(data.getTime())) return dataIso;
    return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(data);
  } catch {
    return dataIso;
  }
}

interface AlunoDadosPessoaisProps {
  readonly aluno: Aluno;
}

export function AlunoDadosPessoais({ aluno }: AlunoDadosPessoaisProps) {
  const matricula = aluno.id
    ? `ALU-${aluno.id.slice(0, 8).toUpperCase()}`
    : "-";

  const nomeEscola = typeof aluno.escolas === "string" 
    ? aluno.escolas 
    : aluno.escola?.nome ?? aluno.escolas?.nome ?? "-";

  return (
    <SectionCard
      title="Dados pessoais"
      description="Informações cadastrais do aluno"
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Campo label="Matrícula" value={matricula} />
        <Campo label="Nascimento" value={formatarData(aluno.data_nascimento)} />
        <Campo label="Escola" value={nomeEscola} />
        <Campo label="Série" value={aluno.serie} />
        <Campo label="Turno" value={aluno.turno} />
        <Campo label="Aluno desde" value={formatarData(aluno.data_inicio)} />
      </div>
    </SectionCard>
  );
}