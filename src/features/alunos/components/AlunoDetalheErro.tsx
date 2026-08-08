import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function AlunoDetalheErro() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center space-y-4 px-4 text-center">
      <h1 className="text-lg font-semibold tracking-tight text-foreground">
        Aluno não encontrado
      </h1>

      <p className="text-xs text-muted-foreground">
        Verifique a URL ou volte para a lista geral de alunos.
      </p>

      <Button
        asChild
        size="sm"
        className="h-9 rounded-lg text-xs"
      >
        <Link to="/alunos">
          Voltar para alunos
        </Link>
      </Button>
    </div>
  );
}