// Contratos de autenticação (fonte única da feature auth).

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  nome: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  nome: string;
  email: string;
  perfil: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}
