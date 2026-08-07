import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

// Paginação das listagens; não renderiza nada quando há uma única página.
export function PaginationControls({
  page,
  totalPages,
  onPrevious,
  onNext,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-2 pt-2 text-xs text-muted-foreground">
      <span>
        Página {page} de {totalPages}
      </span>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 rounded-lg text-xs"
          onClick={onPrevious}
          disabled={page === 1}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 rounded-lg text-xs"
          onClick={onNext}
          disabled={page === totalPages}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}
