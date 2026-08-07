import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";

import { PageLoader } from "@/components/common/page-loader";
import { ROUTES } from "@/constants/routes";
import AppLayout from "@/layouts/AppLayout";
import { PrivateRoute } from "@/routes/private-route";

// Code splitting por rota: cada página vira um chunk carregado sob demanda.
const Login = lazy(() => import("@/features/auth/pages/Login"));
const Register = lazy(() => import("@/features/auth/pages/Register"));

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const Alunos = lazy(() => import("@/features/alunos/pages/Alunos"));
const NovoAluno = lazy(() => import("@/features/alunos/pages/NovoAluno"));
const AlunoDetalhe = lazy(() => import("@/features/alunos/pages/AlunoDetalhe"));

const Contratos = lazy(() => import("@/features/contratos/pages/Contratos"));
const NovoContrato = lazy(
  () => import("@/features/contratos/pages/NovoContrato"),
);
const ContratoDetalhe = lazy(
  () => import("@/features/contratos/pages/ContratoDetalhe"),
);

const Responsaveis = lazy(
  () => import("@/features/responsaveis/pages/Responsaveis"),
);
const NovoResponsavel = lazy(
  () => import("@/features/responsaveis/pages/NovoResponsavel"),
);

const Agenda = lazy(() => import("@/features/agenda/pages/Agenda"));

const Motoristas = lazy(() => import("@/features/motoristas/pages/Motoristas"));
const NovoMotorista = lazy(
  () => import("@/features/motoristas/pages/NovoMotorista"),
);
const MotoristaDetalhes = lazy(
  () => import("@/features/motoristas/pages/MotoristaDetalhes"),
);

const Rotas = lazy(() => import("@/features/rotas/pages/Rotas"));
const NovaRota = lazy(() => import("@/features/rotas/pages/NovaRota"));
const RotaDetalhes = lazy(() => import("@/features/rotas/pages/RotaDetalhes"));

const Veiculos = lazy(() => import("@/features/veiculos/pages/Veiculos"));
const NovoVeiculo = lazy(() => import("@/features/veiculos/pages/NovoVeiculo"));
const VeiculoDetalhes = lazy(
  () => import("@/features/veiculos/pages/VeiculoDetalhes"),
);

const Abastecimentos = lazy(() => import("@/pages/Abastecimentos"));
const Configuracoes = lazy(() => import("@/pages/Configuracoes"));
const Despesas = lazy(() => import("@/pages/Despesas"));
const Financeiro = lazy(() => import("@/pages/Financeiro"));
const Manutencoes = lazy(() => import("@/pages/Manutencoes"));
const Patrimonio = lazy(() => import("@/pages/Patrimonio"));
const Relatorios = lazy(() => import("@/pages/Relatorios"));

function suspended(element: ReactNode) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  { path: ROUTES.LOGIN, element: suspended(<Login />) },
  { path: ROUTES.REGISTER, element: suspended(<Register />) },

  {
    element: (
      <PrivateRoute>
        <AppLayout />
      </PrivateRoute>
    ),
    children: [
      { path: ROUTES.DASHBOARD, element: suspended(<Dashboard />) },

      { path: ROUTES.ALUNOS, element: suspended(<Alunos />) },
      { path: ROUTES.ALUNO_NOVO, element: suspended(<NovoAluno />) },
      { path: "/alunos/:alunoId", element: suspended(<AlunoDetalhe />) },

      { path: ROUTES.CONTRATOS, element: suspended(<Contratos />) },
      { path: ROUTES.CONTRATO_NOVO, element: suspended(<NovoContrato />) },
      { path: "/contratos/:id", element: suspended(<ContratoDetalhe />) },

      { path: ROUTES.RESPONSAVEIS, element: suspended(<Responsaveis />) },
      {
        path: ROUTES.RESPONSAVEL_NOVO,
        element: suspended(<NovoResponsavel />),
      },

      { path: ROUTES.AGENDA, element: suspended(<Agenda />) },

      { path: ROUTES.MOTORISTAS, element: suspended(<Motoristas />) },
      { path: ROUTES.MOTORISTA_NOVO, element: suspended(<NovoMotorista />) },
      { path: "/motoristas/:id", element: suspended(<MotoristaDetalhes />) },

      { path: ROUTES.ROTAS, element: suspended(<Rotas />) },
      { path: ROUTES.ROTA_NOVA, element: suspended(<NovaRota />) },
      { path: "/rotas/:id", element: suspended(<RotaDetalhes />) },

      { path: ROUTES.VEICULOS, element: suspended(<Veiculos />) },
      { path: ROUTES.VEICULO_NOVO, element: suspended(<NovoVeiculo />) },
      { path: "/veiculos/:id", element: suspended(<VeiculoDetalhes />) },

      { path: ROUTES.ABASTECIMENTOS, element: suspended(<Abastecimentos />) },
      { path: ROUTES.CONFIGURACOES, element: suspended(<Configuracoes />) },
      { path: ROUTES.DESPESAS, element: suspended(<Despesas />) },
      { path: ROUTES.FINANCEIRO, element: suspended(<Financeiro />) },
      { path: ROUTES.MANUTENCOES, element: suspended(<Manutencoes />) },
      { path: ROUTES.PATRIMONIO, element: suspended(<Patrimonio />) },
      { path: ROUTES.RELATORIOS, element: suspended(<Relatorios />) },

      // Qualquer caminho não mapeado dentro do layout privado.
      { path: "*", element: suspended(<NotFound />) },
    ],
  },

  // Caminhos fora do layout privado (ex.: usuário deslogado).
  { path: "*", element: suspended(<NotFound />) },
]);
