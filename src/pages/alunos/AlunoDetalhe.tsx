// src/pages/AlunoDetalhe.tsx

import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Bus } from "lucide-react";
import { toast } from "sonner";

import { buscarAluno } from "@/services/alunos.service";
import { buscarContratoPorAluno } from "@/services/contratos.service";

import { adaptarAlunoDetalhe } from "@/adapters/alunoDetalhe.adapter";

import {
  type Aluno,
  alunos as alunosMock,
  brlExato,
} from "@/data/mock";

import type { Contrato } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { SectionCard } from "@/components/ui-kit/primitives";

import { AlunoHeader } from "@/components/alunos/AlunoHeader";
import { AlunoDadosPessoais } from "@/components/alunos/AlunoDadosPessoais";
import { AlunoEndereco } from "@/components/alunos/AlunoEndereco";
import { AlunoResponsaveis } from "@/components/alunos/AlunoResponsaveis";
import { AlunoContrato } from "@/components/alunos/AlunoContrato";
import { TabelaMensalidades } from "@/components/alunos/TabelaMensalidades";
import { AlunoOcorrencias } from "@/components/alunos/AlunoOcorrencias";
import {
  AlunoHistorico,
  type EventoHistorico,
} from "@/components/alunos/AlunoHistorico";
import { AlunoDocumentos } from "@/components/alunos/AlunoDocumentos";
import { AlunoFotos } from "@/components/alunos/AlunoFotos";
import { GradeSemanalRotas } from "@/components/agenda/GradeSemanalRotas";

function converterParaTimestamp(dataStr?: string): number {
  if (!dataStr) return 0;

  if (dataStr.includes("-")) {
    const timestamp = new Date(dataStr).getTime();
    return Number.isNaN(timestamp) ? 0 : timestamp;
  }

  const partes = dataStr.split("/");

  if (partes.length === 3) {
    const [dia, mes, ano] = partes.map(Number);
    return new Date(ano, mes - 1, dia).getTime();
  }

  return 0;
}

