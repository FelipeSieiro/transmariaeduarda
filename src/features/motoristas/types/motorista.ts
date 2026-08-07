export interface Motorista {
  id: string;
  nome: string;
  cpf: string | null;
  telefone: string | null;
  cnh: string | null;
  categoria_cnh: string | null;
  salario: number | null;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  // Campos opcionais retornados por alguns endpoints da API.
  foto_url?: string | null;
  cidade?: string | null;
}

export type CreateMotoristaDTO = Omit<
  Motorista,
  "id" | "created_at" | "updated_at" | "deleted_at" | "foto_url" | "cidade"
>;

export type UpdateMotoristaDTO = Partial<CreateMotoristaDTO>;
