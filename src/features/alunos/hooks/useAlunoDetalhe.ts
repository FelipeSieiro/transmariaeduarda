import { useEffect, useState } from "react";
import { toast } from "sonner";

import { buscarAluno } from "@/features/alunos/services/alunos.service";
import { buscarContratoPorAluno } from "@/features/contratos/services/contratos.service";
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
  carregando: boolean;
  erro: boolean;
}

export function useAlunoDetalhe(alunoId?: string): UseAlunoDetalheResult {
  const [aluno, setAluno] = useState<AlunoDetalhe | null>(null);
  const [alunoOriginal, setAlunoOriginal] = useState<any | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [contrato, setContrato] = useState<Contrato | null>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      if (!alunoId) return;

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
        console.error("Erro ao buscar aluno API:", error);

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
        const contratoApi = await buscarContratoPorAluno(alunoId);
        setContrato(contratoApi);
      } catch (error) {
        console.error("Erro ao buscar contrato:", error);
        setContrato(null);
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [alunoId]);

  return { aluno, alunoOriginal, contrato, carregando, erro };
}