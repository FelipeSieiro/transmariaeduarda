// src/types/agendamento.ts
export interface AgendamentoRotaItem {
  id?: string;
  aluno_id?: string;
  rota_id: string;
  dia_semana: number; // 1 = Segunda, 2 = Terça, 3 = Quarta, 4 = Quinta, 5 = Sexta
  tipo_trajeto: "ENTRADA" | "SAIDA";
  horario: string;
  observacao?: string | null;
  rota?: {
    id: string;
    nome: string;
    bairro?: string;
  };
}

export interface SyncAgendamentosPayload {
  agendamentos: {
    rota_id: string;
    dia_semana: number;
    tipo_trajeto: "ENTRADA" | "SAIDA";
    horario: string;
    observacao?: string;
  }[];
}

import api from "@/lib/api";
// src/services/agendamento-rotas.service.ts

import { AgendamentoRotaItem, SyncAgendamentosPayload } from "@/types/agendamento";

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