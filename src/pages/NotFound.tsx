// src/pages/NotFound.tsx
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="mx-auto w-full max-w-md space-y-6 text-center">
        {/* Ícone */}
        <div className="mx-auto flex size-16 items-center justify-center rounded-xl border border-border/60 bg-card/50 shadow-2xs">
          <SearchX className="size-7 text-muted-foreground/70" />
        </div>

        {/* Texto */}
        <div className="space-y-1.5">
          <p className="text-5xl font-semibold tracking-tight text-foreground">
            404
          </p>
          <h1 className="text-sm font-medium text-foreground">
            Página não encontrada
          </h1>
          <p className="text-xs text-muted-foreground">
            O endereço que você tentou acessar não existe ou foi movido.
          </p>
        </div>

        {/* Ações */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-lg text-xs"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="size-3.5 mr-1.5 opacity-70" />
            Voltar
          </Button>

          <Button
            size="sm"
            className="h-9 rounded-lg text-xs"
            onClick={() => navigate("/")}
          >
            <Home className="size-3.5 mr-1.5" />
            Ir para o início
          </Button>
        </div>
      </div>
    </div>
  );
}
