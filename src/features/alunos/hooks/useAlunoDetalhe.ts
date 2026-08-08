import { useEffect, useState } from "react";
import { toast } from "sonner";

import { buscarAluno } from "@/features/alunos/services/alunos.service";
import { adaptarAlunoDetalhe } from "@/features/alunos/adapters/alunoDetalhe.adapter";

import {
  type AlunoMock,
  alunos as alunosMock,
} from "@/data/mock";

import type { Contrato } from "@/features/contratos/types/contrato";
import type { AlunoDetalhe } from "@/features/alunos/types/alunos";

interface UseAlunoDetalheResult {
  aluno: AlunoDetalhe | null;
  alunoOriginal: any | null;
  contrato: Contrato | null;
  contratos: Contrato[];
  carregando: boolean;
  erro: boolean;
}

export function useAlunoDetalhe(alunoId?: string): UseAlunoDetalheResult {
  const [aluno, setAluno] = useState<AlunoDetalhe | null>(null);
  const [alunoOriginal, setAlunoOriginal] = useState<any | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [contrato, setContrato] = useState<Contrato | null>(null);
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      if (!alunoId) {
        setCarregando(false);
        return;
      }

      setCarregando(true);
      setErro(false);

      let alunoData: AlunoDetalhe | null = null;
      let alunoRaw: any = null;

      try {
        const response = await buscarAluno(alunoId);
        alunoRaw = response;
        alunoData = adaptarAlunoDetalhe(response);
        setAluno(alunoData);
        setAlunoOriginal(response);
      } catch (error) {
        const alunoMock = alunosMock.find(
          (item) => item.id === alunoId
        );

        if (alunoMock) {
          alunoData = alunoMock as unknown as AlunoDetalhe;
          alunoRaw = alunoMock;
          setAluno(alunoData);
          setAlunoOriginal(alunoMock);
        } else {
          toast.error(
            "Não foi possível carregar os dados do aluno."
          );
          setErro(true);
        }
      }

      try {
        // Usar os contratos que já vêm no objeto do aluno (alunoOriginal)
        const contratosDoAluno = alunoRaw?.contratos || [];
        setContratos(contratosDoAluno);
        // Manter compatibilidade com o contrato único (pegar o primeiro ativo)
        const contratoAtivo = contratosDoAluno.find((c: any) => c.status?.toLowerCase() === "ativo") || contratosDoAluno[0] || null;
        setContrato(contratoAtivo);
      } catch (error) {
        setContratos([]);
        setContrato(null);
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [alunoId]);

  return { aluno, alunoOriginal, contrato, contratos, carregando, erro };
}