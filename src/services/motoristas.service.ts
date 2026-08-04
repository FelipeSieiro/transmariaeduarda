import api from "@/lib/api";

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

export type UpdateMotoristaDTO = Partial<CreateMotoristaDTO>;

export const motoristasService = {
  async getAll(): Promise<Motorista[]> {
    const response = await api.get<{ success: boolean; data: Motorista[] }>("/motoristas");
    return response.data.data;
  },

  async getById(id: string): Promise<Motorista> {
    const response = await api.get<{ success: boolean; data: Motorista }>(`/motoristas/${id}`);
    return response.data.data;
  },

  async create(payload: CreateMotoristaDTO): Promise<Motorista> {
    const response = await api.post<{ success: boolean; data: Motorista }>("/motoristas", payload);
    return response.data.data;
  },

  async update(id: string, payload: UpdateMotoristaDTO): Promise<Motorista> {
    const response = await api.put<{ success: boolean; data: Motorista }>(`/motoristas/${id}`, payload);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/motoristas/${id}`);
  },
};