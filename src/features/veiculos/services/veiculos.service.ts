// cspell:disable-next-line
import api from "@/config/api";
import type { ApiResponse, Veiculo } from "@/types";

export async function listarVeiculos(): Promise<Veiculo[]> {
  const response = await api.get<ApiResponse<Veiculo[]>>("/veiculos");
  return response.data.data ?? [];
}

export async function buscarVeiculoPorId(id: string): Promise<Veiculo> {
  const response = await api.get<ApiResponse<Veiculo>>(`/veiculos/${id}`);
  return response.data.data;
}

export async function criarVeiculo(payload: Partial<Veiculo>): Promise<Veiculo> {
  const response = await api.post<ApiResponse<Veiculo>>("/veiculos", payload);
  return response.data.data;
}

export async function atualizarVeiculo(
  id: string,
  payload: Partial<Veiculo>
): Promise<Veiculo> {
  const response = await api.put<ApiResponse<Veiculo>>(
    `/veiculos/${id}`,
    payload
  );
  return response.data.data;
}

export async function removerVeiculo(id: string): Promise<void> {
  await api.delete<ApiResponse<unknown>>(`/veiculos/${id}`);
}

export const veiculosService = {
  getAll: listarVeiculos,
  listar: listarVeiculos,
  getById: buscarVeiculoPorId,
  buscarPorId: buscarVeiculoPorId,
  create: criarVeiculo,
  criar: criarVeiculo,
  update: atualizarVeiculo,
  atualizar: atualizarVeiculo,
  delete: removerVeiculo,
  remover: removerVeiculo,
};