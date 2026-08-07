import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { ROUTES } from "@/constants/routes";
import { useAsyncData } from "@/hooks/use-async-data";
import { motoristasService } from "@/features/motoristas/services/motoristas.service";
import type { Motorista } from "@/features/motoristas/types/motorista";

// Carrega um motorista pelo id; volta para a listagem quando não encontrado.
export function useMotorista(id: string | undefined) {
  const navigate = useNavigate();

  const { data, loading } = useAsyncData<Motorista | null>(
    () => motoristasService.getById(id as string),
    {
      initialData: null,
      enabled: Boolean(id),
      errorMessage: "Motorista não encontrado ou erro ao carregar",
      onError: () => navigate(ROUTES.MOTORISTAS),
    },
  );

  async function remover() {
    if (!id) return;

    try {
      await motoristasService.remove(id);
      toast.success("Motorista excluído com sucesso");
      navigate(ROUTES.MOTORISTAS);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir motorista");
    }
  }

  return { motorista: data, loading, remover };
}
