// src/components/layout/Topbar.tsx
import { useState, useRef, useEffect, useTransition } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  Bus,
  Users,
  MapPin,
  Sparkles,
  Command,
  Loader2,
  Wrench,
  DollarSign,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "@/providers/theme-provider";
import { logout, getUser } from "@/features/auth/services/auth.service";
import type { AuthUser } from "@/features/auth/types/auth";
import { listarAlunos } from "@/features/alunos/services/alunos.service";
import { veiculosService } from "@/features/veiculos/services/veiculos.service";
import { listarRotas } from "@/features/rotas/services/rotas.service";

const notificacoes = [
  {
    titulo: "3 mensalidades venceram hoje",
    detalhe: "Financeiro · há 12 min",
    nivel: "destructive",
  },
  {
    titulo: "Revisão da Van PAX-2C55 agendada",
    detalhe: "Manutenção · há 1 h",
    nivel: "warning",
  },
  {
    titulo: "Novo aluno matriculado",
    detalhe: "Cadastro · há 3 h",
    nivel: "success",
  },
  {
    titulo: "CNH de Roberto Salles vence em 12 dias",
    detalhe: "Motoristas · ontem",
    nivel: "warning",
  },
];

export function Topbar() {
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [usuario] = useState<AuthUser | null>(() => getUser());

  const [busca, setBusca] = useState(searchParams.get("q") || "");
  const [isOpenResults, setIsOpenResults] = useState(false);
  const [resultados, setResultados] = useState<{
    alunos: any[];
    veiculos: any[];
    rotas: any[];
    manutencoes: any[];
    financeiro: any[];
  }>({ alunos: [], veiculos: [], rotas: [], manutencoes: [], financeiro: [] });
  const [isPending, startTransition] = useTransition();
  const searchRef = useRef<HTMLDivElement>(null);

  // Fecha o popup ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpenResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Atalho Global Ctrl+K / Cmd+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const input = document.getElementById("topbar-search-input");
        input?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Motor de Busca Unificado Abrangendo Todos os Serviços/Módulos
  useEffect(() => {
    const query = busca.trim().toLowerCase();
    if (query.length < 2) {
      setResultados({
        alunos: [],
        veiculos: [],
        rotas: [],
        manutencoes: [],
        financeiro: [],
      });
      setIsOpenResults(false);
      return;
    }

    setIsOpenResults(true);

    const timer = setTimeout(() => {
      startTransition(async () => {
        try {
          const [alunosRes, veiculosRes, rotasRes] = await Promise.all([
            listarAlunos().catch(() => []),
            veiculosService.getAll().catch(() => []),
            listarRotas().catch(() => []),
          ]);

          // Filtragem de Alunos
          const alunosFiltrados = (alunosRes || [])
            .filter(
              (a: any) =>
                a.nome?.toLowerCase().includes(query) ||
                a.matricula?.toLowerCase().includes(query) ||
                a.responsavel?.toLowerCase().includes(query),
            )
            .slice(0, 3);

          // Filtragem de Veículos
          const veiculosFiltrados = (veiculosRes || [])
            .filter(
              (v: any) =>
                v.modelo?.toLowerCase().includes(query) ||
                v.placa?.toLowerCase().includes(query) ||
                v.marca?.toLowerCase().includes(query),
            )
            .slice(0, 3);

          // Filtragem de Rotas
          const rotasFiltradas = (rotasRes || [])
            .filter(
              (r: any) =>
                r.nome?.toLowerCase().includes(query) ||
                r.periodo?.toLowerCase().includes(query),
            )
            .slice(0, 3);

          // Filtro Integrado de Serviços de Manutenção & Oficina
          const servicosManutencaoMock = [
            {
              id: "m1",
              titulo: "Revisão de Freios e Suspensão",
              veiculo: "Mercedes Sprinter (PAX-2C55)",
              status: "Agendado",
            },
            {
              id: "m2",
              titulo: "Troca de Óleo e Filtros",
              veiculo: "Renault Master (VAN-8A12)",
              status: "Em Andamento",
            },
            {
              id: "m3",
              titulo: "Inspeção Veicular Detran",
              veiculo: "Fiat Ducato (EDU-9901)",
              status: "Concluído",
            },
          ];
          const manutencoesFiltradas = servicosManutencaoMock
            .filter(
              (m) =>
                m.titulo.toLowerCase().includes(query) ||
                m.veiculo.toLowerCase().includes(query) ||
                m.status.toLowerCase().includes(query),
            )
            .slice(0, 2);

          // Filtro Integrado de Serviços Financeiros / Mensalidades
          const servicosFinanceiroMock = [
            {
              id: "f1",
              titulo: "Mensalidade Escolar - Aluno Pedro",
              valor: "R$ 450,00",
              status: "Pendente",
            },
            {
              id: "f2",
              titulo: "Contrato de Transporte Anual",
              valor: "R$ 5.400,00",
              status: "Ativo",
            },
          ];
          const financeiroFiltrado = servicosFinanceiroMock
            .filter(
              (f) =>
                f.titulo.toLowerCase().includes(query) ||
                f.valor.toLowerCase().includes(query),
            )
            .slice(0, 2);

          setResultados({
            alunos: alunosFiltrados,
            veiculos: veiculosFiltrados,
            rotas: rotasFiltradas,
            manutencoes: manutencoesFiltradas,
            financeiro: financeiroFiltrado,
          });
        } catch (err) {
          console.error("Erro na busca global unificada", err);
        }
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [busca]);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  function handleSubmitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!busca.trim()) return;
    setIsOpenResults(false);
    navigate(`/alunos?q=${encodeURIComponent(busca.trim())}`);
  }

  // Dados dinâmicos do usuário vindos do login com fallback seguro
  const nomeUsuario = usuario?.nome || "Usuário";
  const emailUsuario = usuario?.email || "usuario@sistema.com";
  const perfilUsuario = usuario?.perfil || "Administrador";

  // Gera iniciais para o Avatar Fallback
  const iniciaisUsuario = nomeUsuario
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const totalResultados =
    resultados.alunos.length +
    resultados.veiculos.length +
    resultados.rotas.length +
    resultados.manutencoes.length +
    resultados.financeiro.length;

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-2xl transition-all">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <SidebarTrigger className="shrink-0 rounded-xl" />

        <Separator orientation="vertical" className="hidden h-6 sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="hidden shrink-0 gap-2 rounded-xl md:flex hover:bg-muted/60 border border-transparent hover:border-border/60 transition-all"
            >
              <div className="p-1 rounded-lg bg-primary/10 text-primary">
                <Building2 className="size-3.5" />
              </div>
              <span className="max-w-[10rem] truncate font-medium">
                Trans Maria Eduarda
              </span>
              <ChevronDown className="size-3.5 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
        </DropdownMenu>

        {/* Campo de Busca Multi-Serviços Avançado */}
        <div
          ref={searchRef}
          className="relative ml-auto hidden w-full max-w-md items-center lg:flex"
        >
          <form
            onSubmit={handleSubmitSearch}
            className="w-full relative flex items-center"
          >
            <Search className="pointer-events-none absolute left-3.5 size-4 text-muted-foreground/80" />
            <Input
              id="topbar-search-input"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onFocus={() => {
                if (busca.trim().length >= 2) setIsOpenResults(true);
              }}
              placeholder="Pesquisar em todos os serviços, vans, rotas, alunos..."
              className="h-10 rounded-2xl border-border/80 bg-muted/40 pl-10 pr-20 text-xs shadow-2xs focus-visible:bg-background transition-all"
            />
            <div className="absolute right-3 flex items-center gap-1">
              <kbd className="pointer-events-none inline-flex items-center gap-0.5 rounded-md border border-border/80 bg-background px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground shadow-2xs">
                <Command className="size-2.5" /> K
              </kbd>
            </div>
          </form>

          {/* Popover / Dropdown Dinâmico com Filtro de Todos os Serviços */}
          {isOpenResults && busca.trim().length >= 2 && (
            <div className="absolute left-0 right-0 top-12 mt-1 rounded-2xl border border-border/80 bg-card/95 backdrop-blur-xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-3 py-2 border-b border-border/40 mb-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <Sparkles className="size-3.5 text-primary animate-pulse" />
                  <span>Filtrando Todos os Serviços</span>
                </div>
                {isPending && (
                  <Loader2 className="size-3 animate-spin text-primary" />
                )}
              </div>

              {totalResultados === 0 && !isPending ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  Nenhum serviço ou registro correspondente a "
                  <span className="text-foreground font-medium">{busca}</span>".
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {/* Alunos */}
                  {resultados.alunos.length > 0 && (
                    <div className="space-y-1">
                      <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                        Serviço de Alunos & Matrículas
                      </p>
                      {resultados.alunos.map((aluno) => (
                        <div
                          key={aluno.id}
                          onClick={() => {
                            setIsOpenResults(false);
                            navigate(`/alunos/${aluno.id}`);
                          }}
                          className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-muted/60 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                              <Users className="size-3.5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                {aluno.nome}
                              </p>
                              <p className="text-[10px] text-muted-foreground font-mono">
                                Matricula: {aluno.matricula || "N/A"}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="secondary"
                            className="text-[9px] shrink-0"
                          >
                            Aluno
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Veículos */}
                  {resultados.veiculos.length > 0 && (
                    <div className="space-y-1">
                      <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                        Serviço de Frota / Veículos
                      </p>
                      {resultados.veiculos.map((veiculo) => (
                        <div
                          key={veiculo.id}
                          onClick={() => {
                            setIsOpenResults(false);
                            navigate(`/veiculos/${veiculo.id}`);
                          }}
                          className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-muted/60 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="size-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                              <Bus className="size-3.5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                {veiculo.modelo}
                              </p>
                              <p className="text-[10px] text-muted-foreground font-mono">
                                Placa: {veiculo.placa}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="text-[9px] shrink-0 font-mono"
                          >
                            {veiculo.placa}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Rotas */}
                  {resultados.rotas.length > 0 && (
                    <div className="space-y-1">
                      <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                        Serviço de Rotas & Transporte
                      </p>
                      {resultados.rotas.map((rota) => (
                        <div
                          key={rota.id}
                          onClick={() => {
                            setIsOpenResults(false);
                            navigate(`/agenda-por-rotas`);
                          }}
                          className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-muted/60 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="size-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                              <MapPin className="size-3.5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                {rota.nome}
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                Período: {rota.periodo || "Integral"}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="secondary"
                            className="text-[9px] shrink-0"
                          >
                            Rota
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Manutenção / Oficina */}
                  {resultados.manutencoes.length > 0 && (
                    <div className="space-y-1">
                      <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                        Serviços de Manutenção & Oficina
                      </p>
                      {resultados.manutencoes.map((manut) => (
                        <div
                          key={manut.id}
                          onClick={() => {
                            setIsOpenResults(false);
                            navigate(`/veiculos`);
                          }}
                          className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-muted/60 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="size-7 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                              <Wrench className="size-3.5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                {manut.titulo}
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                {manut.veiculo}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="text-[9px] shrink-0"
                          >
                            {manut.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Financeiro / Contratos */}
                  {resultados.financeiro.length > 0 && (
                    <div className="space-y-1">
                      <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                        Serviços Financeiros & Contratos
                      </p>
                      {resultados.financeiro.map((fin) => (
                        <div
                          key={fin.id}
                          onClick={() => {
                            setIsOpenResults(false);
                            navigate(`/configuracoes`);
                          }}
                          className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-muted/60 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="size-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                              <DollarSign className="size-3.5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                {fin.titulo}
                              </p>
                              <p className="text-[10px] text-muted-foreground font-mono">
                                {fin.valor}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="secondary"
                            className="text-[9px] shrink-0"
                          >
                            {fin.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 lg:ml-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl lg:hidden hover:bg-muted/60"
              >
                <Search className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Pesquisar</TooltipContent>
          </Tooltip>

          {/* Notificações */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-xl hover:bg-muted/60"
              >
                <Bell className="size-4" />
                <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive ring-2 ring-background animate-pulse" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-80 p-0 rounded-2xl shadow-2xl border-border/80"
            >
              <div className="flex items-center justify-between border-b border-border/60 px-4 py-3 bg-muted/20">
                <p className="font-display text-xs font-bold uppercase tracking-wider">
                  Notificações
                </p>
                <Badge
                  variant="secondary"
                  className="text-[10px] font-semibold"
                >
                  4 novas
                </Badge>
              </div>
              <ul className="max-h-80 divide-y divide-border/40 overflow-auto">
                {notificacoes.map((n) => (
                  <li
                    key={n.titulo}
                    className="flex gap-3 px-4 py-3 transition-colors hover:bg-muted/40 cursor-pointer"
                  >
                    <span
                      className={`mt-1.5 size-2 shrink-0 rounded-full ${
                        n.nivel === "destructive"
                          ? "bg-destructive"
                          : n.nivel === "warning"
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-foreground">
                        {n.titulo}
                      </p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {n.detalhe}
                      </p>
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
                className="hidden rounded-xl sm:inline-flex hover:bg-muted/60"
                onClick={() => navigate("/agenda")}
              >
                <CalendarDays className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Agenda</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl hover:bg-muted/60"
                onClick={toggle}
              >
                {theme === "dark" ? (
                  <Sun className="size-4" />
                ) : (
                  <Moon className="size-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {theme === "dark" ? "Tema claro" : "Tema escuro"}
            </TooltipContent>
          </Tooltip>

          {/* Perfil do Usuário Dinâmico (Nome e Emai obtidos do Login) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="ml-1 flex items-center gap-2 rounded-2xl p-1.5 pr-3 transition-all hover:bg-muted/80 border border-transparent hover:border-border/65">
                <Avatar className="size-8 ring-2 ring-primary/20">
                  <AvatarImage
                    src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(nomeUsuario)}`}
                    alt={nomeUsuario}
                  />
                  <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                    {iniciaisUsuario}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-left text-xs leading-tight sm:block">
                  <span className="block font-semibold text-foreground truncate max-w-[120px]">
                    {nomeUsuario}
                  </span>
                  <span className="block text-[10px] text-muted-foreground capitalize">
                    {perfilUsuario}
                  </span>
                </span>
                <ChevronDown className="size-3 opacity-50 ml-0.5 hidden sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-60 rounded-2xl shadow-2xl p-1.5 border-border/80"
            >
              <DropdownMenuLabel className="px-3 py-2.5">
                <p className="text-xs font-semibold text-foreground truncate">
                  {nomeUsuario}
                </p>
                <p className="text-[10px] text-muted-foreground font-normal truncate mt-0.5">
                  {emailUsuario}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-xl cursor-pointer text-xs font-medium py-2">
                <UserRound className="size-3.5 mr-2 text-muted-foreground" />{" "}
                Perfil da Conta
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/configuracoes")}
                className="rounded-xl cursor-pointer text-xs font-medium py-2"
              >
                <Settings className="size-3.5 mr-2 text-muted-foreground" />{" "}
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="rounded-xl cursor-pointer text-xs font-medium py-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="size-3.5 mr-2" />
                Sair do Sistema
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex h-9 items-center border-t border-border/40 px-4 sm:px-6 bg-muted/10">
        <Breadcrumbs />
      </div>
    </header>
  );
}
