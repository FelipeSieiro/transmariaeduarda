import { isAxiosError } from "axios";

interface ApiErrorBody {
  message?: string;
  error?: string;
}

// Extrai a mensagem enviada pela API, com fallback amigável.
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<ApiErrorBody>(error)) {
    return (
      error.response?.data?.message ?? error.response?.data?.error ?? fallback
    );
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
