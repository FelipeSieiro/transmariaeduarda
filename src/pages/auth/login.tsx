// src/pages/auth/Login.tsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Bus, Eye, EyeOff, Loader2, Lock, Mail, Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/services/auth.service";
import { AuthLayout } from "./AuthLayout";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await login(form);
      toast.success(`Bem-vindo de volta, ${data.user.nome}!`);
      navigate("/", { replace: true });
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Erro ao fazer login. Verifique suas credenciais."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleFillDemo() {
    setForm({
      email: "felipe@email.com",
      password: "Admin@123",
    });
    toast.info("Credenciais de demonstração aplicadas!");
  }

  return (
    <AuthLayout>
      <div className="overflow-hidden rounded-[2.5rem] border border-border/60 bg-card/70 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/30 ring-8 ring-primary/10 transition-transform hover:scale-105 duration-300">
            <Bus className="size-8" />
          </div>
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
            Bem-vindo de volta
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Digite suas credenciais para acessar o painel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              E-mail
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                type="email"
                placeholder="exemplo@email.com"
                autoComplete="email"
                required
                className="h-13 rounded-2xl pl-11 bg-muted/40 border-border/80 transition-all focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/20"
                value={form.email}
                onChange={(e) => setForm((old) => ({ ...old, email: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Senha
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                type={mostrarSenha ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="h-13 rounded-2xl pl-11 pr-12 bg-muted/40 border-border/80 transition-all focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/20"
                value={form.password}
                onChange={(e) => setForm((old) => ({ ...old, password: e.target.value }))}
              />
              <button
                type="button"
                onClick={() => setMostrarSenha((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground p-1"
              >
                {mostrarSenha ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="mt-2 h-13 w-full rounded-2xl font-bold tracking-wide shadow-xl shadow-primary/25 transition-all hover:shadow-primary/40 active:scale-[0.98]"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Entrando...
              </>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Acessar Sistema
                <ArrowRight className="size-4" />
              </span>
            )}
          </Button>
        </form>

        <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4 transition-all hover:bg-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Acesso Rápido
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleFillDemo}
              className="h-7 text-xs rounded-xl px-2.5 font-semibold text-primary hover:bg-primary/15 transition-colors"
            >
              Preencher
            </Button>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Teste o sistema instantaneamente com a conta de demonstração.
          </p>
        </div>

        <div className="mt-7 text-center text-xs text-muted-foreground">
          Não tem uma conta?{" "}
          <Link to="/register" className="font-bold text-primary hover:underline transition-all">
            Cadastre-se gratuitamente
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}