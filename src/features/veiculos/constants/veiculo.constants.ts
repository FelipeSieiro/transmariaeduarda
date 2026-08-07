import type { SelectOption } from "@/types/ui";

export const STATUS_VEICULO: readonly SelectOption[] = [
  { value: "ativo", label: "Ativo" },
  { value: "inativo", label: "Inativo" },
  { value: "manutencao", label: "Em Manutenção" },
] as const;
