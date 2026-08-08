import { toast } from "sonner";

import { useAsyncData } from "@/hooks/use-async-data";
import { rotasService } from "@/features/rotas/services/rotas.service";
import type { Rota } from "@/features/rotas/types/rota";

const LISTA_VAZIA: Rota[] = [];

export function useRotas() {
  const { data, loading, reload } = useAsyncData(
    rotasService.listar,
    { initialData: LISTA_VAZIA, errorMessage: "Erro ao carregar rotas" },
  );

  async function remover(id: string) {
    try {
      await rotasService.remover(id);
      toast.success("Rota excluída com sucesso");
      reload();
    } catch (error) {
      toast.error("Erro ao excluir rota");
      throw error;
    }
  }

  return { rotas: data, loading, reload, remover };
}
