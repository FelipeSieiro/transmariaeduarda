// src/components/alunos/AlunoDadosPessoais.tsx
import { SectionCard } from "@/components/ui-kit/primitives";
import { Calendar, GraduationCap, Hash, School, SunMedium, UserCheck } from "lucide-react";
import type { ReactNode } from "react";

interface CampoProps {
  readonly label: string;
  readonly value?: string | null;
  readonly icon?: ReactNode;
  readonly isMono?: boolean;
}

function Campo({ label, value, icon, isMono }: CampoProps) {
  const hasValue = value && value.trim() !== "";
  const displayValue = hasValue ? value : "—";

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0">
      <div className="flex items-center gap-2.5 text-muted-foreground">
        {icon && <span className="opacity-70">{icon}</span>}
        <span className="text-xs font-medium tracking-wide">
          {label}
        </span>
      </div>
      <span
        className={`text-xs font-semibold text-foreground tracking-tight text-right break-words max-w-[60%] ${
          isMono ? "font-mono" : ""
        }`}
      >
        {displayValue}
      </span>
    </div>
  );
}

function formatarData(dataIso?: string | null): string {
  if (!dataIso || dataIso === "-") return "—";
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
    ? `ALU-${String(dados.id).slice(0, 8).toUpperCase()}`
    : "—";

  const nomeEscola =
    typeof dados.escola === "string"
      ? dados.escola
      : dados.escola?.nome ?? dados.escolas?.nome ?? "—";

  const dataNascimento = dados.nascimento || dados.data_nascimento;
  const alunoDesde = dados.desde || dados.data_inicio;

  return (
    <SectionCard
      title="Dados Pessoais"
      description="Informações cadastrais e escolares do aluno"
    >
      <div className="flex flex-col rounded-xl border border-border/40 bg-muted/20 px-4 py-1">
        <Campo
          label="Matrícula"
          value={matricula}
          icon={<Hash className="size-3.5" />}
          isMono
        />
        <Campo
          label="Nascimento"
          value={formatarData(dataNascimento)}
          icon={<Calendar className="size-3.5" />}
        />
        <Campo
          label="Escola"
          value={nomeEscola}
          icon={<School className="size-3.5" />}
        />
        <Campo
          label="Série"
          value={dados.serie}
          icon={<GraduationCap className="size-3.5" />}
        />
        <Campo
          label="Turno"
          value={dados.turno}
          icon={<SunMedium className="size-3.5" />}
        />
        <Campo
          label="Aluno desde"
          value={formatarData(alunoDesde)}
          icon={<UserCheck className="size-3.5" />}
        />
      </div>
    </SectionCard>
  );
}