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
import Agenda from "@/pages/agenda/Agenda";
import Abastecimentos from "@/pages/Abastecimentos";
import Configuracoes from "@/pages/Configuracoes";
import Despesas from "@/pages/Despesas";
import Financeiro from "@/pages/Financeiro";
import Manutencoes from "@/pages/Manutencoes";
import Patrimonio from "@/pages/Patrimonio";
import Relatorios from "@/pages/Relatorios";

// Motoristas
import Motoristas from "@/pages/motoristas/Motoristas";
import NovoMotorista from "@/pages/motoristas/NovoMotorista";
import MotoristaDetalhes from "@/pages/motoristas/MotoristaDetalhes";

// Rotas
import Rotas from "@/pages/rotas/Rotas";
import NovaRota from "@/pages/rotas/NovaRota";
import RotaDetalhes from "@/pages/rotas/RotaDetalhes";

// Veículos
import Veiculos from "@/pages/veiculos/Veiculos";
import NovoVeiculo from "@/pages/veiculos/NovoVeiculo";
import VeiculoDetalhes from "@/pages/veiculos/VeiculoDetalhes";

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
      { path: "/patrimonio", element: <Patrimonio /> },
      { path: "/relatorios", element: <Relatorios /> },

      { path: "/motoristas", element: <Motoristas /> },
      { path: "/motoristas/novo", element: <NovoMotorista /> },
      { path: "/motoristas/:id", element: <MotoristaDetalhes /> },

      { path: "/rotas", element: <Rotas /> },
      { path: "/rotas/nova", element: <NovaRota /> },
      { path: "/rotas/:id", element: <RotaDetalhes /> },

      { path: "/veiculos", element: <Veiculos /> },
      { path: "/veiculos/novo", element: <NovoVeiculo /> },
      { path: "/veiculos/:id", element: <VeiculoDetalhes /> },
    ],
  },
]);