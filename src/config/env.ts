// Ponto único de leitura de variáveis de ambiente.
// Mantém o valor atual como fallback para não alterar o comportamento
// em ambientes que ainda não definem VITE_API_BASE_URL.
const DEFAULT_API_BASE_URL = "https://transmariaeduardaapi.vercel.app/api";

export const env = {
  apiBaseUrl: import.meta.env["VITE_API_BASE_URL"] ?? DEFAULT_API_BASE_URL,
  isDev: import.meta.env.DEV,
} as const;
