// Fonte única dos caminhos da aplicação (usado pelo router, sidebar e navegações).
export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",

  DASHBOARD: "/dashboard",

  ALUNOS: "/alunos",
  ALUNO_NOVO: "/alunos/novo",
  ALUNO_DETALHE: (id: string) => `/alunos/${id}`,

  CONTRATOS: "/contratos",
  CONTRATO_NOVO: "/contratos/novo",
  CONTRATO_DETALHE: (id: string) => `/contratos/${id}`,

  RESPONSAVEIS: "/responsaveis",
  RESPONSAVEL_NOVO: "/responsaveis/novo",
  RESPONSAVEL_DETALHE: (id: string) => `/responsaveis/${id}`,
  RESPONSAVEL_EDITAR: (id: string) => `/responsaveis/${id}/editar`,

  AGENDA: "/agenda",

  MOTORISTAS: "/motoristas",
  MOTORISTA_NOVO: "/motoristas/novo",
  MOTORISTA_DETALHE: (id: string) => `/motoristas/${id}`,
  MOTORISTA_EDITAR: (id: string) => `/motoristas/${id}/editar`,

  ROTAS: "/rotas",
  ROTA_NOVA: "/rotas/nova",
  ROTA_DETALHE: (id: string) => `/rotas/${id}`,
  ROTA_EDITAR: (id: string) => `/rotas/${id}/editar`,

  VEICULOS: "/veiculos",
  VEICULO_NOVO: "/veiculos/novo",
  VEICULO_DETALHE: (id: string) => `/veiculos/${id}`,
  VEICULO_EDITAR: (id: string) => `/veiculos/${id}/editar`,

  ABASTECIMENTOS: "/abastecimentos",
  CONFIGURACOES: "/configuracoes",
  DESPESAS: "/despesas",
  FINANCEIRO: "/financeiro",
  MANUTENCOES: "/manutencoes",
  PATRIMONIO: "/patrimonio",
  RELATORIOS: "/relatorios",
} as const;
