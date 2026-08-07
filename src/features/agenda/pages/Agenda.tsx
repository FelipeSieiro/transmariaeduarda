// src/pages/AgendaPorRotas.tsx

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
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Filter,
  MapPin,
  Search,
  Loader2,
} from "lucide-react";

import { toast } from "sonner";

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

import { listarAlunos, obterAgendamentosRotasDoAluno } from "@/features/alunos/services/alunos.service";
import { listarRotas } from "@/features/rotas/services/rotas.service";
import type { AgendamentoRota } from "@/features/agenda/types/agendamento";
import type { Aluno } from "@/features/alunos/types/alunos";
import type { Rota } from "@/features/rotas/types/rota";

const TODOS = "__todos__";

function getIniciais(nome?: string): string {
  if (!nome) return "AL";
  const partes = nome.trim().split(" ").filter(Boolean);
  if (partes.length === 0) return "AL";
  if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

function obterNomeEscola(aluno: Aluno): string {
  if (typeof aluno.escolas === "string") return aluno.escolas;
  if (typeof aluno.escola === "string") return aluno.escola;
  return aluno.escola?.nome ?? aluno.escolas?.nome ?? aluno.escola_nome ?? "";
}

export default function AgendaPorRotas() {
  const navigate = useNavigate();

  const [alunos, setAlunos] = useState<readonly Aluno[]>([]);
  const [rotas, setRotas] = useState<readonly Rota[]>([]);
  const [agendamentos, setAgendamentos] = useState<readonly AgendamentoRota[]>([]);
  const [loading, setLoading] = useState(true);

  const [busca, setBusca] = useState("");
  const [rotaFiltro, setRotaFiltro] = useState(TODOS);
  const [turnoFiltro, setTurnoFiltro] = useState(TODOS);
  
  const [dataAtual, setDataAtual] = useState<Date>(new Date());
  const [diaSelecionado, setDiaSelecionado] = useState<Date>(new Date());

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

        const chamadasAgendamentos = alunosLista.map((aluno) =>
          obterAgendamentosRotasDoAluno(aluno.id).catch(() => [])
        );

        const resultados = await Promise.all(chamadasAgendamentos);
        setAgendamentos(resultados.flat());
      } catch (error) {
        console.error("Erro ao carregar dados da agenda", error);
        toast.error("Erro ao carregar agenda de rotas");
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, []);

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

  const alunosMap = useMemo(() => {
    const map = new Map<string, Aluno>();
    alunos.forEach((a) => map.set(a.id, a));
    return map;
  }, [alunos]);

  const alunosComAgendamento = useMemo(() => {
    return new Set(
      agendamentos.flatMap((ag) => (ag.aluno_id ? [ag.aluno_id] : []))
    );
  }, [agendamentos]);

  const diaSemanaSelecionadoIndex = getDay(diaSelecionado);

  const rotasDoDiaSelecionado = useMemo(() => {
    const q = busca.toLowerCase().trim();

    const rotasFiltradas = rotas.filter((r) =>
      rotaFiltro === TODOS ? true : r.id === rotaFiltro
    );

    return rotasFiltradas
      .map((rota) => {
        const alunosDoDia: Aluno[] = [];

        agendamentos.forEach((ag) => {
          if (ag.rota_id !== rota.id) return;
          if (ag.dia_semana !== diaSemanaSelecionadoIndex) return;
          if (!ag.aluno_id) return;

          const aluno = alunosMap.get(ag.aluno_id);
          if (!aluno) return;

          const bateTexto =
            !q ||
            aluno.nome.toLowerCase().includes(q) ||
            (aluno.matricula && aluno.matricula.toLowerCase().includes(q));
          const bateTurno =
            turnoFiltro === TODOS || aluno.turno === turnoFiltro;

          if (bateTexto && bateTurno) {
            if (!alunosDoDia.some((a) => a.id === aluno.id)) {
              alunosDoDia.push(aluno);
            }
          }
        });

        if (diaSemanaSelecionadoIndex >= 1 && diaSemanaSelecionadoIndex <= 5) {
          alunos.forEach((aluno) => {
            const temQualquerAgendamento = alunosComAgendamento.has(aluno.id);

            if (!temQualquerAgendamento && aluno.rota_id === rota.id) {
              const bateTexto =
                !q ||
                aluno.nome.toLowerCase().includes(q) ||
                (aluno.matricula && aluno.matricula.toLowerCase().includes(q));
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
    <div className="mx-auto max-w-6xl space-y-6 py-2">
      
      {/* Header Minimalista */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Agenda por Rota
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Escala diária de passageiros •{" "}
            <span className="font-medium text-foreground">
              {format(inicioDaSemana, "dd 'de' MMMM", { locale: ptBR })}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-lg text-xs"
            onClick={() => toast.success("Exportação iniciada")}
          >
            <Download className="size-3.5 mr-1.5 opacity-70" />
            Exportar
          </Button>

          <div className="flex items-center gap-0.5 bg-background/50 border border-border/60 p-0.5 rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              className="size-7 rounded-md text-muted-foreground hover:text-foreground"
              onClick={semanaAnterior}
              title="Semana anterior"
            >
              <ChevronLeft className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-[11px] font-medium rounded-md text-foreground"
              onClick={irParaHoje}
            >
              <CalendarIcon className="size-3 mr-1 text-primary opacity-80" />
              Hoje
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 rounded-md text-muted-foreground hover:text-foreground"
              onClick={proximaSemana}
              title="Próxima semana"
            >
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Seletor de Dias da Semana Minimalista */}
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-6 bg-muted/20 p-1.5 rounded-xl border border-border/40">
        {diasDaSemana.map((dia) => {
          const ehHoje = isSameDay(dia, new Date());
          const ehSelecionado = isSameDay(dia, diaSelecionado);

          return (
            <button
              key={dia.toISOString()}
              type="button"
              onClick={() => setDiaSelecionado(dia)}
              className={`flex items-center justify-between sm:flex-col sm:items-start p-2.5 rounded-lg transition-all text-left cursor-pointer ${
                ehSelecionado
                  ? "bg-primary text-primary-foreground font-medium shadow-2xs"
                  : ehHoje
                  ? "bg-muted hover:bg-muted/80 text-foreground"
                  : "hover:bg-muted/50 text-muted-foreground"
              }`}
            >
              <span className={`text-[10px] uppercase tracking-wider ${ehSelecionado ? "text-primary-foreground/80" : "text-muted-foreground/70"}`}>
                {format(dia, "EEEE", { locale: ptBR })}
              </span>
              <div className="flex items-center gap-1.5 sm:mt-1">
                <span className="text-xs font-semibold">{format(dia, "dd/MM")}</span>
                {ehHoje && !ehSelecionado && (
                  <span className="text-[9px] px-1 rounded bg-primary/10 text-primary font-semibold">Hoje</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Barra de Filtros Compacta */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground/70" />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar aluno ou matrícula..."
            className="pl-9 h-9 text-xs rounded-lg bg-background/50 border-border/60"
          />
        </div>

        <Select value={rotaFiltro} onValueChange={setRotaFiltro}>
          <SelectTrigger className="w-full sm:w-[180px] h-9 text-xs rounded-lg bg-background/50 border-border/60">
            <SelectValue placeholder="Todas as rotas" />
          </SelectTrigger>
          <SelectContent className="rounded-xl text-xs">
            <SelectItem value={TODOS}>Todas as rotas</SelectItem>
            {rotas.map((r) => (
              <SelectItem key={r.id} value={r.id}>{r.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={turnoFiltro} onValueChange={setTurnoFiltro}>
          <SelectTrigger className="w-full sm:w-[150px] h-9 text-xs rounded-lg bg-background/50 border-border/60">
            <SelectValue placeholder="Todos turnos" />
          </SelectTrigger>
          <SelectContent className="rounded-xl text-xs">
            <SelectItem value={TODOS}>Todos turnos</SelectItem>
            <SelectItem value="Manhã">Manhã</SelectItem>
            <SelectItem value="Tarde">Tarde</SelectItem>
            <SelectItem value="Noite">Noite</SelectItem>
            <SelectItem value="Integral">Integral</SelectItem>
          </SelectContent>
        </Select>

        {(busca || rotaFiltro !== TODOS || turnoFiltro !== TODOS) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={limparFiltros}
            className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground ml-auto"
          >
            <Filter className="size-3.5 mr-1.5" />
            Limpar
          </Button>
        )}
      </div>

      {/* Conteúdo das Rotas */}
      {loading ? (
        <div className="py-16 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
          <Loader2 className="size-4 animate-spin text-primary" />
          <span>Carregando escala...</span>
        </div>
      ) : rotasDoDiaSelecionado.length === 0 ? (
        <div className="py-12 text-center text-xs text-muted-foreground border border-border/60 rounded-xl bg-card/50">
          Nenhum agendamento encontrado para {format(diaSelecionado, "dd/MM", { locale: ptBR })}.
        </div>
      ) : (
        <div className="space-y-4">
          {rotasDoDiaSelecionado.map((rota) => (
            <div key={rota.id} className="rounded-xl border border-border/60 bg-card/50 overflow-hidden shadow-2xs">
              
              {/* Header da Rota */}
              <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <Bus className="size-3.5 text-primary opacity-80" />
                  <span className="text-xs font-medium text-foreground">{rota.nome}</span>
                </div>
                <Badge variant="secondary" className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground shadow-none">
                  {rota.totalPassageiros} {rota.totalPassageiros === 1 ? "passageiro" : "passageiros"}
                </Badge>
              </div>

              {/* Lista de Alunos */}
              {rota.alunos.length === 0 ? (
                <div className="px-4 py-3 text-xs text-muted-foreground/70 italic">
                  Nenhum aluno alocado nesta rota para este dia.
                </div>
              ) : (
                <div className="divide-y divide-border/40">
                  {rota.alunos.map((aluno) => {
                    const escolaNome = obterNomeEscola(aluno);
                    const fotoUrl = aluno.foto || aluno.foto_url || aluno.avatar_url;

                    return (
                      <div
                        key={aluno.id}
                        onClick={() => navigate(`/alunos/${aluno.id}`)}
                        className="flex items-center justify-between px-4 py-2.5 hover:bg-muted/30 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Avatar className="size-6 shrink-0 border border-border/60">
                            <AvatarImage src={fotoUrl ?? undefined} alt={aluno.nome} />
                            <AvatarFallback className="text-[9px] bg-primary/10 text-primary font-medium">
                              {getIniciais(aluno.nome)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-xs font-medium truncate group-hover:underline text-foreground">
                              {aluno.nome}
                            </p>
                            <p className="text-[10px] text-muted-foreground/70 truncate font-mono">
                              Mat: {aluno.matricula || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                          {escolaNome && (
                            <span className="hidden md:flex items-center gap-1 max-w-xs truncate text-[11px] text-muted-foreground/80">
                              <MapPin className="size-3 text-muted-foreground/60" />
                              <span className="truncate">{escolaNome}</span>
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-[10px] font-medium bg-muted/50 px-2 py-0.5 rounded text-foreground/80">
                            <Clock className="size-3 text-muted-foreground/70" />
                            {aluno.turno || "Manhã"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}