import type { DiaSemana } from "@/types/transporte";
import type { SelectOption } from "@/types/ui";

// Fonte única dos rótulos de dia da semana usados pela agenda.
export const DIAS_SEMANA: readonly SelectOption<DiaSemana>[] = [
  { value: 1, label: "Segunda-feira" },
  { value: 2, label: "Terça-feira" },
  { value: 3, label: "Quarta-feira" },
  { value: 4, label: "Quinta-feira" },
  { value: 5, label: "Sexta-feira" },
  { value: 6, label: "Sábado" },
] as const;

// Grade semanal padrão (segunda a sexta).
export const DIAS_SEMANA_UTEIS: readonly SelectOption<DiaSemana>[] =
  DIAS_SEMANA.filter((dia) => dia.value <= 5);
