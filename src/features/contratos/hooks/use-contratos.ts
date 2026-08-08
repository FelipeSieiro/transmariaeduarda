import { toast } from "sonner";

import { useAsyncData } from "@/hooks/use-async-data";
import { contratosService } from "@/features/contratos/services/contratos.service";
import type { Contrato } from "@/features/contratos/types/contrato";

const LISTA_VAZIA: Contrato[] = [];

export function useContratos() {
  const { data, loading, reload } = useAsyncData(
    contratosService.listarContratos,
    { initialData: LISTA_VAZIA, errorMessage: "Erro ao carregar contratos" },
  );

  async function remover(id: string) {
    try {
      await contratosService.remove(id);
      toast.success("Contrato excluído com sucesso");
      reload();
    } catch (error) {
      toast.error("Erro ao excluir contrato");
      throw error;
    }
  }

  return { contratos: data, loading, reload, remover };
}
