import type { EscolaResumida } from "@/features/escolas/types/escola";
import type { Mensalidade } from "@/features/alunos/types/mensalidade";
import type { RotaResumida } from "@/features/rotas/types/rota";

export interface HistoricoItemDetalhe {
  data: string;
  evento: string;
}

export interface Contrato {
  id?: string;
  aluno_id?: string;
  numero?: string;
  data_inicio?: string;
  data_fim?: string | null;
  valor_mensalidade?: number;
  dia_vencimento?: number;
  forma_pagamento?: string;
  observacoes?: string | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
  mensalidades?: Mensalidade[];
  alunos?: {
    id: string;
    nome: string;
    matricula: string;
    serie: string;
    turno: string;
    status: string;
    escolas?: EscolaResumida | null;
    rotas?: RotaResumida | null;
  };
}

export interface CriarContratoPayload {
  aluno_id: string;
  numero: string;
  data_inicio: string;
  data_fim?: string | null;
  valor_mensalidade: number;
  dia_vencimento: number;
  forma_pagamento: string;
  observacoes?: string;
  status: string;
}

export interface ContratoDetalhe {
  numero: string;
  inicio: string;
  fim: string;
  vencimentoDia: number;
  formaPagamento: string;
  observacoes: string;
}
