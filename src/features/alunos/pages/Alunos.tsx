import { useNavigate } from "react-router-dom";
import { Download, Plus } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { ListToolbar } from "@/components/common/list-toolbar";
import { ListPageHeader } from "@/components/common/page-header";
import { PaginationControls } from "@/components/common/pagination-controls";
import { TableCard } from "@/components/common/table-card";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { AlunosTable } from "@/features/alunos/components/AlunosTable";
import { useAlunos } from "@/features/alunos/hooks/use-alunos";
import type { Aluno } from "@/features/alunos/types/alunos";
import { useConfirm } from "@/hooks/use-confirm";
import { useListControls } from "@/hooks/use-list-controls";

type OrdemAluno = "nome" | "id";

const ORDENADORES: Record<OrdemAluno, (a: Aluno, b: Aluno) => number> = {
  nome: (a, b) => a.nome.localeCompare(b.nome),
  id: (a, b) => String(a.id).localeCompare(String(b.id)),
};

function formatarMatricula(aluno: Aluno): string {
  const matricula = aluno?.id
    ? `ALU-${String(aluno.id).slice(0, 8).toUpperCase()}`
    : "-";
  return matricula;
}

export default function Alunos() {
  const navigate = useNavigate();
  const { alunos, loading, remover } = useAlunos();

  const lista = useListControls<Aluno, OrdemAluno>(alunos, {
    searchFields: (aluno) => [
      aluno.nome,
      formatarMatricula(aluno),
    ],
    sorters: ORDENADORES,
    initialSort: "nome",
  });

  const exclusao = useConfirm<Aluno>(
    (aluno) => void remover(aluno.id),
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 py-2">
      <ListPageHeader
        title="Alunos"
        subtitle={`${lista.filtered.length} ${
          lista.filtered.length === 1
            ? "aluno cadastrado"
            : "alunos cadastrados"
        }`}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-lg text-xs"
              onClick={() => toast.success("Exportação iniciada")}
            >
              <Download className="mr-1.5 size-3.5 opacity-70" />
              Exportar
            </Button>

            <Button
              size="sm"
              className="h-9 rounded-lg text-xs"
              onClick={() => navigate(ROUTES.ALUNO_NOVO)}
            >
              <Plus className="mr-1.5 size-3.5" />
              Novo aluno
            </Button>
          </>
        }
      />

      <ListToolbar
        search={lista.search}
        onSearchChange={lista.setSearch}
        searchPlaceholder="Buscar por nome ou matrícula..."
        sortLabel={lista.sort === "nome" ? "Nome" : "ID"}
        onToggleSort={() =>
          lista.setSort(lista.sort === "nome" ? "id" : "nome")
        }
        showClear={lista.hasActiveFilters}
        onClear={lista.clear}
      />

      <TableCard
        isEmpty={lista.visible.length === 0}
        emptyMessage="Nenhum aluno encontrado."
        loading={loading}
      >
        <AlunosTable alunos={lista.visible} onDelete={exclusao.request} />
      </TableCard>

      <PaginationControls
        page={lista.page}
        totalPages={lista.totalPages}
        onPrevious={lista.previousPage}
        onNext={lista.nextPage}
      />

      <ConfirmDialog
        open={exclusao.isOpen}
        onOpenChange={exclusao.setOpen}
        title="Excluir aluno"
        description={`Tem certeza que deseja excluir ${
          exclusao.target?.nome ?? "este aluno"
        }? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        destructive
        onConfirm={exclusao.confirm}
      />
    </div>
  );
}
