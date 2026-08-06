// src/components/alunos/AlunoDocumentos.tsx
import { Download, FileText, FileUp } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui-kit/primitives";
import type { DocumentoAluno } from "@/types";

interface AlunoDocumentosProps {
  readonly documentos?: readonly DocumentoAluno[];
}

export function AlunoDocumentos({ documentos = [] }: AlunoDocumentosProps) {
  const handleDownload = (doc: DocumentoAluno) => {
    if (doc.url) {
      window.open(doc.url, "_blank", "noopener,noreferrer");
      return;
    }
    toast.info(`Download do arquivo "${doc.nome}" não está disponível no momento.`);
  };

  return (
    <SectionCard title="Documentos" description="Arquivos anexados ao cadastro">
      {documentos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
          <FileUp className="size-8 mb-2 stroke-[1.5] text-muted-foreground/60" />
          <p className="text-sm font-medium">Nenhum documento anexado</p>
          <p className="text-xs text-muted-foreground/80 mt-0.5">
            Os arquivos relativos ao aluno aparecerão nesta seção.
          </p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {documentos.map((d, index) => {
            const key = d.id || `${d.nome}-${index}`;
            return (
              <li
                key={key}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:bg-muted/30"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground" title={d.nome}>
                    {d.nome}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {d.tipo ?? "PDF"} {d.tamanho ? `· ${d.tamanho}` : ""}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDownload(d)}
                  aria-label={`Baixar ${d.nome}`}
                  title="Baixar documento"
                  className="shrink-0 text-muted-foreground hover:text-foreground"
                >
                  <Download className="size-4" />
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </SectionCard>
  );
}