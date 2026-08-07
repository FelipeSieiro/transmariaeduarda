import { toast } from "sonner";

import { useAsyncData } from "@/hooks/use-async-data";
import { responsaveisService } from "@/features/responsaveis/services/responsaveis.service";
import type { Responsavel } from "@/features/responsaveis/types/responsavel";

const LISTA_VAZIA: Responsavel[] = [];

// Listagem de responsáveis e exclusão com atualização otimista.
export function useResponsaveis() {
  const { data, setData, loading, reload } = useAsyncData(
    responsaveisService.getAll,
    { initialData: LISTA_VAZIA, errorMessage: "Erro ao carregar responsáveis" },
  );

  async function remover(id: string) {
    try {
      await responsaveisService.remove(id);
      setData((atual) => atual.filter((item) => item.id !== id));
      toast.success("Responsável excluído com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir responsável");
    }
  }

  return { responsaveis: data, loading, reload, remover };
}
