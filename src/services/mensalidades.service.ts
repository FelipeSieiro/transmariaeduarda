// src/services/mensalidades.service.ts

import api from "@/lib/api";


export type Mensalidade = {
  id: string;
  contrato_id: string;
  competencia: string;
  valor: number;
  data_vencimento: string;
  status: "pendente" | "pago" | "atrasado";
  data_pagamento?: string | null;
};

export type PagarMensalidadePayload = {
  forma_pagamento: string;
  data_pagamento: string;
};

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