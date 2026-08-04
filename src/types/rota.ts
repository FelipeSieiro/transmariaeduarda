export interface Rota {
  id: string;
  nome: string;
  descricao?: string | null;
  bairro?: string | null;
  horario_saida?: string | null;
  horario_retorno?: string | null;
  motorista_id?: string | null;
  veiculo_id?: string | null;
  status: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export type CreateRotaDTO = Omit<Rota, "id" | "created_at" | "updated_at" | "deleted_at">;
export type UpdateRotaDTO = Partial<CreateRotaDTO>;