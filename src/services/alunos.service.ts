import api from "@/lib/api";

export interface Responsavel {
  id: string;
  nome: string;
  cpf?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  observacoes?: string;
}

export interface Mensalidade {
  id: string;
  contrato_id: string;
  competencia: string;
  valor: number;
  data_vencimento: string;
  status?: "pendente" | "pago" | "atrasado" | "cancelado" | string | null;
  data_pagamento?: string | null;
  forma_pagamento?: string | null;
  observacoes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Contrato {
  id?: string;
  aluno_id?: string;
  numero?: string;
  data_inicio?: string;
  data_fim?: string | null;
  valor_mensalidade?: number;
  dia_vencimento?: number;
  forma_pagamento?: string;
  observacoes?: string;
  status?: string;
  mensalidades?: Mensalidade[];
}

export interface Aluno {
  id: string;
  matricula: string;
  nome: string;
  foto_url?: string | null;
  data_nascimento?: string | null;
  data_inicio?: string | null;
  created_at?: string;
  updated_at?: string;
  escola_id?: string | null;
  escolas?: {
    id: string;
    nome: string;
  } | null;
  serie?: string | null;
  turno?: string | null;
  endereco?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  cep?: string | null;
  rota_id?: string | null;
  rotas?: {
    id: string;
    nome: string;
  } | null;
  status?: string | null;
  responsavel?: Responsavel | null;
  aluno_responsavel?: Array<{
    id?: string;
    responsavel_id?: string;
    responsavel?: Responsavel;
    parentesco?: string;
    responsavel_financeiro?: boolean;
    responsavel_emergencia?: boolean;
  }>;
  alunos_responsaveis?: Array<{
    responsavel_id?: string;
    responsavel?: Responsavel;
    parentesco?: string;
  }>;
  contratos?: Contrato[];
  contrato?: Contrato;
  mensalidades?: Mensalidade[];
}

export interface CadastroAlunoCompleto {
  aluno: Partial<Aluno>;
  responsaveis: Array<{
    responsavel_id: string;
    parentesco?: string;
    responsavel_financeiro?: boolean;
    responsavel_emergencia?: boolean;
  }>;
  contrato?: Contrato;
}

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