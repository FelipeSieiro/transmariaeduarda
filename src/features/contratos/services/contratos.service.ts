import api from "@/config/api";
import type { ApiResponse } from "@/types/shared";
import type { Contrato, CriarContratoPayload } from "@/features/contratos/types/contrato";
import { createCrudService } from "@/services/http/create-crud-service";

const baseService = createCrudService<Contrato, CriarContratoPayload>("/contratos");

async function buscarContratoPorAlunoId(
  alunoId: string
): Promise<Contrato[]> {
  const response = await api.get<ApiResponse<Contrato[]>>("/contratos", {
    params: { aluno_id: alunoId },
  });

  const contratos = response.data.data;

  if (!contratos || contratos.length === 0) {
    return [];
  }

  return contratos;
}

export const contratosService = {
  ...baseService,
  getAll: baseService.getAll,
  getById: baseService.getById,
  create: baseService.create,
  update: baseService.update,
  remove: baseService.remove,
  listarContratos: baseService.getAll,
  buscarContrato: baseService.getById,
  buscarContratoPorAluno: buscarContratoPorAlunoId,
  criarContrato: baseService.create,
};

export const listarContratos = baseService.getAll;
export const buscarContrato = baseService.getById;
export const buscarContratoPorAluno = buscarContratoPorAlunoId;
export const criarContrato = baseService.create;