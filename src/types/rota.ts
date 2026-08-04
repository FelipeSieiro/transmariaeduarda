export interface Rota {
  id: string;
  nome: string;
  descricao?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export type CreateRotaDTO = Omit<Rota, "id" | "created_at" | "updated_at" | "deleted_at">;
export type UpdateRotaDTO = Partial<CreateRotaDTO>;