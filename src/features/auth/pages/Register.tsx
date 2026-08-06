// src/pages/auth/Register.tsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Bus, Eye, EyeOff, Loader2, Lock, Mail, User as UserIcon, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { register } from "@/features/auth/services/auth.service";
import { AuthLayout } from "./AuthLayout";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [form, setForm] = useState({
    nome: "",
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
      const data = await register(form);
      toast.success(`Conta criada com sucesso! Bem-vindo, ${data.user.nome}!`);
      navigate("/", { replace: true });
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Erro ao criar conta. Verifique os dados informados."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="overflow-hidden rounded-[2.5rem] border border-border/60 bg-card/70 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/30 ring-8 ring-primary/10 transition-transform hover:scale-105 duration-300">
            <Bus className="size-8" />
          </div>
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
            Crie sua conta
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Comece a gerenciar seu transporte escolar hoje
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Nome Completo
            </label>
            <div className="relative group">
              <UserIcon className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                type="text"
                placeholder="Seu nome completo"
                autoComplete="name"
                required
                className="h-13 rounded-2xl pl-11 bg-muted/40 border-border/80 transition-all focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/20"
                value={form.nome}
                onChange={(e) => setForm((old) => ({ ...old, nome: e.target.value }))}
              />
            </div>
          </div>

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
                autoComplete="new-password"
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
                Cadastrando...
              </>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Criar Conta
                <ArrowRight className="size-4" />
              </span>
            )}
          </Button>
        </form>

        <div className="mt-7 text-center text-xs text-muted-foreground">
          Já possui uma conta?{" "}
          <Link to="/login" className="font-bold text-primary hover:underline transition-all">
            Faça login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}