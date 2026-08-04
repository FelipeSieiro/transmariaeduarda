// src/components/alunos/AlunoOcorrencias.tsx
import { AlertCircle, CheckCircle2, MessageSquareWarning, ShieldAlert } from "lucide-react";

import { SectionCard } from "@/components/ui-kit/primitives";
import type { OcorrenciaAluno } from "@/types";

interface AlunoOcorrenciasProps {
  readonly ocorrencias?: readonly OcorrenciaAluno[];
}

function obterConfigGravidade(gravidade?: string) {
  switch (gravidade?.toLowerCase()) {
    case "alta":
    case "grave":
    case "danger":
      return {
        badgeClass: "bg-destructive/15 text-destructive",
        icon: ShieldAlert,
      };
    case "media":
    case "moderada":
    case "warning":
      return {
        badgeClass: "bg-amber-500/15 text-amber-500",
        icon: MessageSquareWarning,
      };
    case "baixa":
    case "leve":
    default:
      return {
        badgeClass: "bg-muted text-muted-foreground",
        icon: AlertCircle,
      };
  }
}

function formatarDataOcorrencia(dataIso?: string): string {
  if (!dataIso) return "";
  if (dataIso.includes("/")) return dataIso;
  try {
    const data = new Date(dataIso);
    if (isNaN(data.getTime())) return dataIso;
    return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(data);
  } catch {
    return dataIso;
  }
}

export function AlunoOcorrencias({ ocorrencias = [] }: AlunoOcorrenciasProps) {
  return (
    <SectionCard
      title="Ocorrências"
      description="Registros operacionais vinculados ao aluno"
      bodyClassName="p-0"
    >
      {ocorrencias.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground px-5">
          <div className="grid size-10 place-items-center rounded-full bg-muted mb-2">
            <CheckCircle2 className="size-5 stroke-[1.5] text-emerald-500" />
          </div>
          <p className="text-sm font-medium text-foreground">Nenhuma ocorrência registrada</p>
          <p className="text-xs text-muted-foreground/80 mt-0.5">
            O histórico operacional deste aluno está limpo.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {ocorrencias.map((o, index) => {
            const key = o.id || `${o.data || "data"}-${o.tipo || "tipo"}-${index}`;
            const { badgeClass, icon: IconComponent } = obterConfigGravidade(o.gravidade || o.nivel);
            const dataFormatada = formatarDataOcorrencia(o.data || o.created_at);

            return (
              <li key={key} className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-muted/20">
                <span className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl ${badgeClass}`}>
                  <IconComponent className="size-4" />
                </span>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium text-foreground">
                      {o.tipo || o.titulo || "Ocorrência operacional"}
                    </p>
                    {dataFormatada && (
                      <span className="shrink-0 text-xs text-muted-foreground font-mono">
                        {dataFormatada}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {o.descricao || o.observacao || "Sem descrição detalhada fornecida."}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </SectionCard>
  );
}