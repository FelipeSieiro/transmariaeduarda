import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";

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

import { getInitials } from "@/utils/format-text";
import type { Aluno } from "@/features/alunos/types/alunos";

interface AlunosTableProps {
  alunos: readonly Aluno[];
  onDelete: (aluno: Aluno) => void;
}

function obterNomeEscola(aluno: Aluno): string {
  if (typeof aluno.escolas === "string") return aluno.escolas;
  if (typeof aluno.escola === "string") return aluno.escola;
  return aluno.escola?.nome ?? aluno.escolas?.nome ?? aluno.escola_nome ?? "";
}

function formatarMatricula(aluno: Aluno): string {
  const matricula = aluno?.id
    ? `ALU-${String(aluno.id).slice(0, 8).toUpperCase()}`
    : "-";
  return matricula;
}

export function AlunosTable({ alunos, onDelete }: AlunosTableProps) {
  const navigate = useNavigate();

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border/40 hover:bg-transparent">
          <TableHead className="pl-4 text-xs font-medium text-muted-foreground">
            Aluno
          </TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground">
            Matrícula
          </TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground">
            Escola
          </TableHead>
          <TableHead className="text-xs font-medium text-muted-foreground">
            Status
          </TableHead>
          <TableHead className="w-12 pr-4 text-right"></TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {alunos.map((aluno) => {
          const isAtivo = aluno.status?.toLowerCase() === "ativo";

          return (
            <TableRow
              key={aluno.id}
              className="border-border/40 transition-colors group cursor-pointer hover:bg-muted/30"
              onClick={() => navigate(ROUTES.ALUNO_DETALHE(aluno.id))}
            >
              <TableCell className="pl-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarImage src={aluno.foto_url} />
                    <AvatarFallback className="text-[10px] font-medium bg-muted">
                      {getInitials(aluno.nome)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-xs font-medium text-foreground">
                      {aluno.nome}
                    </div>
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <MapPin className="size-2.5" />
                      {aluno.endereco || "Sem endereço"}
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell className="py-3 text-xs font-mono text-muted-foreground/80">
                {formatarMatricula(aluno)}
              </TableCell>

              <TableCell className="py-3 text-xs text-muted-foreground/80">
                {obterNomeEscola(aluno)}
              </TableCell>

              <TableCell className="py-3">
                <StatusPill active={isAtivo} />
              </TableCell>

              <TableCell className="pr-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                <RowActions
                  onEdit={() => navigate(ROUTES.ALUNO_EDITAR(aluno.id))}
                  onDelete={() => onDelete(aluno)}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
