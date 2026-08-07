// Tipos do domínio de transporte compartilhados entre features
// (agenda, rotas, ...). Refletem os valores aceitos pela API.

// Dias letivos: 1 = segunda-feira ... 6 = sábado.
export type DiaSemana = 1 | 2 | 3 | 4 | 5 | 6;

export type TipoTrajeto = "ENTRADA" | "SAIDA";
