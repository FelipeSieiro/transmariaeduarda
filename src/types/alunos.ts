import { Responsavel } from "./responsavel";


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