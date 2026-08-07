// Tipos de apresentação compartilhados por todas as features.

// Opção genérica para componentes de seleção (<Select />, <Dropdown />, etc).
export interface SelectOption<T = string> {
  readonly value: T;
  readonly label: string;
}
