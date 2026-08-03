import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  Moon,
  Search,
  Settings,
  Sun,
  LogOut,
  UserRound,
  Building2,
} from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "@/components/theme-provider";

const notificacoes = [
  { titulo: "3 mensalidades venceram hoje", detalhe: "Financeiro · há 12 min", nivel: "destructive" },
  { titulo: "Revisão da Van PAX-2C55 agendada", detalhe: "Manutenção · há 1 h", nivel: "warning" },
  { titulo: "Novo aluno matriculado", detalhe: "Cadastro · há 3 h", nivel: "success" },
  { titulo: "CNH de Roberto Salles vence em 12 dias", detalhe: "Motoristas · ontem", nivel: "warning" },
];

export function Topbar() {
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-3 sm:px-5">
        <SidebarTrigger className="shrink-0" />

        <Separator orientation="vertical" className="hidden h-6 sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="hidden shrink-0 gap-2 rounded-xl md:flex">
              <Building2 className="size-4 text-primary" />
              <span className="max-w-[10rem] truncate">Transportes Aurora Ltda.</span>
              <ChevronDown className="size-3.5 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuLabel>Empresas</DropdownMenuLabel>
            <DropdownMenuItem>Transportes Aurora Ltda.</DropdownMenuItem>
            <DropdownMenuItem>Aurora Filial Zona Sul</DropdownMenuItem>
            <DropdownMenuItem>Aurora Fretamento</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <form
          className="relative ml-auto hidden w-full max-w-sm items-center lg:flex"
          onSubmit={(e) => {
            e.preventDefault();
            const query = busca ? `?q=${encodeURIComponent(busca)}` : "";
            navigate(`/alunos${query}`);
          }}
        >
          <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Pesquisar alunos, contratos, veículos…"
            className="h-10 rounded-xl border-border bg-muted/50 pl-9 pr-16"
          />
          <kbd className="pointer-events-none absolute right-3 rounded-md border border-border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground">
            Ctrl K
          </kbd>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-1 lg:ml-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl lg:hidden">
                <Search className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Pesquisar</TooltipContent>
          </Tooltip>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative rounded-xl">
                <Bell className="size-4" />
                <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive ring-2 ring-background" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <p className="font-display text-sm font-semibold">Notificações</p>
                <Badge variant="secondary">4 novas</Badge>
              </div>
              <ul className="max-h-80 divide-y divide-border overflow-auto">
                {notificacoes.map((n) => (
                  <li key={n.titulo} className="flex gap-3 px-4 py-3 transition-colors hover:bg-muted/60">
                    <span
                      className={`mt-1.5 size-2 shrink-0 rounded-full ${
                        n.nivel === "destructive"
                          ? "bg-destructive"
                          : n.nivel === "warning"
                            ? "bg-warning"
                            : "bg-success"
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{n.titulo}</p>
                      <p className="truncate text-xs text-muted-foreground">{n.detalhe}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hidden rounded-xl sm:inline-flex"
                onClick={() => navigate("/agenda")}
              >
                <CalendarDays className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Agenda</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl" onClick={toggle}>
                {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{theme === "dark" ? "Tema claro" : "Tema escuro"}</TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="ml-1 flex items-center gap-2 rounded-xl p-1 pr-2 transition-colors hover:bg-muted">
                <Avatar className="size-8">
                  <AvatarImage src="https://api.dicebear.com/9.x/avataaars/svg?seed=Gestor" alt="Usuário" />
                  <AvatarFallback>MG</AvatarFallback>
                </Avatar>
                <span className="hidden text-left text-xs leading-tight sm:block">
                  <span className="block font-medium">Marina Gomes</span>
                  <span className="block text-muted-foreground">Administradora</span>
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
                  <DropdownMenuItem>
                <UserRound className="size-4" /> Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/configuracoes")}>
                <Settings className="size-4" /> Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="size-4" /> Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex h-9 items-center border-t border-border/60 px-4 sm:px-6">
        <Breadcrumbs />
      </div>
    </header>
  );
}
