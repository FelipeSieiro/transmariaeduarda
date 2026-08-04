import { Download, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui-kit/primitives";
import type { Aluno } from "@/data/mock";

interface AlunoDocumentosProps {
  documentos: Aluno["documentos"];
}

export function AlunoDocumentos({ documentos }: AlunoDocumentosProps) {
  return (
    <SectionCard title="Documentos" description="Arquivos anexados ao cadastro">
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {documentos.map((d) => (
          <li
            key={d.nome}
            className="flex items-center gap-3 rounded-xl border border-border p-3"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <FileText className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{d.nome}</p>
              <p className="text-xs text-muted-foreground">
                {d.tipo} · {d.tamanho}
              </p>
            </div>
            <Button variant="ghost" size="icon">
              <Download className="size-4" />
            </Button>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}