import api from "@/lib/api";
import { CreateMotoristaDTO, Motorista } from "@/types";


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