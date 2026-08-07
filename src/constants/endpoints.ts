// Fonte única dos endpoints da API (relativos à baseURL do axios).
export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    ME: "/auth/me",
  },

  ALUNOS: "/alunos",
  ALUNOS_COMPLETO: "/alunos/completo",
  ALUNO_AGENDAMENTOS: (alunoId: string) =>
    `/alunos/${alunoId}/agendamentos-rotas`,

  CONTRATOS: "/contratos",
  ESCOLAS: "/escolas",
  MOTORISTAS: "/motoristas",
  RESPONSAVEIS: "/responsaveis",
  ROTAS: "/rotas",
  VEICULOS: "/veiculos",

  MENSALIDADES_POR_CONTRATO: (contratoId: string) =>
    `/mensalidades/contrato/${contratoId}`,
  MENSALIDADE_PAGAR: (id: string) => `/mensalidades/${id}/pagar`,
} as const;
