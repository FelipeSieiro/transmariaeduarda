import api from "@/config/api";
import type { AgendamentoRota } from "@/features/agenda/types/agendamento";
import type { Aluno, CadastroAlunoCompleto } from "@/features/alunos/types/alunos";
import type { ApiResponse } from "@/types/shared";
import { agendamentoRotasService } from "@/features/agenda/services/agendamento-rotas.service";

export async function criarAluno(aluno: Partial<Aluno>): Promise<Aluno> {
  const response = await api.post<ApiResponse<Aluno>>("/alunos", aluno);
  return response.data.data;
}

export async function criarAlunoCompleto(
  payload: CadastroAlunoCompleto
): Promise<Aluno> {
  const response = await api.post<ApiResponse<Aluno>>("/alunos/completo", payload);
  return response.data.data;
}

export async function listarAlunos(): Promise<Aluno[]> {
  const response = await api.get<ApiResponse<Aluno[]>>("/alunos");
  return response.data.data;
}

export async function buscarAluno(id: string): Promise<Aluno> {
  const response = await api.get<ApiResponse<Aluno>>(`/alunos/${id}`);
  const aluno = response.data.data;

  if (aluno.contratos && aluno.contratos.length > 0) {
    aluno.contrato = aluno.contratos[0];
    aluno.mensalidades = aluno.contratos[0].mensalidades ?? [];
  }

  return aluno;
}

export async function atualizarAluno(
  id: string,
  aluno: Partial<Aluno>
): Promise<Aluno> {
  const response = await api.put<ApiResponse<Aluno>>(`/alunos/${id}`, aluno);
  return response.data.data;
}

export async function removerAluno(id: string): Promise<void> {
  await api.delete<ApiResponse<unknown>>(`/alunos/${id}`);
}

export async function obterAgendamentosRotasDoAluno(
  alunoId: string
): Promise<AgendamentoRota[]> {
  return agendamentoRotasService.getByAlunoId(alunoId);
}

export const alunosService = {
  criarAluno,
  criarAlunoCompleto,
  listarAlunos,
  buscarAluno,
  atualizarAluno,
  removerAluno,
  obterAgendamentosRotasDoAluno,
};