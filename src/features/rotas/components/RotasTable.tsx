import { useNavigate } from "react-router-dom";

import { RowActions } from "@/components/common/row-actions";
import { StatusPill } from "@/components/ui-kit/primitives";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ROUTES } from "@/constants/routes";
import type { Rota } from "@/features/rotas/types/rota";

interface RotasTableProps {
  rotas: readonly Rota[];
  onDelete: (rota: Rota) => void;
}

export function RotasTable({ rotas, onDelete }: RotasTableProps) {
  const navigate = useNavigate();

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border/40 hover:bg-transparent">
          <TableHead className="pl-4 text-xs font-medium text-muted-foreground">
            Nome
          </TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground">
            Descrição
          </TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground">
            Bairro
          </TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground">
            Status
          </TableHead>
          <TableHead className="w-12 pr-4 text-right"></TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {rotas.map((rota) => {
          const isAtivo = rota.status?.toLowerCase() === "ativa";

          return (
            <TableRow
              key={rota.id}
              className="border-border/40 transition-colors group cursor-pointer hover:bg-muted/30"
              onClick={() => navigate(ROUTES.ROTA_DETALHE(rota.id))}
            >
              <TableCell className="pl-4 py-3 font-medium text-xs text-foreground">
                {rota.nome}
              </TableCell>

              <TableCell className="py-3 text-xs text-muted-foreground/80 max-w-sm truncate">
                {rota.descricao ?? "—"}
              </TableCell>

              <TableCell className="py-3 text-xs text-muted-foreground/80">
                {rota.bairro ?? "—"}
              </TableCell>

              <TableCell className="py-3">
                <StatusPill active={isAtivo} />
              </TableCell>

              <TableCell className="pr-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                <RowActions
                  onEdit={() => navigate(ROUTES.ROTA_EDITAR(rota.id))}
                  onDelete={() => onDelete(rota)}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
