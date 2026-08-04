import api from "@/lib/api";
import type { Rota, CreateRotaDTO, UpdateRotaDTO } from "@/types/rota";

export const rotasService = {
  async getAll(): Promise<Rota[]> {
    const response = await api.get<{ success: boolean; data: Rota[] }>("/rotas");
    return response.data.data;
  },

  async getById(id: string): Promise<Rota> {
    const response = await api.get<{ success: boolean; data: Rota }>(`/rotas/${id}`);
    return response.data.data;
  },

  async create(payload: CreateRotaDTO): Promise<Rota> {
    const response = await api.post<{ success: boolean; data: Rota }>("/rotas", payload);
    return response.data.data;
  },

  async update(id: string, payload: UpdateRotaDTO): Promise<Rota> {
    const response = await api.put<{ success: boolean; data: Rota }>(`/rotas/${id}`, payload);
    return response.data.data;
  },

  async updateStatus(id: string, status: string): Promise<Rota> {
    const response = await api.patch<{ success: boolean; data: Rota }>(`/rotas/${id}/status`, { status });
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/rotas/${id}`);
  },
};

// Aliases para compatibilidade com importações diretas
export const listarRotas = rotasService.getAll;
export const removerRota = rotasService.delete;