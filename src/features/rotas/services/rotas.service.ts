// cspell:disable-next-line
import api from "@/config/api";
import type {
  CreateRotaDTO,
  Rota,
  UpdateRotaDTO,
} from "@/features/rotas/types/rota";
import type { ApiResponse } from "@/types/shared";

export async function listarRotas(): Promise<Rota[]> {
  const response = await api.get<ApiResponse<Rota[]>>("/rotas");
  return response.data.data;
}

export async function buscarRotaPorId(id: string): Promise<Rota> {
  const response = await api.get<ApiResponse<Rota>>(`/rotas/${id}`);
  return response.data.data;
}

export async function criarRota(payload: CreateRotaDTO): Promise<Rota> {
  const response = await api.post<ApiResponse<Rota>>("/rotas", payload);
  return response.data.data;
}

export async function atualizarRota(
  id: string,
  payload: UpdateRotaDTO
): Promise<Rota> {
  const response = await api.put<ApiResponse<Rota>>(`/rotas/${id}`, payload);
  return response.data.data;
}

export async function atualizarStatusRota(
  id: string,
  status: string
): Promise<Rota> {
  const response = await api.patch<ApiResponse<Rota>>(`/rotas/${id}/status`, {
    status,
  });
  return response.data.data;
}

export async function removerRota(id: string): Promise<void> {
  await api.delete<ApiResponse<unknown>>(`/rotas/${id}`);
}

export const rotasService = {
  getAll: listarRotas,
  listar: listarRotas,
  getById: buscarRotaPorId,
  buscarPorId: buscarRotaPorId,
  create: criarRota,
  criar: criarRota,
  update: atualizarRota,
  atualizar: atualizarRota,
  updateStatus: atualizarStatusRota,
  atualizarStatus: atualizarStatusRota,
  delete: removerRota,
  remover: removerRota,
};