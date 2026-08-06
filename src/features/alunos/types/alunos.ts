import type { Contrato, ContratoDetalhe, HistoricoItemDetalhe } from "@/features/contratos/types/contrato";
import type { EscolaResumida } from "@/types/escola";
import type { Mensalidade } from "./mensalidade";
import type {
  AlunoResponsavelVinculo,
  PayloadResponsavelVinculo,
  Responsavel,
  ResponsavelDetalhe,
} from "@/features/responsaveis/types/responsavel";
import type { RotaResumida } from "@/features/rotas/types/rota";

export type StatusAluno = "ativo" | "inativo" | string;

export interface Aluno {
  id: string;
  matricula: string;
  nome: string;
  foto_url?: string | null;
  data_nascimento?: string | null;
  data_inicio?: string | null;
  created_at?: string;
  updated_at?: string;

  // Escola
  escola_id?: string | null;
  escolas?: EscolaResumida | null;

  // Turma e Período
  serie?: string | null;
  turno?: string | null;

  // Endereço
  endereco?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  cep?: string | null;

  // Rota
  rota_id?: string | null;
  rotas?: RotaResumida | null;

  // Financeiro e Status
  mensalidade?: number | string | null;
  status?: StatusAluno | null;

  // Vinculações
  responsavel?: Responsavel | null;
  aluno_responsavel?: AlunoResponsavelVinculo[];
  alunos_responsaveis?: AlunoResponsavelVinculo[];
  contratos?: Contrato[];
  contrato?: Contrato;
  mensalidades?: Mensalidade[];
}

export interface CadastroAlunoCompleto {
  aluno: Partial<Aluno>;
  responsaveis: PayloadResponsavelVinculo[];
  contrato?: Contrato;
}

export interface AlunoDetalhe {
  id: string;
  nome: string;
  foto: string;
  nascimento: string;
  escola: string;
  serie: string;
  turno: string;

  // Endereço Aluno
  endereco: string;
  bairro: string;
  cidade: string;

  // Responsáveis
  responsaveis: ResponsavelDetalhe[];
  responsavel: string;
  parentesco: string;
  telefone: string;
  email: string;
  enderecoResponsavel: string;
  bairroResponsavel: string;
  cidadeResponsavel: string;

  // Transporte e Rota
  motorista: string;
  veiculo: string;
  rota: string;

  // Status e Contrato
  mensalidade: number;
  status: "ativo" | "inativo";
  pagamento: string;
  desde: string;
  contrato: ContratoDetalhe;

  // Coleções
  mensalidades: unknown[];
  ocorrencias: unknown[];
  historico: HistoricoItemDetalhe[];
  documentos: unknown[];
}
