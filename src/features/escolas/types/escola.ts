// Tipos do domínio de escolas

export interface EscolaResumida {
  id: string;
  nome: string;
}

export interface Escola {
  id: string;
  nome: string;
  endereco?: string | null;
  telefone?: string | null;
}

export type CreateEscolaDTO = Omit<Escola, "id">;
export type UpdateEscolaDTO = Partial<CreateEscolaDTO>;
