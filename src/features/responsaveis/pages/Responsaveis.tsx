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
import { ResponsaveisTable } from "@/features/responsaveis/components/ResponsaveisTable";
import { useResponsaveis } from "@/features/responsaveis/hooks/use-responsaveis";
import type { Responsavel } from "@/features/responsaveis/types/responsavel";
import { useConfirm } from "@/hooks/use-confirm";
import { useListControls } from "@/hooks/use-list-controls";

type OrdemResponsavel = "nome" | "id";

const ORDENADORES: Record<
  OrdemResponsavel,
  (a: Responsavel, b: Responsavel) => number
> = {
  nome: (a, b) => (a.nome || "").localeCompare(b.nome || ""),
  id: (a, b) => String(a.id).localeCompare(String(b.id)),
};

export default function Responsaveis() {
  const navigate = useNavigate();
  const { responsaveis, remover } = useResponsaveis();

  const lista = useListControls<Responsavel, OrdemResponsavel>(responsaveis, {
    searchFields: (responsavel) => [
      responsavel.nome,
      responsavel.cpf,
      responsavel.telefone,
      responsavel.email,
    ],
    sorters: ORDENADORES,
    initialSort: "nome",
  });

  const exclusao = useConfirm<Responsavel>(
    (responsavel) => void remover(responsavel.id),
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 py-2">
      <ListPageHeader
        title="Responsáveis"
        subtitle={`${lista.filtered.length} ${
          lista.filtered.length === 1
            ? "responsável cadastrado"
            : "responsáveis cadastrados"
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
              onClick={() => navigate(ROUTES.RESPONSAVEL_NOVO)}
            >
              <Plus className="mr-1.5 size-3.5" />
              Novo responsável
            </Button>
          </>
        }
      />

      <ListToolbar
        search={lista.search}
        onSearchChange={lista.setSearch}
        searchPlaceholder="Buscar por nome, CPF, telefone..."
        sortLabel={lista.sort === "nome" ? "Nome" : "ID"}
        onToggleSort={() =>
          lista.setSort(lista.sort === "nome" ? "id" : "nome")
        }
        showClear={lista.hasActiveFilters}
        onClear={lista.clear}
      />

      <TableCard
        isEmpty={lista.visible.length === 0}
        emptyMessage="Nenhum responsável encontrado."
      >
        <ResponsaveisTable
          responsaveis={lista.visible}
          onDelete={exclusao.request}
        />
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
        title="Excluir responsável"
        description={`Tem certeza que deseja excluir ${
          exclusao.target?.nome ?? "este responsável"
        }? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        destructive
        onConfirm={exclusao.confirm}
      />
    </div>
  );
}
