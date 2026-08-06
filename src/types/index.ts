// Barrel de tipos compartilhados + reexport dos tipos de cada feature.
// Mantido para não quebrar imports existentes de "@/types".
// Em novos códigos, prefira importar direto de "@/features/{dominio}/types/..."

export * from "@/features/agenda/types/agendamento";
export * from "@/features/alunos/types/alunos";
export * from "@/features/contratos/types/contrato";
export * from "@/features/motoristas/types/motorista";
export * from "@/features/responsaveis/types/responsavel";
export * from "@/features/rotas/types/rota";
export * from "@/features/veiculos/types/veiculos";
export * from "@/features/alunos/types/mensalidade";
export * from "@/types/escola";
export * from "@/types/shared";
