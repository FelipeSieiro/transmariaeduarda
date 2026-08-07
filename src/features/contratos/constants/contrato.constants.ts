import type { SelectOption } from "@/types/ui";

export enum FormaPagamento {
  PIX = "PIX",
  DINHEIRO = "Dinheiro",
  CARTAO = "Cartão",
  BOLETO = "Boleto",
}

export enum StatusPagamento {
  PENDENTE = "pendente",
  PAGO = "pago",
  ATRASADO = "atrasado",
  CANCELADO = "cancelado",
}

// Arrays imutáveis para iteração direta
export const FORMAS_PAGAMENTO = Object.values(
  FormaPagamento
) as readonly FormaPagamento[];

export const STATUS_PAGAMENTO = Object.values(
  StatusPagamento
) as readonly StatusPagamento[];

// Listas prontas para componentes de formulário (<Select />, <Dropdown />)
export const FORMA_PAGAMENTO_OPTIONS: readonly SelectOption<FormaPagamento>[] =
  FORMAS_PAGAMENTO.map((forma) => ({
    value: forma,
    label: forma,
  }));

export const STATUS_PAGAMENTO_LABELS: Record<StatusPagamento, string> = {
  [StatusPagamento.PENDENTE]: "Pendente",
  [StatusPagamento.PAGO]: "Pago",
  [StatusPagamento.ATRASADO]: "Atrasado",
  [StatusPagamento.CANCELADO]: "Cancelado",
} as const;

export const STATUS_PAGAMENTO_OPTIONS: readonly SelectOption<StatusPagamento>[] =
  STATUS_PAGAMENTO.map((status) => ({
    value: status,
    label: STATUS_PAGAMENTO_LABELS[status],
  }));