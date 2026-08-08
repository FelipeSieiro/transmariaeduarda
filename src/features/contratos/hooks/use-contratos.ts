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

  return { contratos: data, loading, reload };
}
