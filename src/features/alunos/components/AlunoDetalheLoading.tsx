export function AlunoDetalheLoading() {
  return (
    <div className="mx-auto flex min-h-[50vh] items-center justify-center px-4">
      <div className="text-center animate-pulse">
        <p className="text-xs text-muted-foreground">
          Carregando detalhes do aluno...
        </p>
      </div>
    </div>
  );
}