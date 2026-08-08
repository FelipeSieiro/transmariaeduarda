import api from "@/config/api";
import type { ApiResponse } from "@/types/shared";
import type { Escola } from "@/features/escolas/types/escola";

export async function listarEscolas(): Promise<Escola[]> {
  const response = await api.get<ApiResponse<Escola[]> | Escola[]>("/escolas");

  if (Array.isArray(response.data)) {
    return response.data;
  }

  return response.data.data ?? [];
}

export async function buscarEscolaPorId(id: string): Promise<Escola> {
  const response = await api.get<ApiResponse<Escola>>(`/escolas/${id}`);
  return response.data.data;
}

export async function criarEscola(escola: Partial<Escola>): Promise<Escola> {
  const response = await api.post<ApiResponse<Escola>>("/escolas", escola);
  return response.data.data;
}

export async function atualizarEscola(
  id: string,
  escola: Partial<Escola>
): Promise<Escola> {
  const response = await api.put<ApiResponse<Escola>>(`/escolas/${id}`, escola);
  return response.data.data;
}

export async function removerEscola(id: string): Promise<void> {
  await api.delete<ApiResponse<unknown>>(`/escolas/${id}`);
}

export const escolasService = {
  getAll: listarEscolas,
  listar: listarEscolas,
  buscarPorId: buscarEscolaPorId,
  criar: criarEscola,
  atualizar: atualizarEscola,
  remover: removerEscola,
};