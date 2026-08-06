// src/components/alunos/AlunoEndereco.tsx
import { ExternalLink, Home, MapPin, Navigation } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui-kit/primitives";
import type { Aluno } from "@/types";

interface AlunoEnderecoProps {
  readonly aluno: Aluno;
}

export function AlunoEndereco({ aluno }: AlunoEnderecoProps) {
  // Extrai informações tanto se endereco for objeto quanto se for campo solto no aluno
  const enderecoObj = typeof aluno.endereco === "object" && aluno.endereco !== null ? aluno.endereco : null;

  const logradouro = enderecoObj
    ? `${enderecoObj.logradouro || enderecoObj.rua || ""}, ${enderecoObj.numero || "S/N"}${
        enderecoObj.complemento ? ` - ${enderecoObj.complemento}` : ""
      }`
    : typeof aluno.endereco === "string"
    ? aluno.endereco
    : null;

  const bairro = enderecoObj?.bairro ?? aluno.bairro ?? "";
  const cidade = enderecoObj?.cidade ?? aluno.cidade ?? "";
  const estado = enderecoObj?.uf ?? enderecoObj?.estado ?? aluno.estado ?? "";
  const cep = enderecoObj?.cep ?? aluno.cep ?? "";

  const cidadeEstadoCep = [cidade, estado].filter(Boolean).join(" - ") + (cep ? ` · CEP ${cep}` : "");

  const enderecoCompletoFormatado = [logradouro, bairro, cidade, estado]
    .filter(Boolean)
    .join(", ");

  const handleOpenMaps = () => {
    if (!enderecoCompletoFormatado) return;
    const query = encodeURIComponent(enderecoCompletoFormatado);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank", "noopener,noreferrer");
  };

  const temEndereco = Boolean(logradouro || bairro || cidade);

  return (
    <SectionCard
      title="Endereço"
      description="Ponto de embarque e desembarque"
      action={
        temEndereco ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpenMaps}
            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Navigation className="size-3.5" />
            <span>Abrir no Maps</span>
            <ExternalLink className="size-3" />
          </Button>
        ) : undefined
      }
    >
      {!temEndereco ? (
        <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
          <MapPin className="size-8 mb-2 stroke-[1.5] text-muted-foreground/60" />
          <p className="text-sm font-medium">Nenhum endereço cadastrado</p>
          <p className="text-xs text-muted-foreground/80 mt-0.5">
            O ponto de embarque/desembarque não foi informado.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Home className="mt-0.5 size-4 shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">
                {logradouro || "Logradouro não informado"}
              </p>
              <p className="text-xs text-muted-foreground">
                {bairro ? `Bairro ${bairro}` : ""} {cidadeEstadoCep ? `· ${cidadeEstadoCep}` : ""}
              </p>
            </div>
          </div>

          <div
            onClick={handleOpenMaps}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleOpenMaps()}
            className="group relative h-40 overflow-hidden rounded-xl border border-border bg-muted cursor-pointer transition-colors hover:border-primary/50"
            title="Clique para abrir no Google Maps"
          >
            <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] [background-size:26px_26px]" />
            
            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center transition-transform group-hover:scale-105">
              <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground shadow-md">
                <MapPin className="size-4 animate-bounce" />
              </span>
              <span className="mt-2 rounded-lg bg-card px-2.5 py-1 text-[11px] font-medium text-foreground shadow-sm border border-border">
                {bairro || cidade || "Localização no mapa"}
              </span>
            </div>

            <div className="absolute bottom-2 right-2 rounded-md bg-background/80 backdrop-blur-sm px-2 py-1 text-[10px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 flex items-center gap-1">
              <span>Visualizar rotas</span>
              <ExternalLink className="size-2.5" />
            </div>
          </div>
        </div>
      )}
    </SectionCard>
  );
}