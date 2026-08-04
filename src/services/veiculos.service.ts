import api from "@/lib/api";
import { ApiResponse, Veiculo } from "@/types";


export const veiculosService = {
  async getAll(): Promise<Veiculo[]> {
    const response = await api.get<ApiResponse<Veiculo[]>>("/veiculos");
    return response.data.data || [];
  },

  async getById(id: string): Promise<Veiculo> {
    const response = await api.get<ApiResponse<Veiculo>>(`/veiculos/${id}`);
    return response.data.data;
  },

  async create(data: Partial<Veiculo>): Promise<Veiculo> {
    const response = await api.post<ApiResponse<Veiculo>>("/veiculos", data);
    return response.data.data;
  },

  async update(id: string, data: Partial<Veiculo>): Promise<Veiculo> {
    const response = await api.put<ApiResponse<Veiculo>>(`/veiculos/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/veiculos/${id}`);
  },
};