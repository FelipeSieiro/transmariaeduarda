import api from "@/lib/api";
import type { ApiResponse, Contrato, CriarContratoPayload } from "@/types";

export async function listarContratos(): Promise<Contrato[]> {
  const response = await api.get<ApiResponse<Contrato[]>>("/contratos");
  return response.data.data;
}

export async function buscarContrato(id: string): Promise<Contrato | null> {
  const response = await api.get<ApiResponse<Contrato>>(`/contratos/${id}`);
  return response.data.data ?? null;
}

export async function buscarContratoPorAluno(
  alunoId: string
): Promise<Contrato | null> {
  const response = await api.get<ApiResponse<Contrato[]>>("/contratos", {
    params: { aluno_id: alunoId },
  });

  const contratos = response.data.data;

  if (!contratos || contratos.length === 0) {
    return null;
  }

  return contratos[0];
}

export async function criarContrato(
  payload: CriarContratoPayload
): Promise<Contrato> {
  const response = await api.post<ApiResponse<Contrato>>("/contratos", payload);
  return response.data.data;
}

export const contratosService = {
  listarContratos,
  buscarContrato,
  buscarContratoPorAluno,
  criarContrato,
};