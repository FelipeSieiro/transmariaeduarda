export * from "./agendamento";
export * from "./alunos";
export * from "./contrato";
export * from "./escola";
export * from "./mensalidade";
export * from "./motorista";
export * from "./responsavel";
export * from "./rota";
export * from "./veiculos";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
