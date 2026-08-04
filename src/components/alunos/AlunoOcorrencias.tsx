import { MessageSquareWarning } from "lucide-react";

import { SectionCard } from "@/components/ui-kit/primitives";
import type { Aluno } from "@/data/mock";

interface AlunoOcorrenciasProps {
  ocorrencias: Aluno["ocorrencias"];
}

export function AlunoOcorrencias({ ocorrencias }: AlunoOcorrenciasProps) {
  return (
    <SectionCard
      title="Ocorrências"
      description="Registros operacionais vinculados ao aluno"
      bodyClassName="p-0"
    >
      <ul className="divide-y divide-border">
        {ocorrencias.map((o) => (
          <li key={o.data + o.tipo} className="flex items-start gap-3 px-5 py-4">
            <span
              className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl ${
                o.gravidade === "alta"
                  ? "bg-destructive/12 text-destructive"
                  : o.gravidade === "media"
                    ? "bg-warning/15 text-warning"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              <MessageSquareWarning className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{o.tipo}</p>
              <p className="text-xs text-muted-foreground">{o.descricao}</p>
            </div>
            <span className="text-xs text-muted-foreground">{o.data}</span>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}