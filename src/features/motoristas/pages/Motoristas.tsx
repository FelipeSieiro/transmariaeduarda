import { useNavigate } from "react-router-dom";
import { Download, Plus } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { ListToolbar } from "@/components/common/list-toolbar";
import { PaginationControls } from "@/components/common/pagination-controls";
import { ListPageHeader } from "@/components/common/page-header";
import { TableCard } from "@/components/common/table-card";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { MotoristasTable } from "@/features/motoristas/components/MotoristasTable";
import { useMotoristas } from "@/features/motoristas/hooks/use-motoristas";
import type { Motorista } from "@/features/motoristas/types/motorista";
import { useConfirm } from "@/hooks/use-confirm";
import { useListControls } from "@/hooks/use-list-controls";

type OrdemMotorista = "nome" | "id";

const ORDENADORES: Record<
  OrdemMotorista,
  (a: Motorista, b: Motorista) => number
> = {
  nome: (a, b) => (a.nome || "").localeCompare(b.nome || ""),
  id: (a, b) => String(a.id).localeCompare(String(b.id)),
};

export default function Motoristas() {
  const navigate = useNavigate();
  const { motoristas, remover } = useMotoristas();

  const lista = useListControls<Motorista, OrdemMotorista>(motoristas, {
    searchFields: (motorista) => [
      motorista.nome,
      motorista.cpf,
      motorista.telefone,
      motorista.cnh,
    ],
    sorters: ORDENADORES,
    initialSort: "nome",
  });

  const exclusao = useConfirm<Motorista>(
    (motorista) => void remover(motorista.id),
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 py-2">
      <ListPageHeader
        title="Motoristas"
        subtitle={`${lista.filtered.length} ${
          lista.filtered.length === 1
            ? "motorista cadastrado"
            : "motoristas cadastrados"
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
              onClick={() => navigate(ROUTES.MOTORISTA_NOVO)}
            >
              <Plus className="mr-1.5 size-3.5" />
              Novo motorista
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
        emptyMessage="Nenhum motorista encontrado."
      >
        <MotoristasTable
          motoristas={lista.visible}
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
        title="Excluir motorista"
        description={`Tem certeza que deseja excluir ${
          exclusao.target?.nome ?? "este motorista"
        }? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        destructive
        onConfirm={exclusao.confirm}
      />
    </div>
  );
}
