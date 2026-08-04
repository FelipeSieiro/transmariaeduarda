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

// Helper para iteração direta em componentes UI
export const PARENTESCOS = Object.values(Parentesco);