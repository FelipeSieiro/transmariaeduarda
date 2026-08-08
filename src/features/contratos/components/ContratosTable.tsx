import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { formatCurrency } from "@/utils/format-currency";
import type { Contrato } from "@/features/contratos/types/contrato";

interface ContratosTableProps {
  contratos: readonly Contrato[];
}

export function ContratosTable({ contratos }: ContratosTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border/40 hover:bg-transparent">
          <TableHead className="pl-4 text-xs font-medium text-muted-foreground">
            Número
          </TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground">
            Aluno
          </TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground">
            Escola
          </TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground">
            Mensalidade
          </TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground">
            Vencimento
          </TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground">
            Status
          </TableHead>
          <TableHead className="w-12 pr-4 text-right"></TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {contratos.map((contrato) => {
          const isAtivo = contrato.status?.toUpperCase() === "ATIVO";

          return (
            <TableRow key={contrato.id} className="border-border/40 transition-colors group">
              <TableCell className="pl-4 py-3 font-medium text-xs text-foreground">
                {contrato.numero}
              </TableCell>

              <TableCell className="py-3 text-xs text-foreground">
                {contrato.alunos?.nome ?? "—"}
              </TableCell>

              <TableCell className="py-3 text-xs text-muted-foreground/80">
                {contrato.alunos?.escolas?.nome ?? "—"}
              </TableCell>

              <TableCell className="py-3 text-xs font-medium text-foreground">
                {formatCurrency(Number(contrato.valor_mensalidade))}
              </TableCell>

              <TableCell className="py-3 text-xs text-muted-foreground/80">
                Dia {contrato.dia_vencimento}
              </TableCell>

              <TableCell className="py-3">
                <Badge
                  variant={isAtivo ? "default" : "secondary"}
                  className={`text-[10px] px-2 py-0.5 font-medium rounded-md shadow-none ${
                    isAtivo
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {contrato.status ?? "INATIVO"}
                </Badge>
              </TableCell>

              <TableCell className="pr-4 py-3 text-right">
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="size-7 rounded-md text-muted-foreground hover:text-foreground"
                >
                  <Link to={`/contratos/${contrato.id}`}>
                    <Eye className="size-3.5" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
