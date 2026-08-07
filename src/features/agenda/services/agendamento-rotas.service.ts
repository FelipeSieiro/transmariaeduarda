import api from "@/lib/api";
import type {
  AgendamentoRota,
  SyncAgendamentosPayload,
} from "@/features/agenda/types/agendamento";
import type { ApiResponse } from "@/types/shared";

export const agendamentoRotasService = {
  async getByAlunoId(alunoId: string): Promise<AgendamentoRota[]> {
    const response = await api.get<ApiResponse<AgendamentoRota[]>>(
      `/alunos/${alunoId}/agendamentos-rotas`
    );
    return response.data.data;
  },

  async syncAgendamentos(
    alunoId: string,
    payload: SyncAgendamentosPayload
  ): Promise<AgendamentoRota[]> {
    const response = await api.put<ApiResponse<AgendamentoRota[]>>(
      `/alunos/${alunoId}/agendamentos-rotas`,
      payload
    );
    return response.data.data;
  },
};