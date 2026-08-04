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