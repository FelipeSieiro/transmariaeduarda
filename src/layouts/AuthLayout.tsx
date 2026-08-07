// src/pages/auth/AuthLayout.tsx
import { ReactNode } from "react";
import { Moon, Sun, Sparkles, ShieldCheck, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/theme-provider";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { theme, toggle } = useTheme();

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background p-4 sm:p-6 lg:p-8 selection:bg-primary selection:text-primary-foreground">
      {/* Elementos decorativos de fundo modernos */}
      <div className="absolute -top-40 -left-40 size-[550px] rounded-full bg-primary/15 blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-40 -right-40 size-[550px] rounded-full bg-blue-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />

      {/* Botão de Tema Flutuante */}
      <div className="absolute top-6 right-6 z-30">
        <Button
          variant="outline"
          size="icon"
          className="size-11 rounded-2xl border-border/60 bg-background/80 backdrop-blur-md transition-all hover:bg-muted/80 shadow-lg"
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

      {/* Container Principal em Grid */}
      <div className="relative z-10 grid w-full max-w-6xl lg:grid-cols-12 gap-8 items-center">
        {/* Painel Lateral Informativo (Apenas Desktop) */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-between p-8 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2.5 rounded-2xl bg-primary/10 border border-primary/20 px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary shadow-sm">
              <Sparkles className="size-4" />
              Gestão Inteligente de Frotas
            </div>
            <h1 className="text-4xl xl:text-5xl font-black tracking-tight leading-tight">
              Revolucione o controle do seu{" "}
              <span className="text-primary">Transporte Escolar</span>
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed">
              Monitore rotas em tempo real, gerencie contratos, otimize o
              financeiro e mantenha a comunicação com os responsáveis em um
              único lugar.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl border border-border/60 bg-card/40 p-5 backdrop-blur-xl transition-all hover:border-primary/40 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                <MapPin className="size-5" />
              </div>
              <h3 className="font-bold text-sm">Rotas Otimizadas</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Trajetos inteligentes para economia de tempo e combustível.
              </p>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card/40 p-5 backdrop-blur-xl transition-all hover:border-primary/40 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                <Users className="size-5" />
              </div>
              <h3 className="font-bold text-sm">Gestão de Alunos</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Controle total de frequência, mensalidades e responsáveis.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground/90 font-medium">
            <ShieldCheck className="size-5 text-emerald-500" />
            <span>
              Plataforma 100% segura com criptografia de ponta a ponta
            </span>
          </div>
        </div>

        {/* Conteúdo Dinâmico */}
        <div className="lg:col-span-6 w-full max-w-[460px] mx-auto">
          {children}
        </div>
      </div>
    </main>
  );
}
