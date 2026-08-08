import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AlunoDetalheBackButton() {
  return (
    <Button
      asChild
      variant="ghost"
      size="sm"
      className="w-fit h-8 rounded-lg text-xs text-muted-foreground hover:text-foreground px-2"
    >
      <Link to="/alunos">
        <ArrowLeft className="mr-1.5 size-3.5 opacity-70" />
        Voltar para alunos
      </Link>
    </Button>
  );
}