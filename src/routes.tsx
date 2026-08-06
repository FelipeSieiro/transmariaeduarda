// src/router.ts

import { createBrowserRouter, Navigate } from "react-router-dom";

import AppLayout from "@/AppLayout";

import Responsaveis from "@/features/responsaveis/pages/Responsaveis";
import NovoResponsavel from "@/features/responsaveis/pages/NovoResponsavel";

import Alunos from "@/features/alunos/pages/Alunos";
import NovoAluno from "@/features/alunos/pages/NovoAluno";
import AlunoDetalhe from "@/features/alunos/pages/AlunoDetalhe";

import Contratos from "@/features/contratos/pages/Contratos";
import NovoContrato from "@/features/contratos/pages/NovoContrato";
import ContratoDetalhe from "@/features/contratos/pages/ContratoDetalhe";

import Dashboard from "@/pages/Dashboard";
import Agenda from "@/features/agenda/pages/Agenda";
import Abastecimentos from "@/pages/Abastecimentos";
import Configuracoes from "@/pages/Configuracoes";
import Despesas from "@/pages/Despesas";
import Financeiro from "@/pages/Financeiro";
import Manutencoes from "@/pages/Manutencoes";
import Patrimonio from "@/pages/Patrimonio";
import Relatorios from "@/pages/Relatorios";

import Motoristas from "@/features/motoristas/pages/Motoristas";
import NovoMotorista from "@/features/motoristas/pages/NovoMotorista";
import MotoristaDetalhes from "@/features/motoristas/pages/MotoristaDetalhes";

import Rotas from "@/features/rotas/pages/Rotas";
import NovaRota from "@/features/rotas/pages/NovaRota";
import RotaDetalhes from "@/features/rotas/pages/RotaDetalhes";

import Veiculos from "@/features/veiculos/pages/Veiculos";
import NovoVeiculo from "@/features/veiculos/pages/NovoVeiculo";
import VeiculoDetalhes from "@/features/veiculos/pages/VeiculoDetalhes";

// Importação das novas telas de autenticação separadas
import Register from "@/features/auth/pages/Register";
import Login from "@/features/auth/pages/Login";
import NotFound from "@/pages/NotFound";



function PrivateRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  {
    element: (
      <PrivateRoute>
        <AppLayout />
      </PrivateRoute>
    ),

    children: [
      {
        path: "/",
        element: <Dashboard />,
      },

      {
        path: "/alunos",
        element: <Alunos />,
      },
      {
        path: "/alunos/novo",
        element: <NovoAluno />,
      },
      {
        path: "/alunos/:alunoId",
        element: <AlunoDetalhe />,
      },

      {
        path: "/contratos",
        element: <Contratos />,
      },
      {
        path: "/contratos/novo",
        element: <NovoContrato />,
      },
      {
        path: "/contratos/:id",
        element: <ContratoDetalhe />,
      },

      {
        path: "/responsaveis",
        element: <Responsaveis />,
      },
      {
        path: "/responsaveis/novo",
        element: <NovoResponsavel />,
      },

      {
        path: "/agenda",
        element: <Agenda />,
      },

      {
        path: "/abastecimentos",
        element: <Abastecimentos />,
      },

      {
        path: "/configuracoes",
        element: <Configuracoes />,
      },

      {
        path: "/despesas",
        element: <Despesas />,
      },

      {
        path: "/financeiro",
        element: <Financeiro />,
      },

      {
        path: "/manutencoes",
        element: <Manutencoes />,
      },

      {
        path: "/patrimonio",
        element: <Patrimonio />,
      },

      {
        path: "/relatorios",
        element: <Relatorios />,
      },

      {
        path: "/motoristas",
        element: <Motoristas />,
      },

      {
        path: "/motoristas/novo",
        element: <NovoMotorista />,
      },

      {
        path: "/motoristas/:id",
        element: <MotoristaDetalhes />,
      },

      {
        path: "/rotas",
        element: <Rotas />,
      },

      {
        path: "/rotas/nova",
        element: <NovaRota />,
      },

      {
        path: "/rotas/:id",
        element: <RotaDetalhes />,
      },

      {
        path: "/veiculos",
        element: <Veiculos />,
      },

      {
        path: "/veiculos/novo",
        element: <NovoVeiculo />,
      },

      {
        path: "/veiculos/:id",
        element: <VeiculoDetalhes />,
      },

      // Rota curinga: qualquer caminho não mapeado dentro do layout privado
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },

  // Rota curinga global: cobre caminhos fora do layout privado (ex: usuário deslogado)
  {
    path: "*",
    element: <NotFound />,
  },
]);