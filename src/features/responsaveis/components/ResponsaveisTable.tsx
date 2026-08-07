import { useNavigate } from "react-router-dom";

import { RowActions } from "@/components/common/row-actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ROUTES } from "@/constants/routes";
import type { Responsavel } from "@/features/responsaveis/types/responsavel";

interface ResponsaveisTableProps {
  responsaveis: readonly Responsavel[];
  onDelete: (responsavel: Responsavel) => void;
}

export function ResponsaveisTable({
  responsaveis,
  onDelete,
}: ResponsaveisTableProps) {
  const navigate = useNavigate();

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border/40 hover:bg-transparent">
          <TableHead className="pl-4 text-xs font-medium text-muted-foreground">
            Nome
          </TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground">
            CPF
          </TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground">
            Telefone
          </TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground">
            Email
          </TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground">
            Endereço
          </TableHead>
          <TableHead className="w-12 pr-4 text-right" />
        </TableRow>
      </TableHeader>

      <TableBody>
        {responsaveis.map((responsavel) => (
          <TableRow
            key={responsavel.id}
            className="group border-border/40 transition-colors"
          >
            <TableCell className="py-3 pl-4 text-xs font-medium text-foreground">
              {responsavel.nome}
            </TableCell>

            <TableCell className="py-3 font-mono text-xs text-muted-foreground/80">
              {responsavel.cpf ?? "—"}
            </TableCell>

            <TableCell className="py-3 font-mono text-xs text-muted-foreground/80">
              {responsavel.telefone ?? "—"}
            </TableCell>

            <TableCell className="py-3 text-xs text-muted-foreground/80">
              {responsavel.email ?? "—"}
            </TableCell>

            <TableCell className="max-w-xs truncate py-3 text-xs text-muted-foreground/80">
              {responsavel.endereco ?? "—"}
            </TableCell>

            <TableCell className="py-3 pr-4 text-right">
              <RowActions
                onView={() =>
                  navigate(ROUTES.RESPONSAVEL_DETALHE(responsavel.id))
                }
                onEdit={() =>
                  navigate(ROUTES.RESPONSAVEL_EDITAR(responsavel.id))
                }
                onDelete={() => onDelete(responsavel)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
