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
import { ContratosTable } from "@/features/contratos/components/ContratosTable";
import { useContratos } from "@/features/contratos/hooks/use-contratos";
import type { Contrato } from "@/features/contratos/types/contrato";
import { useConfirm } from "@/hooks/use-confirm";
import { useListControls } from "@/hooks/use-list-controls";

type OrdemContrato = "numero" | "aluno";

const ORDENADORES: Record<OrdemContrato, (a: Contrato, b: Contrato) => number> = {
  numero: (a, b) => (a.numero || "").localeCompare(b.numero || ""),
  aluno: (a, b) => (a.alunos?.nome || "").localeCompare(b.alunos?.nome || ""),
};

export default function Contratos() {
  const navigate = useNavigate();
  const { contratos, loading, remover } = useContratos();

  const lista = useListControls<Contrato, OrdemContrato>(contratos, {
    searchFields: (contrato) => [
      contrato.numero,
      contrato.alunos?.nome,
      contrato.alunos?.escolas?.nome,
    ],
    sorters: ORDENADORES,
    initialSort: "numero",
  });

  const exclusao = useConfirm<Contrato>(
    (contrato) => void remover(contrato.id),
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 py-2">
      <ListPageHeader
        title="Contratos"
        subtitle={`${lista.filtered.length} ${
          lista.filtered.length === 1
            ? "contrato cadastrado"
            : "contratos cadastrados"
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
              onClick={() => navigate(ROUTES.CONTRATO_NOVO)}
            >
              <Plus className="mr-1.5 size-3.5" />
              Novo contrato
            </Button>
          </>
        }
      />

      <ListToolbar
        search={lista.search}
        onSearchChange={lista.setSearch}
        searchPlaceholder="Buscar por número ou aluno..."
        sortLabel={lista.sort === "numero" ? "Número" : "Aluno"}
        onToggleSort={() =>
          lista.setSort(lista.sort === "numero" ? "aluno" : "numero")
        }
        showClear={lista.hasActiveFilters}
        onClear={lista.clear}
      />

      <TableCard
        isEmpty={lista.visible.length === 0}
        emptyMessage="Nenhum contrato encontrado."
        loading={loading}
      >
        <ContratosTable contratos={lista.visible} onDelete={exclusao.request} />
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
        title="Excluir contrato"
        description={`Tem certeza que deseja excluir o contrato ${
          exclusao.target?.numero ?? "este contrato"
        }? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        destructive
        onConfirm={exclusao.confirm}
      />
    </div>
  );
}
