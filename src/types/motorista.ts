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
}

export type CreateMotoristaDTO = Omit<
  Motorista,
  "id" | "created_at" | "updated_at" | "deleted_at"
>;