// cspell:disable-next-line
import api from "@/lib/api";
import type { ApiResponse, Responsavel } from "@/types";

export async function listarResponsaveis(): Promise<Responsavel[]> {
  const response = await api.get<ApiResponse<Responsavel[]>>("/responsaveis");
  return response.data.data;
}

export async function buscarResponsavel(id: string): Promise<Responsavel> {
  const response = await api.get<ApiResponse<Responsavel>>(`/responsaveis/${id}`);
  return response.data.data;
}

export async function criarResponsavel(
  responsavel: Partial<Responsavel>
): Promise<Responsavel> {
  const response = await api.post<ApiResponse<Responsavel | Responsavel[]>>(
    "/responsaveis",
    responsavel
  );
  const data = response.data.data;

  return Array.isArray(data) ? data[0] : data;
}

export async function atualizarResponsavel(
  id: string,
  responsavel: Partial<Responsavel>
): Promise<Responsavel> {
  const response = await api.put<ApiResponse<Responsavel>>(
    `/responsaveis/${id}`,
    responsavel
  );
  return response.data.data;
}

export async function removerResponsavel(id: string): Promise<void> {
  await api.delete<ApiResponse<unknown>>(`/responsaveis/${id}`);
}

export const responsaveisService = {
  getAll: listarResponsaveis,
  listar: listarResponsaveis,
  getById: buscarResponsavel,
  buscarPorId: buscarResponsavel,
  create: criarResponsavel,
  criar: criarResponsavel,
  update: atualizarResponsavel,
  atualizar: atualizarResponsavel,
  delete: removerResponsavel,
  remover: removerResponsavel,
};