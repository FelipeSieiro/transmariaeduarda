import { Home, MapPin } from "lucide-react";

import { SectionCard } from "@/components/ui-kit/primitives";
import type { Aluno } from "@/data/mock";

interface AlunoEnderecoProps {
  aluno: Aluno;
}

export function AlunoEndereco({ aluno }: AlunoEnderecoProps) {
  return (
    <SectionCard
      title="Endereço"
      description="Ponto de embarque e desembarque"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Home className="mt-0.5 size-4 shrink-0 text-primary" />
          <div className="min-w-0">
            <p className="text-sm font-medium">{aluno.endereco}</p>
            <p className="text-xs text-muted-foreground">{aluno.cidade}</p>
          </div>
        </div>

        <div className="relative h-40 overflow-hidden rounded-xl border border-border bg-muted">
          <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] [background-size:26px_26px]" />
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
            <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground">
              <MapPin className="size-4" />
            </span>
            <span className="mt-2 rounded-lg bg-card px-2 py-1 text-[11px] font-medium shadow-sm">
              {aluno.bairro}
            </span>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}