import type { SelectOption } from "@/types/ui";

export enum Parentesco {
  PAI = "Pai",
  MAE = "Mãe",
  AVO_MATERNO = "Avô Materno",
  AVO_PATERNO = "Avô Paterno",
  AVO_MATERNA = "Avó Materna",
  AVO_PATERNA = "Avó Paterna",
  TIO = "Tio",
  TIA = "Tia",
  PADRASTO = "Padrasto",
  MADRASTA = "Madrasta",
  OUTRO = "Outro",
}

// Array imutável para iteração direta
export const PARENTESCOS = Object.values(Parentesco) as readonly Parentesco[];

// Opções prontas para formulários (<Select />, Radio Groups, etc.)
export const PARENTESCO_OPTIONS: readonly SelectOption<Parentesco>[] =
  PARENTESCOS.map((parentesco) => ({
    value: parentesco,
    label: parentesco,
  }));