// src/services/mensalidades.service.ts

import api from "@/lib/api";
import { Mensalidade, PagarMensalidadePayload } from "@/types";


// Buscar mensalidades por Contrato ID
export async function buscarMensalidadesPorContrato(contratoId: string): Promise<Mensalidade[]> {
  const { data } = await api.get(`/mensalidades/contrato/${contratoId}`);
  return data.data;
}

// Dar baixa (Pagar Mensalidade)
export async function registrarPagamento(id: string, payload: PagarMensalidadePayload): Promise<Mensalidade> {
  const { data } = await api.patch(`/mensalidades/${id}/pagar`, payload);
  return data.data;
}