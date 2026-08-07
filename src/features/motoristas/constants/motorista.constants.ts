import type { SelectOption } from "@/types/ui";

export const CATEGORIAS_CNH: readonly SelectOption[] = [
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "C", label: "C" },
  { value: "D", label: "D" },
  { value: "E", label: "E" },
  { value: "AB", label: "AB" },
  { value: "AC", label: "AC" },
  { value: "AD", label: "AD" },
  { value: "AE", label: "AE" },
] as const;

export const STATUS_MOTORISTA: readonly SelectOption[] = [
  { value: "ativo", label: "Ativo" },
  { value: "inativo", label: "Inativo" },
] as const;
