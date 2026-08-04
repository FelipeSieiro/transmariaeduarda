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
