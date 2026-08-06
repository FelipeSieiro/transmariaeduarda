// src/services/auth.service.ts

import api from "@/lib/api";

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  nome: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  nome: string;
  email: string;
  perfil: string;
}

interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

export async function login(data: LoginDTO) {
  const response = await api.post<AuthResponse>("/auth/login", data);
  const { token, user } = response.data.data;

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  return response.data.data;
}

export async function register(data: RegisterDTO) {
  const response = await api.post<AuthResponse>("/auth/register", data);
  const { token, user } = response.data.data;

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  return response.data.data;
}

export async function me() {
  const response = await api.get("/auth/me");
  return response.data.data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}