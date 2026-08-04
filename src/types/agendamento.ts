import type { RotaResumida } from "./rota";

export type DiaSemana = 1 | 2 | 3 | 4 | 5;
export type TipoTrajeto = "ENTRADA" | "SAIDA";

export const DIAS_SEMANA_MAP: Record<DiaSemana, string> = {
  1: "Segunda-feira",
  2: "Terça-feira",
  3: "Quarta-feira",
  4: "Quinta-feira",
  5: "Sexta-feira",
} as const;

export interface AgendamentoRotaItem {
  id?: string;
  aluno_id?: string;
  rota_id: string;
  dia_semana: DiaSemana;
  tipo_trajeto: TipoTrajeto;
  horario: string; // Formato esperável "HH:mm"
  observacao?: string | null;
  rota?: RotaResumida;
}

export interface AgendamentoPayloadItem {
  rota_id: string;
  dia_semana: DiaSemana;
  tipo_trajeto: TipoTrajeto;
  horario: string;
  observacao?: string | null;
}

export interface SyncAgendamentosPayload {
  agendamentos: AgendamentoPayloadItem[];
}
