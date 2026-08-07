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
import { FrotaMetricas } from "@/features/veiculos/components/FrotaMetricas";
import { VeiculosTable } from "@/features/veiculos/components/VeiculosTable";
import { useVeiculos } from "@/features/veiculos/hooks/use-veiculos";
import type { Veiculo } from "@/features/veiculos/types/veiculos";
import { useConfirm } from "@/hooks/use-confirm";
import { useListControls } from "@/hooks/use-list-controls";

type OrdemVeiculo = "modelo" | "placa";

const ORDENADORES: Record<OrdemVeiculo, (a: Veiculo, b: Veiculo) => number> = {
  modelo: (a, b) => (a.modelo || "").localeCompare(b.modelo || ""),
  placa: (a, b) => (a.placa || "").localeCompare(b.placa || ""),
};

export default function Veiculos() {
  const navigate = useNavigate();
  const { veiculos, metricas, remover } = useVeiculos();

  const lista = useListControls<Veiculo, OrdemVeiculo>(veiculos, {
    searchFields: (veiculo) => [veiculo.modelo, veiculo.placa, veiculo.marca],
    sorters: ORDENADORES,
    initialSort: "modelo",
  });

  const exclusao = useConfirm<Veiculo>((veiculo) => void remover(veiculo.id));

  return (
    <div className="mx-auto max-w-6xl space-y-6 py-2">
      <ListPageHeader
        title="Veículos"
        subtitle={`${lista.filtered.length} ${
          lista.filtered.length === 1 ? "veículo na frota" : "veículos na frota"
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
              onClick={() => navigate(ROUTES.VEICULO_NOVO)}
            >
              <Plus className="mr-1.5 size-3.5" />
              Novo veículo
            </Button>
          </>
        }
      />

      <FrotaMetricas {...metricas} />

      <ListToolbar
        search={lista.search}
        onSearchChange={lista.setSearch}
        searchPlaceholder="Buscar por modelo, placa..."
        sortLabel={lista.sort === "modelo" ? "Placa" : "Modelo"}
        onToggleSort={() =>
          lista.setSort(lista.sort === "modelo" ? "placa" : "modelo")
        }
        showClear={lista.hasActiveFilters}
        onClear={lista.clear}
      />

      <TableCard
        isEmpty={lista.visible.length === 0}
        emptyMessage="Nenhum veículo encontrado."
      >
        <VeiculosTable veiculos={lista.visible} onDelete={exclusao.request} />
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
        title="Excluir veículo"
        description={`Tem certeza que deseja excluir o veículo ${
          exclusao.target?.placa ?? ""
        }? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        destructive
        onConfirm={exclusao.confirm}
      />
    </div>
  );
}
