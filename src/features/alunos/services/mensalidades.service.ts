import api from "@/config/api";
import type { ApiResponse, Mensalidade, PagarMensalidadePayload } from "@/types";

// Buscar mensalidades por Contrato ID
export async function buscarMensalidadesPorContrato(
  contratoId: string
): Promise<Mensalidade[]> {
  const { data } = await api.get<ApiResponse<Mensalidade[]>>(
    `/mensalidades/contrato/${contratoId}`
  );
  return data.data;
}

// Dar baixa (Pagar Mensalidade)
export async function registrarPagamento(
  id: string,
  payload: PagarMensalidadePayload
): Promise<Mensalidade> {
  const { data } = await api.patch<ApiResponse<Mensalidade>>(
    `/mensalidades/${id}/pagar`,
    payload
  );
  return data.data;
}

export const mensalidadesService = {
  buscarPorContrato: buscarMensalidadesPorContrato,
  registrarPagamento,
};