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
import { RotasTable } from "@/features/rotas/components/RotasTable";
import { useRotas } from "@/features/rotas/hooks/use-rotas";
import type { Rota } from "@/features/rotas/types/rota";
import { useConfirm } from "@/hooks/use-confirm";
import { useListControls } from "@/hooks/use-list-controls";

type OrdemRota = "nome" | "id";

const ORDENADORES: Record<OrdemRota, (a: Rota, b: Rota) => number> = {
  nome: (a, b) => (a.nome || "").localeCompare(b.nome || ""),
  id: (a, b) => String(a.id).localeCompare(String(b.id)),
};

export default function Rotas() {
  const navigate = useNavigate();
  const { rotas, loading, remover } = useRotas();

  const lista = useListControls<Rota, OrdemRota>(rotas, {
    searchFields: (rota) => [
      rota.nome,
      rota.descricao,
      rota.bairro,
    ],
    sorters: ORDENADORES,
    initialSort: "nome",
  });

  const exclusao = useConfirm<Rota>(
    (rota) => void remover(rota.id),
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 py-2">
      <ListPageHeader
        title="Rotas"
        subtitle={`${lista.filtered.length} ${
          lista.filtered.length === 1
            ? "rota cadastrada"
            : "rotas cadastradas"
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
              onClick={() => navigate(ROUTES.ROTA_NOVA)}
            >
              <Plus className="mr-1.5 size-3.5" />
              Nova rota
            </Button>
          </>
        }
      />

      <ListToolbar
        search={lista.search}
        onSearchChange={lista.setSearch}
        searchPlaceholder="Buscar por nome ou bairro..."
        sortLabel={lista.sort === "nome" ? "Nome" : "ID"}
        onToggleSort={() =>
          lista.setSort(lista.sort === "nome" ? "id" : "nome")
        }
        showClear={lista.hasActiveFilters}
        onClear={lista.clear}
      />

      <TableCard
        isEmpty={lista.visible.length === 0}
        emptyMessage="Nenhuma rota encontrada."
        loading={loading}
      >
        <RotasTable rotas={lista.visible} onDelete={exclusao.request} />
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
        title="Excluir rota"
        description={`Tem certeza que deseja excluir a rota ${
          exclusao.target?.nome ?? "esta rota"
        }? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        destructive
        onConfirm={exclusao.confirm}
      />
    </div>
  );
}
