import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { ROUTES } from "@/constants/routes";
import { isAuthenticated } from "@/features/auth/services/session.storage";

// Bloqueia o acesso às rotas do layout privado sem sessão ativa.
export function PrivateRoute({ children }: { children: ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
}
