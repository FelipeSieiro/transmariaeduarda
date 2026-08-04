import { Images } from "lucide-react";

import { SectionCard } from "@/components/ui-kit/primitives";

export function AlunoFotos() {
  return (
    <SectionCard title="Fotos" description="Galeria de registros do aluno">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex aspect-square flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/40"
          >
            <Images className="size-5" />
            <span className="text-[11px]">Foto {i + 1}</span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}