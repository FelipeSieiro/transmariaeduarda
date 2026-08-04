export interface Responsavel {
  id: string;
  nome: string;
  cpf?: string | null;
  telefone?: string | null;
  email?: string | null;
  endereco?: string | null;
  observacoes?: string | null;
}

export interface ResponsavelDetalhe {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  parentesco: string;
  responsavel_financeiro: boolean;
  responsavel_emergencia: boolean;
  endereco: string;
  bairro: string;
  cidade: string;
}

export interface AlunoResponsavelVinculo {
  id?: string;
  responsavel_id?: string;
  responsavel?: Responsavel | null;
  responsaveis?: Responsavel | null;
  parentesco?: string | null;
  responsavel_financeiro?: boolean;
  responsavel_emergencia?: boolean;
}

export interface PayloadResponsavelVinculo {
  responsavel_id: string;
  parentesco?: string;
  responsavel_financeiro?: boolean;
  responsavel_emergencia?: boolean;
}
