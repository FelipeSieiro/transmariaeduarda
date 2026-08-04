import { SectionCard } from "@/components/ui-kit/primitives";
import type { Aluno } from "@/data/mock";

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

interface AlunoDadosPessoaisProps {
  aluno: Aluno;
}

export function AlunoDadosPessoais({ aluno }: AlunoDadosPessoaisProps) {
  return (
    <SectionCard
      title="Dados pessoais"
      description="Informações cadastrais do aluno"
    >
      <div className="grid grid-cols-2 gap-4">
        <Campo
          label="Matrícula"
          value={`ALU-${aluno.id.slice(0, 8).toUpperCase()}`}
        />
        <Campo label="Nascimento" value={aluno.nascimento} />
        <Campo label="Escola" value={aluno.escola} />
        <Campo label="Série" value={aluno.serie} />
        <Campo label="Turno" value={aluno.turno} />
        <Campo label="Aluno desde" value={aluno.desde} />
      </div>
    </SectionCard>
  );
}