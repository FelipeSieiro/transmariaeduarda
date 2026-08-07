import { useMemo } from "react";
import { toast } from "sonner";

import { useAsyncData } from "@/hooks/use-async-data";
import { veiculosService } from "@/features/veiculos/services/veiculos.service";
import type { Veiculo } from "@/features/veiculos/types/veiculos";

const LISTA_VAZIA: Veiculo[] = [];

function isStatus(veiculo: Veiculo, ...valores: string[]): boolean {
  return valores.includes((veiculo.status || "").toLowerCase());
}

// Listagem de veículos, métricas da frota e exclusão.
export function useVeiculos() {
  const { data, setData, loading, reload } = useAsyncData(
    veiculosService.getAll,
    {
      initialData: LISTA_VAZIA,
      errorMessage: "Erro ao carregar veículos",
    },
  );

  const metricas = useMemo(
    () => ({
      total: data.length,
      ativos: data.filter((veiculo) => isStatus(veiculo, "ativo")).length,
      manutencao: data.filter((veiculo) =>
        isStatus(veiculo, "manutencao", "em manutenção"),
      ).length,
      capacidadeTotal: data.reduce(
        (acumulado, veiculo) => acumulado + (Number(veiculo.capacidade) || 0),
        0,
      ),
    }),
    [data],
  );

  async function remover(id: string) {
    try {
      await veiculosService.remove(id);
      setData((atual) => atual.filter((item) => item.id !== id));
      toast.success("Veículo excluído com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir veículo");
    }
  }

  return { veiculos: data, metricas, loading, reload, remover };
}
