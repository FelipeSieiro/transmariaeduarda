import { Mensalidade } from "./mensalidade";

export interface Contrato {
  id?: string;
  aluno_id?: string;
  numero?: string;
  data_inicio?: string;
  data_fim?: string | null;
  valor_mensalidade?: number;
  dia_vencimento?: number;
  forma_pagamento?: string;
  observacoes?: string;
  status?: string;
  mensalidades?: Mensalidade[];
}

export interface Contrato {
    id: string;
    aluno_id: string;
    numero: string;
    data_inicio: string;
    data_fim: string | null;
    valor_mensalidade: number;
    dia_vencimento: number;
    forma_pagamento: string;
    observacoes: string;
    status: string;
    created_at?: string;
    updated_at?: string;
    alunos?: {
        id: string;
        nome: string;
        matricula: string;
        serie: string;
        turno: string;
        status: string;
        escolas?: {
            id: string;
            nome: string;
        };
        rotas?: {
            id: string;
            nome: string;
        };
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