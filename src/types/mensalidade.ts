export interface Mensalidade {
  id: string;
  contrato_id: string;
  competencia: string;
  valor: number;
  data_vencimento: string;
  status?: "pendente" | "pago" | "atrasado" | "cancelado" | string | null;
  data_pagamento?: string | null;
  forma_pagamento?: string | null;
  observacoes?: string | null;
  created_at?: string;
  updated_at?: string;
}

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