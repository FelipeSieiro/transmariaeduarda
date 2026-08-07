import { useEffect, useState } from "react";

import { useAsyncData } from "@/hooks/use-async-data";
import { motoristasService } from "@/features/motoristas/services/motoristas.service";
import { veiculosService } from "@/features/veiculos/services/veiculos.service";
import type { Veiculo } from "@/features/veiculos/types/veiculos";

// Carrega um veículo e resolve o nome do motorista vinculado.
export function useVeiculo(id: string | undefined) {
  const { data: veiculo, loading } = useAsyncData<Veiculo | null>(
    () => veiculosService.getById(id as string),
    {
      initialData: null,
      enabled: Boolean(id),
      errorMessage: "Não foi possível carregar os dados do veículo",
    },
  );

  const [nomeMotorista, setNomeMotorista] = useState<string | null>(null);
  const motoristaId = veiculo?.motorista_id;

  useEffect(() => {
    if (!motoristaId) {
      setNomeMotorista(null);
      return;
    }

    motoristasService
      .getById(motoristaId)
      .then((motorista) => setNomeMotorista(motorista?.nome ?? null))
      .catch(() => setNomeMotorista(null));
  }, [motoristaId]);

  return { veiculo, nomeMotorista, loading };
}
