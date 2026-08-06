// src/constants/aluno.ts (ou src/constants/index.ts)

export enum Serie {
  PRIMEIRO_FUNDAMENTAL = "1º Fundamental",
  SEGUNDO_FUNDAMENTAL = "2º Fundamental",
  TERCEIRO_FUNDAMENTAL = "3º Fundamental",
  QUARTO_FUNDAMENTAL = "4º Fundamental",
  QUINTO_FUNDAMENTAL = "5º Fundamental",
  SEXTO_FUNDAMENTAL = "6º Fundamental",
  SETIMO_FUNDAMENTAL = "7º Fundamental",
  OITAVO_FUNDAMENTAL = "8º Fundamental",
  NONO_FUNDAMENTAL = "9º Fundamental",
  PRIMEIRO_MEDIO = "1º Médio",
  SEGUNDO_MEDIO = "2º Médio",
  TERCEIRO_MEDIO = "3º Médio",
}

export enum Turma {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  E = "E",
  F = "F",
  G = "G",
  H = "H",
  I = "I",
  J = "J",
  K = "K",
  L = "L",
  M = "M",
  N = "N",
  O = "O",
  P = "P",
  Q = "Q",
  R = "R",
  S = "S",
  T = "T",
  U = "U",
  V = "V",
  W = "W",
  X = "X",
  Y = "Y",
  Z = "Z",
}

export enum Turno {
  MANHA = "Manhã",
  TARDE = "Tarde",
  INTEGRAL = "Integral",
}

export enum StatusAluno {
  ATIVO = "ativo",
  INATIVO = "inativo",
}

// Interface genérica para opções de UI (<Select />, <Dropdown />, etc)
export interface SelectOption<T = string> {
  readonly value: T;
  readonly label: string;
}

// Arrays imutáveis para iteração
export const SERIES = Object.values(Serie) as readonly Serie[];
export const TURMAS = Object.values(Turma) as readonly Turma[];
export const TURNOS = Object.values(Turno) as readonly Turno[];
export const STATUS_ALUNO = Object.values(StatusAluno) as readonly StatusAluno[];

// Listas prontas para Selects/Formulários
export const SERIE_OPTIONS: readonly SelectOption<Serie>[] = SERIES.map(
  (serie) => ({ value: serie, label: serie })
);

export const TURMA_OPTIONS: readonly SelectOption<Turma>[] = TURMAS.map(
  (turma) => ({ value: turma, label: `Turma ${turma}` })
);

export const TURNO_OPTIONS: readonly SelectOption<Turno>[] = TURNOS.map(
  (turno) => ({ value: turno, label: turno })
);

export const STATUS_ALUNO_LABELS: Record<StatusAluno, string> = {
  [StatusAluno.ATIVO]: "Ativo",
  [StatusAluno.INATIVO]: "Inativo",
} as const;

export const STATUS_ALUNO_OPTIONS: readonly SelectOption<StatusAluno>[] = [
  { value: StatusAluno.ATIVO, label: STATUS_ALUNO_LABELS[StatusAluno.ATIVO] },
  { value: StatusAluno.INATIVO, label: STATUS_ALUNO_LABELS[StatusAluno.INATIVO] },
];