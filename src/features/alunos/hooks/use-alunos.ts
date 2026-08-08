import { toast } from "sonner";

import { useAsyncData } from "@/hooks/use-async-data";
import { alunosService } from "@/features/alunos/services/alunos.service";
import type { Aluno } from "@/features/alunos/types/alunos";

const LISTA_VAZIA: Aluno[] = [];

export function useAlunos() {
  const { data, setData, loading, reload } = useAsyncData(
    alunosService.listarAlunos,
    { initialData: LISTA_VAZIA, errorMessage: "Erro ao carregar alunos" },
  );

  async function remover(id: string) {
    try {
      await alunosService.removerAluno(id);
      setData((atual) => atual.filter((item) => item.id !== id));
      toast.success("Aluno excluído com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir aluno");
    }
  }

  return { alunos: data, loading, reload, remover };
}
