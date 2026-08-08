import type { AgendamentoRota } from "@/features/agenda/types/agendamento";
import type { Aluno, CadastroAlunoCompleto } from "@/features/alunos/types/alunos";
import { createCrudService } from "@/services/http/create-crud-service";
import { agendamentoRotasService } from "@/features/agenda/services/agendamento-rotas.service";

const baseService = createCrudService<Aluno, Partial<Aluno>>("/alunos");

async function criarAlunoCompleto(
  payload: CadastroAlunoCompleto
): Promise<Aluno> {
  return baseService.create(payload);
}

async function buscarAlunoComContratos(id: string): Promise<Aluno> {
  const aluno = await baseService.getById(id);

  if (aluno.contratos && aluno.contratos.length > 0) {
    const primeiroContrato = aluno.contratos[0];
    if (primeiroContrato) {
      aluno.contrato = primeiroContrato;
      aluno.mensalidades = primeiroContrato.mensalidades ?? [];
    }
  }

  return aluno;
}

async function obterAgendamentosRotasDoAluno(
  alunoId: string
): Promise<AgendamentoRota[]> {
  return agendamentoRotasService.getByAlunoId(alunoId);
}

export const alunosService = {
  ...baseService,
  getAll: baseService.getAll,
  getById: buscarAlunoComContratos,
  create: baseService.create,
  update: baseService.update,
  remove: baseService.remove,
  criarAlunoCompleto,
  listarAlunos: baseService.getAll,
  buscarAluno: buscarAlunoComContratos,
  atualizarAluno: baseService.update,
  removerAluno: baseService.remove,
  obterAgendamentosRotasDoAluno,
};

export const listarAlunos = baseService.getAll;
export const buscarAluno = buscarAlunoComContratos;
export const atualizarAluno = baseService.update;
export const removerAluno = baseService.remove;
export { criarAlunoCompleto, obterAgendamentosRotasDoAluno };