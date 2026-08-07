import { toast } from "sonner";

import { useAsyncData } from "@/hooks/use-async-data";
import { motoristasService } from "@/features/motoristas/services/motoristas.service";
import type { Motorista } from "@/features/motoristas/types/motorista";

const LISTA_VAZIA: Motorista[] = [];

// Carrega a listagem de motoristas e expõe a exclusão com atualização otimista.
export function useMotoristas() {
  const { data, setData, loading, reload } = useAsyncData(
    motoristasService.getAll,
    { initialData: LISTA_VAZIA, errorMessage: "Erro ao carregar motoristas" },
  );

  async function remover(id: string) {
    try {
      await motoristasService.remove(id);
      setData((atual) => atual.filter((item) => item.id !== id));
      toast.success("Motorista excluído com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir motorista");
    }
  }

  return { motoristas: data, loading, reload, remover };
}
