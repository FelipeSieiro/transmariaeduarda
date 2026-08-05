import api from "@/lib/api";

export interface LoginDTO {
  email: string;
  password: string;
}

export interface User {
  id: string;
  nome: string;
  email: string;
  perfil: string;
}

interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

export async function login(data: LoginDTO) {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    data
  );

  const { token, user } = response.data.data;

  localStorage.setItem("token", token);
  localStorage.setItem(
    "user",
    JSON.stringify(user)
  );

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