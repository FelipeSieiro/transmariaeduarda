import api from "@/lib/api";
import { Aluno, CadastroAlunoCompleto } from "@/types";


export async function criarAluno(aluno: Partial<Aluno>): Promise<Aluno> {
  const response = await api.post("/alunos", aluno);
  return response.data.data as Aluno;
}

export async function criarAlunoCompleto(payload: CadastroAlunoCompleto): Promise<Aluno> {
  const response = await api.post("/alunos/completo", payload);
  return response.data.data as Aluno;
}

export async function listarAlunos(): Promise<Aluno[]> {
  const response = await api.get("/alunos");
  return response.data.data as Aluno[];
}

export async function buscarAluno(id: string): Promise<Aluno> {
  const response = await api.get(`/alunos/${id}`);
  const aluno = response.data.data as Aluno;

  if (aluno.contratos && aluno.contratos.length > 0) {
    aluno.contrato = aluno.contratos[0];
    aluno.mensalidades = aluno.contratos[0].mensalidades ?? [];
  }

  return aluno;
}

export async function atualizarAluno(id: string, aluno: Partial<Aluno>): Promise<Aluno> {
  const response = await api.put(`/alunos/${id}`, aluno);
  return response.data.data as Aluno;
}

export async function removerAluno(id: string): Promise<any> {
  const response = await api.delete(`/alunos/${id}`);
  return response.data;
}

export async function obterAgendamentosRotasDoAluno(alunoId: string) {
  const response = await api.get(`/alunos/${alunoId}/agendamentos-rotas`);
  return response.data?.data ?? response.data ?? [];
}