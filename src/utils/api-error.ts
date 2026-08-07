import { isAxiosError } from "axios";

type ApiErrorMessage = string | string[] | undefined;

interface ApiErrorBody {
  message?: ApiErrorMessage;
  error?: ApiErrorMessage;
}

function normalize(valor: ApiErrorMessage): string | null {
  if (Array.isArray(valor)) return valor.length > 0 ? valor.join(", ") : null;
  return valor || null;
}

// Extrai a mensagem enviada pela API, com fallback amigável.
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<ApiErrorBody>(error)) {
    const body = error.response?.data;
    return normalize(body?.message) ?? normalize(body?.error) ?? fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
