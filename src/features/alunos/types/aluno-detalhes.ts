// Tipos para detalhes e anexos do aluno (documentos, fotos, histórico, ocorrências)

export interface DocumentoAluno {
  id?: string;
  nome: string;
  tipo?: string;
  tamanho?: string;
  url?: string;
}

export interface FotoAluno {
  id?: string;
  url?: string;
  descricao?: string;
  legenda?: string;
}

export interface EventoHistorico {
  id?: string;
  data?: string;
  hora?: string;
  tipo?: string;
  titulo?: string;
  descricao?: string;
  usuario?: string;
  created_at?: string;
}

export interface OcorrenciaAluno {
  id?: string;
  data?: string;
  tipo?: string;
  titulo?: string;
  descricao?: string;
  observacao?: string;
  gravidade?: string;
  nivel?: string;
  created_at?: string;
}