export default function AlunoDetalhe() {
  const { alunoId } = useParams();

  const [aluno, setAluno] =
    useState<Aluno | null>(null);

  const [carregando, setCarregando] =
    useState(true);

  const [contrato, setContrato] =
    useState<Contrato | null>(null);

  useEffect(() => {
    async function carregarDados() {
      if (!alunoId) return;

      let alunoData: Aluno | null = null;

      try {
        const response = await buscarAluno(alunoId);

        alunoData =
          adaptarAlunoDetalhe(response);

        setAluno(alunoData);
      } catch (error) {
        console.error(
          "Erro ao buscar aluno API:",
          error
        );

        const alunoMock = alunosMock.find(
          (item) => item.id === alunoId
        );

        if (alunoMock) {
          alunoData = alunoMock;
          setAluno(alunoMock);
        } else {
          toast.error(
            "Não foi possível carregar os dados do aluno."
          );
        }
      }

      try {
        const contratoApi =
          await buscarContratoPorAluno(alunoId);

        setContrato(contratoApi);
      } catch (error) {
        console.error(
          "Erro ao buscar contrato:",
          error
        );

        setContrato(null);
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [alunoId]);

  const historicoCompleto = useMemo(() => {
    if (!aluno) return [];

    const eventos: EventoHistorico[] = [];

    if (aluno.desde) {
      eventos.push({
        id: `cad-${aluno.id}`,
        data: aluno.desde,
        tipo: "cadastro",
        titulo: "Aluno Matriculado",
        descricao: `Cadastro inicial realizado para a escola ${aluno.escola} (${aluno.serie} - ${aluno.turno})`,
      });
    }

    const listaResponsaveis =
      aluno.responsaveis &&
      aluno.responsaveis.length > 0
        ? aluno.responsaveis
        : aluno.responsavel
        ? [
            {
              nome: aluno.responsavel,
              parentesco: aluno.parentesco,
            },
          ]
        : [];
        
    listaResponsaveis.forEach((resp, idx) => {
      eventos.push({
        id: `resp-${idx}`,
        data: aluno.desde || "—",
        tipo: "responsavel",
        titulo: `Responsável Vinculado: ${resp.nome}`,
        descricao: `Grau de parentesco: ${
          resp.parentesco || "Responsável legal"
        }`,
      });
    });

    if (contrato) {
      eventos.push({
        id: `cnt-${contrato.id}`,
        data: contrato.data_inicio,
        tipo: "contrato",
        titulo: `Contrato ${contrato.numero} Vinculado`,
        descricao: `Valor mensal de ${brlExato(
          contrato.valor_mensalidade
        )} com vencimento no dia ${
          contrato.dia_vencimento
        } (${contrato.forma_pagamento})`,
      });
    }

    (aluno.ocorrencias || []).forEach((oc, idx) => {
      eventos.push({
        id: `oc-${idx}`,
        data: oc.data,
        tipo: "ocorrencia",
        titulo: `Ocorrência: ${oc.tipo}`,
        descricao: oc.descricao,
      });
    });

    (aluno.historico || []).forEach((h, idx) => {
      eventos.push({
        id: `sys-${idx}`,
        data: h.data,
        tipo: "sistema",
        titulo: h.evento,
      });
    });

    return eventos.sort(
      (a, b) =>
        converterParaTimestamp(b.data) -
        converterParaTimestamp(a.data)
    );
  }, [aluno, contrato]);

  if (carregando) {
    return (
      <div className="mx-auto flex min-h-[50vh] items-center justify-center px-4">
        <div className="text-center animate-pulse">
          <p className="text-sm text-muted-foreground">
            Carregando detalhes do aluno...
          </p>
        </div>
      </div>
    );
  }

  if (!aluno) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center space-y-4 px-4 text-center">
        <h1 className="font-display text-2xl font-semibold">
          Aluno não encontrado
        </h1>

        <p className="text-sm text-muted-foreground">
          Verifique a URL ou volte para a lista geral
          de alunos.
        </p>

        <Button
          asChild
          className="rounded-xl"
        >
          <Link to="/alunos">
            Voltar para alunos
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6 py-4">

      <Button
        asChild
        variant="ghost"
        size="sm"
        className="w-fit rounded-xl text-muted-foreground hover:text-foreground"
      >
        <Link to="/alunos">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para alunos
        </Link>
      </Button>

      <AlunoHeader aluno={aluno} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <AlunoDadosPessoais aluno={aluno} />
        <AlunoEndereco aluno={aluno} />
        <AlunoResponsaveis aluno={aluno} />
      </div>

      <Tabs
        defaultValue="transporte"
        className="space-y-4"
      >
        <TabsList
          className="
            flex
            w-full
            items-center
            justify-start
            overflow-x-auto
            rounded-xl
            border
            border-border/50
            bg-muted/50
            p-1.5
            gap-1.5
            h-auto
            scrollbar-none
          "
        >
          <TabsTrigger
            value="transporte"
            className="flex-shrink-0 justify-center gap-2 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium"
          >
            <Bus className="h-4 w-4" />
            Transporte / Rotas
          </TabsTrigger>

          <TabsTrigger
            value="contrato"
            className="flex-shrink-0 justify-center rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium"
          >
            Contrato
          </TabsTrigger>

          <TabsTrigger
            value="mensalidades"
            className="flex-shrink-0 justify-center rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium"
          >
            Mensalidades
          </TabsTrigger>

          <TabsTrigger
            value="ocorrencias"
            className="flex-shrink-0 justify-center rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium"
          >
            Ocorrências
          </TabsTrigger>

          <TabsTrigger
            value="historico"
            className="flex-shrink-0 justify-center rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium"
          >
            Histórico
          </TabsTrigger>

          <TabsTrigger
            value="documentos"
            className="flex-shrink-0 justify-center rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium"
          >
            Documentos
          </TabsTrigger>

          <TabsTrigger
            value="fotos"
            className="flex-shrink-0 justify-center rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium"
          >
            Fotos
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="transporte"
          className="mt-4"
        >
          {alunoId && (
            <GradeSemanalRotas
              alunoId={alunoId}
              nomeRotaPrincipal={aluno.rota}
            />
          )}
        </TabsContent>

        <TabsContent
          value="contrato"
          className="mt-4"
        >
          <AlunoContrato contrato={contrato} />
        </TabsContent>

        <TabsContent
          value="mensalidades"
          className="mt-4"
        >
          <SectionCard
            title="Mensalidades"
            description="Histórico de cobranças e baixas do contrato"
          >
            {contrato?.id ? (
              <TabelaMensalidades
                contratoId={contrato.id}
              />
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Nenhum contrato ativo encontrado para
                carregar as mensalidades.
              </p>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent
          value="ocorrencias"
          className="mt-4"
        >
          <AlunoOcorrencias
            ocorrencias={aluno.ocorrencias}
          />
        </TabsContent>

        <TabsContent
          value="historico"
          className="mt-4"
        >
          <AlunoHistorico
            historico={historicoCompleto}
          />
        </TabsContent>

        <TabsContent
          value="documentos"
          className="mt-4"
        >
          <AlunoDocumentos
            documentos={aluno.documentos}
          />
        </TabsContent>

        <TabsContent
          value="fotos"
          className="mt-4"
        >
          <AlunoFotos />
        </TabsContent>
      </Tabs>
    </div>
  );
}