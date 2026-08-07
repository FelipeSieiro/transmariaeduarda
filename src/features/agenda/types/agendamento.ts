import type { RotaResumida } from "@/features/rotas/types/rota";
import type { DiaSemana, TipoTrajeto } from "@/types/transporte";

// Dados enviados à API para cada horário da grade semanal do aluno.
export interface AgendamentoPayloadItem {
  rota_id: string;
  dia_semana: DiaSemana;
  tipo_trajeto: TipoTrajeto;
  horario: string; // Formato esperável "HH:mm"
  observacao?: string | null;
}

// Agendamento retornado pela API (payload + dados de persistência/relacionamento).
export interface AgendamentoRota extends AgendamentoPayloadItem {
  id?: string;
  aluno_id?: string;
  rota?: RotaResumida;
}

export interface SyncAgendamentosPayload {
  agendamentos: AgendamentoPayloadItem[];
}
