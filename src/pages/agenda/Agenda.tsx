import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  format,
  addWeeks,
  subWeeks,
  startOfWeek,
  addDays,
  isSameDay,
  getDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  Bus,
  Calendar as CalendarIcon,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Filter,
  MapPin,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
  Users,
} from "lucide-react";

import { toast } from "sonner";

import { EmptyState, SectionCard, StatusPill } from "@/components/ui-kit/primitives";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  listarAlunos,
  obterAgendamentosRotasDoAluno,
  type Aluno,
} from "@/services/alunos.service";
import { listarRotas, type Rota } from "@/services/rotas.service";

const TODOS = "__todos__";

interface AgendamentoRota {
  id: string;
  aluno_id: string;
  rota_id: string;
  dia_semana: number; // 0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sáb
  periodo?: string | null;
}

export default function AgendaPorRotas() {
  const navigate = useNavigate();

  // Estados de dados
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [rotas, setRotas] = useState<Rota[]>([]);
  const [agendamentos, setAgendamentos] = useState<AgendamentoRota[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de controle e filtros
  const [busca, setBusca] = useState("");
  const [rotaFiltro, setRotaFiltro] = useState(TODOS);
  const [turnoFiltro, setTurnoFiltro] = useState(TODOS);
  
  // Controle de data de referência da semana e do dia em destaque
  const [dataAtual, setDataAtual] = useState<Date>(new Date());
  const [diaSelecionado, setDiaSelecionado] = useState<Date>(new Date());

  // Controle de datas da semana útil (Segunda a Sábado)
  const inicioDaSemana = startOfWeek(dataAtual, { weekStartsOn: 1 });
  const diasDaSemana = Array.from({ length: 6 }).map((_, index) =>
    addDays(inicioDaSemana, index)
  );

  useEffect(() => {
    async function carregar() {
      setLoading(true);
      try {
        const [dadosAlunos, dadosRotas] = await Promise.all([
          listarAlunos(),
          listarRotas(),
        ]);

        const alunosLista = dadosAlunos || [];
        setAlunos(alunosLista);
        setRotas(dadosRotas || []);

        // Busca os agendamentos de todos os alunos em paralelo
        const chamadasAgendamentos = alunosLista.map((aluno) =>
          obterAgendamentosRotasDoAluno(aluno.id).catch(() => [])
        );

        const resultados = await Promise.all(chamadasAgendamentos);
        const todosAgendamentos = resultados.flat();
        setAgendamentos(todosAgendamentos);
      } catch (error) {
        console.error("Erro ao carregar dados da agenda", error);
        toast.error("Erro ao carregar agenda de rotas");
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, []);

  // Navegação semanal
  const semanaAnterior = () => {
    const novaData = subWeeks(dataAtual, 1);
    setDataAtual(novaData);
    setDiaSelecionado(startOfWeek(novaData, { weekStartsOn: 1 }));
  };

  const proximaSemana = () => {
    const novaData = addWeeks(dataAtual, 1);
    setDataAtual(novaData);
    setDiaSelecionado(startOfWeek(novaData, { weekStartsOn: 1 }));
  };

  const irParaHoje = () => {
    const hoje = new Date();
    setDataAtual(hoje);
    setDiaSelecionado(hoje);
  };

  function limparFiltros() {
    setBusca("");
    setRotaFiltro(TODOS);
    setTurnoFiltro(TODOS);
  }

  // Mapa de acesso rápido a dados do aluno por ID
  const alunosMap = useMemo(() => {
    const map = new Map<string, Aluno>();
    alunos.forEach((a) => map.set(a.id, a));
    return map;
  }, [alunos]);

  // Set com os IDs dos alunos que possuem qualquer agendamento cadastrado
  const alunosComAgendamento = useMemo(() => {
    return new Set(agendamentos.map((ag) => ag.aluno_id));
  }, [agendamentos]);

  // Índice numérico do dia da semana selecionado (0=Dom, 1=Seg, ..., 6=Sáb)
  const diaSemanaSelecionadoIndex = getDay(diaSelecionado);

  // Processa rotas e alunos alocados no dia da semana atualmente selecionado
  const rotasDoDiaSelecionado = useMemo(() => {
    const q = busca.toLowerCase().trim();

    const rotasFiltradas = rotas.filter((r) =>
      rotaFiltro === TODOS ? true : r.id === rotaFiltro
    );

    return rotasFiltradas
      .map((rota) => {
        const alunosDoDia: Aluno[] = [];

        // 1. Processa agendamentos explícitos da rota para o dia selecionado
        agendamentos.forEach((ag) => {
          if (ag.rota_id !== rota.id) return;
          if (ag.dia_semana !== diaSemanaSelecionadoIndex) return;

          const aluno = alunosMap.get(ag.aluno_id);
          if (!aluno) return;

          const bateTexto =
            !q ||
            aluno.nome.toLowerCase().includes(q) ||
            aluno.matricula.toLowerCase().includes(q);
          const bateTurno =
            turnoFiltro === TODOS || aluno.turno === turnoFiltro;

          if (bateTexto && bateTurno) {
            if (!alunosDoDia.some((a) => a.id === aluno.id)) {
              alunosDoDia.push(aluno);
            }
          }
        });

        // 2. Fallback: Se o aluno NÃO tem nenhum agendamento cadastrado no sistema,
        // mas a rota_id do cadastro do aluno corresponde a esta rota (apenas dias úteis 1-5)
        if (diaSemanaSelecionadoIndex >= 1 && diaSemanaSelecionadoIndex <= 5) {
          alunos.forEach((aluno) => {
            const temQualquerAgendamento = alunosComAgendamento.has(aluno.id);

            if (!temQualquerAgendamento && aluno.rota_id === rota.id) {
              const bateTexto =
                !q ||
                aluno.nome.toLowerCase().includes(q) ||
                aluno.matricula.toLowerCase().includes(q);
              const bateTurno =
                turnoFiltro === TODOS || aluno.turno === turnoFiltro;

              if (bateTexto && bateTurno) {
                if (!alunosDoDia.some((a) => a.id === aluno.id)) {
                  alunosDoDia.push(aluno);
                }
              }
            }
          });
        }

        return {
          ...rota,
          alunos: alunosDoDia,
          totalPassageiros: alunosDoDia.length,
        };
      })
      .filter((rota) => {
        if (q || turnoFiltro !== TODOS) {
          return rota.totalPassageiros > 0;
        }
        return true;
      });
  }, [
    rotas,
    alunos,
    agendamentos,
    alunosMap,
    alunosComAgendamento,
    busca,
    rotaFiltro,
    turnoFiltro,
    diaSemanaSelecionadoIndex,
  ]);

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      {/* Header principal */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">
            Agenda por Rota
          </h1>
          <p className="text-sm text-muted-foreground">
            Escalonamento de transporte semanal •{" "}
            <span className="font-medium text-foreground">
              {format(inicioDaSemana, "dd 'de' MMMM", { locale: ptBR })}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => toast.success("Exportação da agenda iniciada")}
          >
            <Download className="size-4 mr-2" />
            Exportar
          </Button>

          {/* Navegador de Semanas */}
          <div className="flex items-center gap-1 border-l pl-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl size-9"
              onClick={semanaAnterior}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="rounded-xl h-9 text-xs"
              onClick={irParaHoje}
            >
              <CalendarIcon className="size-3.5 mr-1.5 text-muted-foreground" />
              Hoje
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl size-9"
              onClick={proximaSemana}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Seletor de Dias da Semana (Destaque do dia selecionado + Navegação por clique) */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
        {diasDaSemana.map((dia) => {
          const ehHoje = isSameDay(dia, new Date());
          const ehSelecionado = isSameDay(dia, diaSelecionado);

          return (
            <button
              key={dia.toISOString()}
              type="button"
              onClick={() => setDiaSelecionado(dia)}
              className={`flex flex-col items-start justify-between rounded-xl border p-3.5 transition-all text-left cursor-pointer ${
                ehSelecionado
                  ? "border-primary bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20"
                  : ehHoje
                  ? "border-primary/50 bg-primary/5 hover:bg-primary/10"
                  : "bg-card hover:bg-accent/50 hover:border-accent-foreground/20"
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span
                  className={`text-[11px] font-semibold uppercase tracking-wider ${
                    ehSelecionado
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground"
                  }`}
                >
                  {format(dia, "EEEE", { locale: ptBR })}
                </span>
                {ehHoje && (
                  <Badge
                    variant={ehSelecionado ? "secondary" : "default"}
                    className="text-[9px] px-1.5 py-0 font-medium"
                  >
                    Hoje
                  </Badge>
                )}
              </div>

              <div className="mt-2">
                <p
                  className={`text-xl font-bold tracking-tight ${
                    ehSelecionado ? "text-primary-foreground" : "text-foreground"
                  }`}
                >
                  {format(dia, "dd/MM")}
                </p>
              </div>

              <div className="mt-3 flex items-center gap-1 text-[11px]">
                <span
                  className={`font-medium ${
                    ehSelecionado
                      ? "text-primary-foreground/90"
                      : "text-muted-foreground"
                  }`}
                >
                  {ehSelecionado ? "Visualizando" : "Clique para ver"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filtros */}
      <SectionCard
        title={
          <div className="flex items-center gap-2">
            <span>Filtros para</span>
            <Badge variant="outline" className="text-xs font-semibold">
              {format(diaSelecionado, "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </Badge>
          </div>
        }
        description="Filtre os alunos agendados para este dia"
        action={
          <Button variant="ghost" size="sm" onClick={limparFiltros}>
            <Filter className="size-4 mr-2" />
            Limpar
          </Button>
        }
      >
        <div className="grid gap-3 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <Input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar aluno na rota..."
              className="pl-9 rounded-xl"
            />
          </div>

          <Select value={rotaFiltro} onValueChange={setRotaFiltro}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Selecionar Rota" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TODOS}>Todas as rotas</SelectItem>
              {rotas.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={turnoFiltro} onValueChange={setTurnoFiltro}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Selecionar Turno" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TODOS}>Todos os turnos</SelectItem>
              <SelectItem value="Manhã">Manhã</SelectItem>
              <SelectItem value="Tarde">Tarde</SelectItem>
              <SelectItem value="Noite">Noite</SelectItem>
              <SelectItem value="Integral">Integral</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SectionCard>

      {/* Exibição das Rotas no Dia Selecionado */}
      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          Carregando rotas e agendamentos...
        </div>
      ) : rotasDoDiaSelecionado.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Nenhum agendamento encontrado"
          description={`Não há rota com passageiros cadastrados para ${format(
            diaSelecionado,
            "EEEE (dd/MM)",
            { locale: ptBR }
          )} com os filtros atuais.`}
          action={
            <Button variant="outline" onClick={limparFiltros}>
              <SlidersHorizontal className="size-4 mr-2" />
              Limpar Filtros
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          {rotasDoDiaSelecionado.map((rota) => (
            <SectionCard
              key={rota.id}
              title={
                <div className="flex items-center gap-2">
                  <Bus className="size-5 text-primary" />
                  <span>{rota.nome}</span>
                </div>
              }
              description={
                <span className="flex items-center gap-1.5">
                  <Users className="size-3.5 text-muted-foreground" />
                  {rota.totalPassageiros}{" "}
                  {rota.totalPassageiros === 1
                    ? "passageiro agendado"
                    : "passageiros agendados"}
                </span>
              }
              action={
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => navigate(`/rotas/${rota.id}`)}
                    >
                      Ver detalhes da Rota
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              }
            >
              {rota.alunos.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted-foreground italic border rounded-xl bg-muted/10">
                  Nenhum aluno agendado para esta rota neste dia.
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                  {rota.alunos.map((aluno) => (
                    <div
                      key={aluno.id}
                      onClick={() => navigate(`/alunos/${aluno.id}`)}
                      className="group cursor-pointer rounded-xl border bg-card p-3 shadow-xs hover:border-primary/50 hover:shadow-sm transition-all space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="size-8">
                            <AvatarImage src={aluno.foto_url ?? undefined} />
                            <AvatarFallback className="text-xs">
                              {aluno.nome.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold truncate group-hover:text-primary transition-colors">
                              {aluno.nome}
                            </p>
                            <p className="text-[10px] text-muted-foreground truncate">
                              Matrícula: {aluno.matricula || "N/A"}
                            </p>
                          </div>
                        </div>

                        {(aluno as any).escolas?.nome && (
                          <div className="flex items-center gap-1 text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                            <MapPin className="size-3 shrink-0 text-muted-foreground/70" />
                            <span className="truncate">
                              {(aluno as any).escolas.nome}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t text-[10px]">
                        <span className="flex items-center gap-1 text-muted-foreground font-medium">
                          <Clock className="size-3" />
                          {aluno.turno || "Manhã"}
                        </span>
                        <StatusPill status={aluno.status ?? "ativo"} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          ))}
        </div>
      )}
    </div>
  );
}