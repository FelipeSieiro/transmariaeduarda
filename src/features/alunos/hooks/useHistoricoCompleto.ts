import { useMemo } from "react";

import { brlExato } from "@/data/mock";

import type { Contrato } from "@/features/contratos/types/contrato";
import type { AlunoDetalhe } from "@/features/alunos/types/alunos";
import type { EventoHistorico } from "@/features/alunos/types/aluno-detalhes";

function converterParaTimestamp(dataStr?: string): number {
  if (!dataStr) return 0;

  if (dataStr.includes("-")) {
    const timestamp = new Date(dataStr).getTime();
    return Number.isNaN(timestamp) ? 0 : timestamp;
  }

  const partes = dataStr.split("/");

  if (partes.length === 3) {
    const [dia, mes, ano] = partes.map(Number);
    if (dia && mes && ano) {
      const date = new Date(ano, mes - 1, dia);
      return !isNaN(date.getTime()) ? date.getTime() : 0;
    }
  }

  return 0;
}

export function useHistoricoCompleto(
  aluno: AlunoDetalhe | null,
  contrato: Contrato | null
): EventoHistorico[] {
  return useMemo(() => {
    if (!aluno) return [];

    const eventos: EventoHistorico[] = [];

    if (aluno.desde) {
      eventos.push({
        id: `cad-${aluno.id}`,
        data: aluno.desde || "-",
        tipo: "cadastro",
        titulo: "Aluno Matriculado",
        descricao: `Cadastro inicial realizado para a escola ${aluno.escola} (${aluno.serie} - ${aluno.turno})`,
      });
    }

    const listaResponsaveis =
      aluno.responsaveis && aluno.responsaveis.length > 0
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

    (aluno.ocorrencias || []).forEach((oc: any, idx: number) => {
      eventos.push({
        id: `oc-${idx}`,
        data: oc.data,
        tipo: "ocorrencia",
        titulo: `Ocorrência: ${oc.tipo}`,
        descricao: oc.descricao,
      });
    });

    (aluno.historico || []).forEach((h: any, idx: number) => {
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
}