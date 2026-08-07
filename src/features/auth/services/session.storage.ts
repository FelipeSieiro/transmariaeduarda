import { STORAGE_KEYS } from "@/constants/storage";
import type { AuthSession, AuthUser } from "@/features/auth/types/auth";

// Único ponto de leitura/escrita da sessão no localStorage.

export function saveSession({ token, user }: AuthSession): void {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
}

export function getToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

export function getStoredUser(): AuthUser | null {
  const bruto = localStorage.getItem(STORAGE_KEYS.USER);

  if (!bruto) return null;

  try {
    return JSON.parse(bruto) as AuthUser;
  } catch {
    return null;
  }
}
