import { createBrowserRouter } from "react-router-dom";

import AppLayout from "@/AppLayout";


import Responsaveis from "@/pages/responsaveis/Responsaveis";
import NovoResponsavel from "@/pages/responsaveis/NovoResponsavel";

import Alunos from "@/pages/alunos/Alunos";
import NovoAluno from "@/pages/alunos/NovoAluno";
import AlunoDetalhe from "@/pages/alunos/AlunoDetalhe";

import Contratos from "@/pages/contratos/Contratos";
import NovoContrato from "@/pages/contratos/NovoContrato";
import ContratoDetalhe from "@/pages/contratos/ContratoDetalhe";

import Dashboard from "@/pages/Dashboard";
import Agenda from "@/pages/Agenda";
import Abastecimentos from "@/pages/Abastecimentos";
import Configuracoes from "@/pages/Configuracoes";
import Despesas from "@/pages/Despesas";
import Financeiro from "@/pages/Financeiro";
import Manutencoes from "@/pages/Manutencoes";
import Motoristas from "@/pages/Motoristas";
import Patrimonio from "@/pages/Patrimonio";
import Relatorios from "@/pages/Relatorios";
import Rotas from "@/pages/Rotas";
import Veiculos from "@/pages/Veiculos";


export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Dashboard /> },


      { path: "/alunos", element: <Alunos /> },
      { path: "/alunos/novo", element: <NovoAluno /> },
      { path: "/alunos/:alunoId", element: <AlunoDetalhe /> },

      { path: "/contratos", element: <Contratos /> },
      { path: "/contratos/novo", element: <NovoContrato /> },
      { path: "/contratos/:id", element: <ContratoDetalhe /> },

      { path: "/responsaveis", element: <Responsaveis /> },
      { path: "/responsaveis/novo", element: <NovoResponsavel /> },

      { path: "/agenda", element: <Agenda /> },
      { path: "/abastecimentos", element: <Abastecimentos /> },
      { path: "/configuracoes", element: <Configuracoes /> },
      { path: "/despesas", element: <Despesas /> },
      { path: "/financeiro", element: <Financeiro /> },
      { path: "/manutencoes", element: <Manutencoes /> },
      { path: "/motoristas", element: <Motoristas /> },
      { path: "/patrimonio", element: <Patrimonio /> },
      { path: "/relatorios", element: <Relatorios /> },
      { path: "/rotas", element: <Rotas /> },
      { path: "/veiculos", element: <Veiculos /> },
    ],
  },
]);