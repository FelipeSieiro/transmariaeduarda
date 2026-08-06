// Tipos compartilhados entre features. Ajuste os campos conforme sua API real.
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}
