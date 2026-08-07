import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RowActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  deleteLabel?: string;
}

// Menu de ações das linhas das tabelas (visualizar / editar / excluir).
export function RowActions({
  onView,
  onEdit,
  onDelete,
  deleteLabel = "Excluir",
}: RowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 rounded-md text-muted-foreground hover:text-foreground"
          aria-label="Ações"
        >
          <MoreHorizontal className="size-3.5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="rounded-xl text-xs">
        {onView && (
          <DropdownMenuItem
            onClick={onView}
            className="cursor-pointer rounded-md"
          >
            Visualizar
          </DropdownMenuItem>
        )}

        {onEdit && (
          <DropdownMenuItem
            onClick={onEdit}
            className="cursor-pointer rounded-md"
          >
            Editar
          </DropdownMenuItem>
        )}

        {onDelete && (
          <DropdownMenuItem
            onClick={onDelete}
            className="cursor-pointer rounded-md text-destructive focus:text-destructive"
          >
            {deleteLabel}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
