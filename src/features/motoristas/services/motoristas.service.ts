// cspell:disable-next-line
import api from "@/lib/api";
import type { ApiResponse, CreateMotoristaDTO, Motorista } from "@/types";

export type UpdateMotoristaDTO = Partial<CreateMotoristaDTO>;

export async function listarMotoristas(): Promise<Motorista[]> {
  const response = await api.get<ApiResponse<Motorista[]>>("/motoristas");
  return response.data.data;
}

export async function buscarMotoristaPorId(id: string): Promise<Motorista> {
  const response = await api.get<ApiResponse<Motorista>>(`/motoristas/${id}`);
  return response.data.data;
}

export async function criarMotorista(
  payload: CreateMotoristaDTO
): Promise<Motorista> {
  const response = await api.post<ApiResponse<Motorista>>("/motoristas", payload);
  return response.data.data;
}

export async function atualizarMotorista(
  id: string,
  payload: UpdateMotoristaDTO
): Promise<Motorista> {
  const response = await api.put<ApiResponse<Motorista>>(
    `/motoristas/${id}`,
    payload
  );
  return response.data.data;
}

export async function removerMotorista(id: string): Promise<void> {
  await api.delete<ApiResponse<unknown>>(`/motoristas/${id}`);
}

export const motoristasService = {
  getAll: listarMotoristas,
  listar: listarMotoristas,
  getById: buscarMotoristaPorId,
  buscarPorId: buscarMotoristaPorId,
  create: criarMotorista,
  criar: criarMotorista,
  update: atualizarMotorista,
  atualizar: atualizarMotorista,
  delete: removerMotorista,
  remover: removerMotorista,
};