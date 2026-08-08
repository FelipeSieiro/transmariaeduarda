// src/components/alunos/AlunoFotos.tsx
import { useState } from "react";
import { Camera, Images, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui-kit/primitives";
import type { FotoAluno } from "@/features/alunos/types/aluno-detalhes";

interface AlunoFotosProps {
  readonly fotos?: readonly FotoAluno[];
  readonly onAddFoto?: () => void;
  readonly onDeleteFoto?: (fotoId: string) => void;
}

export function AlunoFotos({
  fotos = [],
  onAddFoto,
  onDeleteFoto,
}: AlunoFotosProps) {
  const [fotoSelecionada, setFotoSelecionada] = useState<FotoAluno | null>(null);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (onDeleteFoto) {
      onDeleteFoto(id);
      toast.success("Foto removida da galeria.");
    } else {
      toast.info("Ação de remoção não configurada.");
    }
  };

  return (
    <>
      <SectionCard
        title="Fotos"
        description="Galeria de registros do aluno"
        action={
          onAddFoto ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onAddFoto}
              className="h-8 gap-1.5 text-xs"
            >
              <Plus className="size-3.5" />
              <span>Adicionar foto</span>
            </Button>
          ) : undefined
        }
      >
        {fotos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <div className="grid size-12 place-items-center rounded-full bg-muted mb-3">
              <Camera className="size-6 stroke-[1.5] text-muted-foreground/70" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Nenhuma foto cadastrada
            </p>
            <p className="text-xs text-muted-foreground/80 mt-0.5 max-w-xs">
              Adicione fotos do aluno para identificação na rota e controle de segurança.
            </p>
            {onAddFoto && (
              <Button
                variant="outline"
                size="sm"
                onClick={onAddFoto}
                className="mt-4 gap-1.5 text-xs"
              >
                <Plus className="size-3.5" />
                <span>Enviar foto</span>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {fotos.map((foto, index) => (
              <div
                key={foto.id || index}
                onClick={() => setFotoSelecionada(foto)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setFotoSelecionada(foto)}
                className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
              >
                {foto.url ? (
                  <img
                    src={foto.url}
                    alt={foto.descricao || `Foto ${index + 1}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-muted/50 p-2 text-center text-muted-foreground">
                    <Images className="size-6 stroke-[1.5]" />
                    <span className="text-[11px] font-medium truncate w-full">
                      {foto.descricao || `Foto ${index + 1}`}
                    </span>
                  </div>
                )}

                {/* Overlay de Ações no Hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center gap-2">
                  {onDeleteFoto && foto.id && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="size-8 rounded-lg"
                      onClick={(e) => handleDelete(e, foto.id!)}
                      title="Excluir foto"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>

                {foto.legenda && (
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-[10px] text-white truncate">
                    {foto.legenda}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Modal de Preview da Foto */}
      {fotoSelecionada && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setFotoSelecionada(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-card rounded-2xl overflow-hidden border border-border shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">
                {fotoSelecionada.descricao || "Visualização da foto"}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setFotoSelecionada(null)}
                className="size-8 rounded-lg"
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="p-4 flex flex-col items-center justify-center bg-black/90 min-h-[300px]">
              {fotoSelecionada.url ? (
                <img
                  src={fotoSelecionada.url}
                  alt={fotoSelecionada.descricao || "Foto do aluno"}
                  className="max-h-[60vh] w-auto object-contain rounded-lg"
                />
              ) : (
                <div className="text-center text-muted-foreground p-8">
                  <Images className="size-12 mx-auto mb-2 stroke-[1.5]" />
                  <p className="text-sm">Imagem não disponível para exibição.</p>
                </div>
              )}
            </div>

            {fotoSelecionada.legenda && (
              <div className="p-3 bg-muted/30 border-t border-border text-xs text-muted-foreground">
                {fotoSelecionada.legenda}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}