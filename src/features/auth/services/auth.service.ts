import api from "@/config/api";
import { ENDPOINTS } from "@/constants/endpoints";
import {
  clearSession,
  getStoredUser,
  saveSession,
} from "@/features/auth/services/session.storage";
import type {
  AuthSession,
  AuthUser,
  LoginDTO,
  RegisterDTO,
} from "@/features/auth/types/auth";
import type { ApiResponse } from "@/types/shared";

export async function login(payload: LoginDTO): Promise<AuthSession> {
  const response = await api.post<ApiResponse<AuthSession>>(
    ENDPOINTS.AUTH.LOGIN,
    payload,
  );
  const sessao = response.data.data;

  saveSession(sessao);

  return sessao;
}

export async function register(payload: RegisterDTO): Promise<AuthSession> {
  const response = await api.post<ApiResponse<AuthSession>>(
    ENDPOINTS.AUTH.REGISTER,
    payload,
  );
  const sessao = response.data.data;

  saveSession(sessao);

  return sessao;
}

export async function me(): Promise<AuthUser> {
  const response = await api.get<ApiResponse<AuthUser>>(ENDPOINTS.AUTH.ME);
  return response.data.data;
}

export function logout(): void {
  clearSession();
}

export function getUser(): AuthUser | null {
  return getStoredUser();
}

export const authService = {
  login,
  register,
  me,
  logout,
  getUser,
};
