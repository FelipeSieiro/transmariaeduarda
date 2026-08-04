import { createBrowserRouter } from "react-router-dom";

import AppLayout from "@/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Alunos from "@/pages/Alunos";
import AlunoDetalhe from "@/pages/AlunoDetalhe";
import Agenda from "@/pages/Agenda";
import Abastecimentos from "@/pages/Abastecimentos";
import Configuracoes from "@/pages/Configuracoes";

import Despesas from "@/pages/Despesas";
import Financeiro from "@/pages/Financeiro";
import Manutencoes from "@/pages/Manutencoes";
import Motoristas from "@/pages/Motoristas";
import Patrimonio from "@/pages/Patrimonio";
import Relatorios from "@/pages/Relatorios";
import Responsaveis from "@/pages/Responsaveis";
import Rotas from "@/pages/Rotas";
import Veiculos from "@/pages/Veiculos";
import NovoAluno from "./pages/NovoAluno";
import NovoResponsavel from "./pages/NovoResponsavel";
import Contratos from "./pages/contratos/Contratos";
import NovoContrato from "./pages/contratos/NovoContrato";
import ContratoDetalhe from "./pages/contratos/ContratoDetalhe";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/alunos", element: <Alunos /> },
      { path: "/alunos/:alunoId", element: <AlunoDetalhe /> },
      { path: "/agenda", element: <Agenda /> },
      { path: "/abastecimentos", element: <Abastecimentos /> },
      { path: "/configuracoes", element: <Configuracoes /> },
      { path: "/contratos", element: <Contratos /> },
      { path: "/contratos/novo", element: <NovoContrato /> },
      { path: "/contratos/:id", element: <ContratoDetalhe /> },
      { path: "/despesas", element: <Despesas /> },
      { path: "/financeiro", element: <Financeiro /> },
      { path: "/manutencoes", element: <Manutencoes /> },
      { path: "/motoristas", element: <Motoristas /> },
      { path: "/patrimonio", element: <Patrimonio /> },
      { path: "/relatorios", element: <Relatorios /> },
      { path: "/responsaveis", element: <Responsaveis /> },
      { path: "/rotas", element: <Rotas /> },
      { path: "/veiculos", element: <Veiculos /> },
      { path: "/responsaveis/novo", element: <NovoResponsavel /> },
      { path: "/alunos/novo", element: <NovoAluno /> }
    ],
  },
]);
