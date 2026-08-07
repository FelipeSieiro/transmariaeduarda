import { useNavigate } from "react-router-dom";

import { RowActions } from "@/components/common/row-actions";
import { StatusPill } from "@/components/ui-kit/primitives";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ROUTES } from "@/constants/routes";
import type { Motorista } from "@/features/motoristas/types/motorista";
import { getInitials } from "@/utils/format-text";

interface MotoristasTableProps {
  motoristas: readonly Motorista[];
  onDelete: (motorista: Motorista) => void;
}

export function MotoristasTable({
  motoristas,
  onDelete,
}: MotoristasTableProps) {
  const navigate = useNavigate();

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border/40 hover:bg-transparent">
          <TableHead className="pl-4 text-xs font-medium text-muted-foreground">
            Motorista
          </TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground">
            CPF
          </TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground">
            Telefone
          </TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground">
            CNH / Cat.
          </TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground">
            Status
          </TableHead>
          <TableHead className="w-12 pr-4 text-right" />
        </TableRow>
      </TableHeader>

      <TableBody>
        {motoristas.map((motorista) => (
          <TableRow
            key={motorista.id}
            className="group border-border/40 transition-colors"
          >
            <TableCell className="py-3 pl-4">
              <div className="flex items-center gap-3">
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage src={motorista.foto_url ?? undefined} />
                  <AvatarFallback className="rounded-lg bg-primary/10 text-[10px] font-medium text-primary">
                    {getInitials(motorista.nome, "MO")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-medium text-foreground">
                    {motorista.nome}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {motorista.cidade ?? "—"}
                  </p>
                </div>
              </div>
            </TableCell>

            <TableCell className="py-3 font-mono text-xs text-muted-foreground/80">
              {motorista.cpf ?? "—"}
            </TableCell>

            <TableCell className="py-3 font-mono text-xs text-muted-foreground/80">
              {motorista.telefone ?? "—"}
            </TableCell>

            <TableCell className="py-3 text-xs text-muted-foreground/80">
              {motorista.cnh
                ? `${motorista.cnh} ${
                    motorista.categoria_cnh
                      ? `(${motorista.categoria_cnh})`
                      : ""
                  }`
                : "—"}
            </TableCell>

            <TableCell className="py-3">
              <StatusPill status={motorista.status ?? "ativo"} />
            </TableCell>

            <TableCell className="py-3 pr-4 text-right">
              <RowActions
                onView={() => navigate(ROUTES.MOTORISTA_DETALHE(motorista.id))}
                onEdit={() => navigate(ROUTES.MOTORISTA_EDITAR(motorista.id))}
                onDelete={() => onDelete(motorista)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
