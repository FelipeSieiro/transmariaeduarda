import api from "@/lib/api";


export interface Veiculo {
  id: string;
  placa: string;
  modelo: string;
  marca?: string | null;
  ano?: number | string | null;
  capacidade?: number | null;
  motorista_id?: string | null;
  status?: "ativo" | "inativo" | "manutencao" | string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

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