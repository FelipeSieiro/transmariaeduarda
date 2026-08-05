// src/pages/Login.tsx

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bus,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Moon,
  Sun,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/theme-provider";
import { login } from "@/services/auth.service";

export default function Login() {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();

  const [loading, setLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/", {
        replace: true,
      });
    }
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await login(form);

      toast.success(`Bem-vindo de volta, ${data.user.nome}!`);

      navigate("/", {
        replace: true,
      });
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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12 selection:bg-primary selection:text-primary-foreground">
      
      {/* Elementos decorativos de fundo modernos (Glows & Grids) */}
      <div className="absolute -top-40 -left-40 size-96 rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 size-96 rounded-full bg-blue-500/15 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Botão de Tema Flutuante no Canto Superior Direito */}
      <div className="absolute top-6 right-6 z-20">
        <Button
          variant="outline"
          size="icon"
          className="size-11 rounded-2xl border-border/60 bg-background/80 backdrop-blur-md transition-all hover:bg-muted/80 shadow-sm"
          onClick={toggle}
          title="Alternar tema"
        >
          {theme === "dark" ? (
            <Sun className="size-4 text-amber-400" />
          ) : (
            <Moon className="size-4 text-slate-700" />
          )}
        </Button>
      </div>

      {/* Container Principal Centralizado */}
      <div className="relative z-10 w-full max-w-[440px]">
        
        {/* Cartão Glassmorphism Central */}
        <div className="overflow-hidden rounded-[2.5rem] border border-border/60 bg-card/60 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl">
          
          {/* Cabeçalho do Card */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-8 ring-primary/10">
              <Bus className="size-8" />
            </div>

            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              Transporte ERP
            </h1>
            
            <p className="mt-2 text-sm text-muted-foreground">
              Faça login para gerenciar sua frota e rotas
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
                  onChange={(e) =>
                    setForm((old) => ({
                      ...old,
                      email: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Senha
                </label>

                <Link
                  to="/esqueci-senha"
                  className="text-xs font-medium text-primary hover:underline transition-colors"
                >
                  Esqueceu?
                </Link>
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />

                <Input
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="h-13 rounded-2xl pl-11 pr-12 bg-muted/40 border-border/80 transition-all focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/20"
                  value={form.password}
                  onChange={(e) =>
                    setForm((old) => ({
                      ...old,
                      password: e.target.value,
                    }))
                  }
                />

                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {mostrarSenha ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
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

          {/* Bloco de Demonstração Interativo Refinado */}
          <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-4 transition-all hover:bg-primary/10">
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

            <p className="mt-2 text-xs text-muted-foreground">
              Clique em preencher para testar o sistema com a conta de administrador padrão.
            </p>
          </div>

          {/* Garantia de Segurança / Rodapé do Card */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground/80">
            <ShieldCheck className="size-4 text-emerald-500" />
            <span>Ambiente seguro e criptografado</span>
          </div>

        </div>

        {/* Rodapé Externo */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Transporte Escolar ERP • Versão 2.5
        </p>

      </div>
    </main>
  );
}