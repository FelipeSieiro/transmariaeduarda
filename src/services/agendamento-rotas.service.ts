import api from "@/lib/api";
import { AgendamentoRotaItem, SyncAgendamentosPayload } from "@/types";


export const agendamentoRotasService = {
  async getByAlunoId(alunoId: string): Promise<AgendamentoRotaItem[]> {
    const response = await api.get(`/alunos/${alunoId}/agendamentos-rotas`);
    return response.data.data;
  },

  async syncAgendamentos(
    alunoId: string,
    payload: SyncAgendamentosPayload
  ): Promise<AgendamentoRotaItem[]> {
    const response = await api.put(
      `/alunos/${alunoId}/agendamentos-rotas`,
      payload
    );
    return response.data.data;
  },
};