import { useNavigate } from "react-router-dom";
import { Bus } from "lucide-react";

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
import type { Veiculo } from "@/features/veiculos/types/veiculos";

interface VeiculosTableProps {
  veiculos: readonly Veiculo[];
  onDelete: (veiculo: Veiculo) => void;
}

export function VeiculosTable({ veiculos, onDelete }: VeiculosTableProps) {
  const navigate = useNavigate();

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border/40 hover:bg-transparent">
          <TableHead className="pl-4 text-xs font-medium text-muted-foreground">
            Veículo / Modelo
          </TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground">
            Placa
          </TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground">
            Capacidade
          </TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground">
            Ano
          </TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground">
            Status
          </TableHead>
          <TableHead className="w-12 pr-4 text-right" />
        </TableRow>
      </TableHeader>

      <TableBody>
        {veiculos.map((veiculo) => (
          <TableRow
            key={veiculo.id}
            className="group border-border/40 transition-colors cursor-pointer hover:bg-muted/30"
            onClick={() => navigate(ROUTES.VEICULO_DETALHE(veiculo.id))}
          >
            <TableCell className="py-3 pl-4">
              <div className="flex items-center gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Bus className="size-3.5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">
                    {veiculo.modelo}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {veiculo.marca ?? "Marca não informada"}
                  </p>
                </div>
              </div>
            </TableCell>

            <TableCell className="py-3 font-mono text-xs font-medium text-foreground">
              {veiculo.placa}
            </TableCell>

            <TableCell className="py-3 text-xs text-muted-foreground/80">
              {veiculo.capacidade ? `${veiculo.capacidade} lugares` : "—"}
            </TableCell>

            <TableCell className="py-3 text-xs text-muted-foreground/80">
              {veiculo.ano ?? "—"}
            </TableCell>

            <TableCell className="py-3">
              <StatusPill
                status={veiculo.status ? veiculo.status.toLowerCase() : "ativo"}
              />
            </TableCell>

            <TableCell className="py-3 pr-4 text-right" onClick={(e) => e.stopPropagation()}>
              <RowActions
                onEdit={() => navigate(ROUTES.VEICULO_EDITAR(veiculo.id))}
                onDelete={() => onDelete(veiculo)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
