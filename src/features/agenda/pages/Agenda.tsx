// src/pages/AgendaPorRotas.tsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, addWeeks, subWeeks, startOfWeek, addDays, isSameDay, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Bus, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Download, Filter, Search, Loader2, School, User, ChevronDown, FileText } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import { listarAlunos, obterAgendamentosRotasDoAluno } from "@/features/alunos/services/alunos.service";
import { listarRotas } from "@/features/rotas/services/rotas.service";
import type { AgendamentoRota } from "@/features/agenda/types/agendamento";
import type { Aluno } from "@/features/alunos/types/alunos";
import type { Rota } from "@/features/rotas/types/rota";

const TODOS = "__todos__";

const getIniciais = (nome?: string) => {
  if (!nome) return "AL";
  const p = nome.trim().split(" ").filter(Boolean);
  if (!p.length) return "AL";
  return p.length === 1 ? p[0].substring(0, 2).toUpperCase() : (p[0][0] + p[p.length - 1][0]).toUpperCase();
};

const obterNomeEscola = (a: Aluno) => typeof a.escolas === "string" ? a.escolas : typeof a.escola === "string" ? a.escola : a.escola?.nome ?? a.escolas?.nome ?? a.escola_nome ?? "Sem Escola";

const obterNomeMotorista = (r: Rota & { motorista?: string; motorista_nome?: string; motoristas?: { nome?: string }; nome_motorista?: string; motorista_id?: string }) => {
  if (r.motorista) return r.motorista;
  if (r.motorista_nome) return r.motorista_nome;
  if (r.nome_motorista) return r.nome_motorista;
  if (r.motoristas?.nome) return r.motoristas.nome;

  if (r.motorista_id === "309d4044-12b4-442e-8975-f997bd1ddf29") return "Edson Paim";
  if (r.motorista_id === "2ba72fda-d196-4941-8537-5050c7797707") return "Karina Anastacio";

  return "Motorista não atribuído";
};

interface AlunoComHorario extends Aluno {
  horarioTrajeto?: string;
  tipoTrajeto?: string;
}

interface GrupoEscolaTurno {
  escola: string;
  turno: string;
  alunos: AlunoComHorario[];
}

interface RotaComGrupos extends Rota {
  motoristaNome: string;
  grupos: GrupoEscolaTurno[];
  totalPassageiros: number;
}

interface GrupoMotorista {
  motorista: string;
  rotas: RotaComGrupos[];
  totalPassageirosMotorista: number;
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
  
  const [motoristasAbertos, setMotoristasAbertos] = useState<Record<string, boolean>>({});
  const [rotasAbertas, setRotasAbertas] = useState<Record<string, boolean>>({});

  const inicioDaSemana = startOfWeek(dataAtual, { weekStartsOn: 1 });
  const diasDaSemana = Array.from({ length: 6 }).map((_, i) => addDays(inicioDaSemana, i));

  useEffect(() => {
    async function carregar() {
      setLoading(true);
      try {
        const [dAlunos, dRotas] = await Promise.all([listarAlunos(), listarRotas()]);
        const listaAlunos = dAlunos || [];
        setAlunos(listaAlunos);
        setRotas(dRotas || []);

        const res = await Promise.all(listaAlunos.map((a) => obterAgendamentosRotasDoAluno(a.id).catch(() => [])));
        setAgendamentos(res.flat());
      } catch (err) {
        console.error("Erro ao carregar dados da agenda", err);
        toast.error("Erro ao carregar agenda de rotas");
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  const mudarSemana = (tipo: "ant" | "prox") => {
    const nova = tipo === "ant" ? subWeeks(dataAtual, 1) : addWeeks(dataAtual, 1);
    setDataAtual(nova);
    setDiaSelecionado(startOfWeek(nova, { weekStartsOn: 1 }));
  };

  const alunosMap = useMemo(() => new Map(alunos.map((a) => [a.id, a])), [alunos]);
  const alunosComAgendamento = useMemo(() => new Set(agendamentos.flatMap((ag) => ag.aluno_id ? [ag.aluno_id] : [])), [agendamentos]);
  const diaSemanaIndex = getDay(diaSelecionado);

  const gruposPorMotorista = useMemo(() => {
    const q = busca.toLowerCase().trim();
    
    const rotasProcessadas: RotaComGrupos[] = rotas
      .filter((r) => rotaFiltro === TODOS || r.id === rotaFiltro)
      .map((rota) => {
        const mapaAlunosDia = new Map<string, AlunoComHorario>();

        agendamentos.forEach((ag) => {
          if (ag.rota_id !== rota.id || ag.dia_semana !== diaSemanaIndex || !ag.aluno_id) return;
          const aluno = alunosMap.get(ag.aluno_id);
          if (!aluno) return;

          if ((!q || aluno.nome.toLowerCase().includes(q) || aluno.matricula?.toLowerCase().includes(q)) && (turnoFiltro === TODOS || aluno.turno === turnoFiltro)) {
            mapaAlunosDia.set(aluno.id, {
              ...aluno,
              horarioTrajeto: ag.horario,
              tipoTrajeto: ag.tipo_trajeto,
            });
          }
        });

        if (diaSemanaIndex >= 1 && diaSemanaIndex <= 5) {
          alunos.forEach((aluno) => {
            if (!alunosComAgendamento.has(aluno.id) && aluno.rota_id === rota.id) {
              if ((!q || aluno.nome.toLowerCase().includes(q) || aluno.matricula?.toLowerCase().includes(q)) && (turnoFiltro === TODOS || aluno.turno === turnoFiltro)) {
                if (!mapaAlunosDia.has(aluno.id)) {
                  mapaAlunosDia.set(aluno.id, {
                    ...aluno,
                    horarioTrajeto: undefined,
                    tipoTrajeto: undefined,
                  });
                }
              }
            }
          });
        }

        const listaAlunos = Array.from(mapaAlunosDia.values());

        const gruposMap = new Map<string, AlunoComHorario[]>();
        listaAlunos.forEach((aluno) => {
          const escola = obterNomeEscola(aluno);
          const turno = aluno.turno || "Manhã";
          const chave = `${escola}___${turno}`;

          if (!gruposMap.has(chave)) {
            gruposMap.set(chave, []);
          }
          gruposMap.get(chave)?.push(aluno);
        });

        const grupos: GrupoEscolaTurno[] = Array.from(gruposMap.entries()).map(([chave, itens]) => {
          const [escola, turno] = chave.split("___");
          return { escola, turno, alunos: itens };
        });

        return {
          ...rota,
          motoristaNome: obterNomeMotorista(rota as any),
          grupos,
          totalPassageiros: listaAlunos.length,
        };
      })
      .filter((rota) => (q || turnoFiltro !== TODOS ? rota.totalPassageiros > 0 : true));

    const motoristasMap = new Map<string, RotaComGrupos[]>();
    rotasProcessadas.forEach((rota) => {
      const mot = rota.motoristaNome;
      if (!motoristasMap.has(mot)) {
        motoristasMap.set(mot, []);
      }
      motoristasMap.get(mot)?.push(rota);
    });

    const resultado: GrupoMotorista[] = Array.from(motoristasMap.entries()).map(([motorista, listaRotas]) => {
      const totalPassageirosMotorista = listaRotas.reduce((acc, r) => acc + r.totalPassageiros, 0);
      return {
        motorista,
        rotas: listaRotas,
        totalPassageirosMotorista,
      };
    });

    return resultado;
  }, [rotas, alunos, agendamentos, alunosMap, alunosComAgendamento, busca, rotaFiltro, turnoFiltro, diaSemanaIndex]);

  const toggleMotorista = (motorista: string) => {
    setMotoristasAbertos((prev) => ({
      ...prev,
      [motorista]: !prev[motorista],
    }));
  };

  const toggleRota = (rotaId: string) => {
    setRotasAbertas((prev) => ({
      ...prev,
      [rotaId]: !prev[rotaId],
    }));
  };

  // Geração de PDF limpo, moderno e perfeitamente alinhado por Motorista
  const exportarPdfPorMotorista = (grupoMot: GrupoMotorista) => {
    try {
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const dataFormatada = format(diaSelecionado, "dd/MM/yyyy", { locale: ptBR });
      const diaSemanaStr = format(diaSelecionado, "EEEE", { locale: ptBR });
      const diaSemanaFormatado = diaSemanaStr.charAt(0).toUpperCase() + diaSemanaStr.slice(1);
      
      let y = 18;

      // Cabeçalho institucional limpo
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42); // Tom escuro moderno (slate-900)
      doc.text("AGENDA DE ROTAS", 14, y);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139); // Slate-500
      doc.text(`${diaSemanaFormatado}, ${dataFormatada}`, 196, y, { align: "right" });

      y += 8;
      
      // Bloco de informações do Motorista com fundo suave e discreto
      doc.setFillColor(248, 250, 252); // Slate-50
      doc.setDrawColor(226, 232, 240); // Slate-200
      doc.roundedRect(14, y, 182, 14, 1.5, 1.5, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59);
      doc.text(`Motorista: ${grupoMot.motorista}`, 18, y + 9);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.text(`Total: ${grupoMot.totalPassageirosMotorista} passageiro(s)`, 190, y + 9, { align: "right" });

      y += 20;

      if (grupoMot.rotas.length === 0) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.setTextColor(148, 163, 184);
        doc.text("Nenhuma rota atribuída para este motorista.", 14, y);
      } else {
        grupoMot.rotas.forEach((rota) => {
          if (y > 250) {
            doc.addPage();
            y = 18;
          }

          // Nome da Rota em destaque limpo
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.setTextColor(15, 23, 42);
          doc.text(`ROTA: ${rota.nome.toUpperCase()}`, 14, y);
          y += 6;

          rota.grupos.forEach((grupo) => {
            if (y > 265) {
              doc.addPage();
              y = 18;
            }

            // Subseção Escola / Turno
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9.5);
            doc.setTextColor(71, 85, 105);
            doc.text(`Escola: ${grupo.escola} (${grupo.turno})`, 16, y);
            y += 5;

            // Alunos numerados com espaçamento limpo
            grupo.alunos.forEach((aluno, aIdx) => {
              if (y > 275) {
                doc.addPage();
                y = 18;
              }

              doc.setFont("helvetica", "normal");
              doc.setFontSize(9.5);
              doc.setTextColor(30, 41, 59);
              
              const textoAluno = `${aIdx + 1}.  ${aluno.nome}`;
              doc.text(textoAluno, 20, y);

              if (aluno.horarioTrajeto) {
                doc.setFont("helvetica", "italic");
                doc.setFontSize(8.5);
                doc.setTextColor(100, 116, 139);
                doc.text(`(${aluno.horarioTrajeto})`, 190, y, { align: "right" });
              }

              y += 5.5;
            });

            y += 2;
          });

          y += 6;
        });
      }

      doc.save(`Agenda_Motorista_${grupoMot.motorista.replace(/\s+/g, "_")}_${format(diaSelecionado, "yyyy-MM-dd")}.pdf`);
      toast.success(`PDF do motorista ${grupoMot.motorista} gerado com sucesso!`);
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      toast.error("Erro ao gerar o PDF.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Agenda</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Escala diária de passageiros • <span className="font-medium text-foreground">{format(inicioDaSemana, "dd 'de' MMMM", { locale: ptBR })}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 rounded-lg text-xs" onClick={() => toast.success("Exportação iniciada")}>
            <Download className="size-3.5 mr-1.5 opacity-70" /> Exportar
          </Button>

          <div className="flex items-center gap-0.5 bg-background/50 border border-border/60 p-0.5 rounded-lg">
            <Button variant="ghost" size="icon" className="size-7 rounded-md text-muted-foreground hover:text-foreground" onClick={() => mudarSemana("ant")}>
              <ChevronLeft className="size-3.5" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px] font-medium rounded-md text-foreground" onClick={() => { const hoje = new Date(); setDataAtual(hoje); setDiaSelecionado(hoje); }}>
              <CalendarIcon className="size-3 mr-1 text-primary opacity-80" /> Hoje
            </Button>
            <Button variant="ghost" size="icon" className="size-7 rounded-md text-muted-foreground hover:text-foreground" onClick={() => mudarSemana("prox")}>
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Seletor de Dias */}
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-6 bg-muted/20 p-1.5 rounded-xl border border-border/40">
        {diasDaSemana.map((dia) => {
          const ehHoje = isSameDay(dia, new Date());
          const ehSel = isSameDay(dia, diaSelecionado);

          return (
            <button
              key={dia.toISOString()}
              type="button"
              onClick={() => setDiaSelecionado(dia)}
              className={`flex items-center justify-between sm:flex-col sm:items-start p-2.5 rounded-lg transition-all text-left cursor-pointer ${
                ehSel ? "bg-primary text-primary-foreground font-medium shadow-2xs" : ehHoje ? "bg-muted hover:bg-muted/80 text-foreground" : "hover:bg-muted/50 text-muted-foreground"
              }`}
            >
              <span className={`text-[10px] uppercase tracking-wider ${ehSel ? "text-primary-foreground/80" : "text-muted-foreground/70"}`}>
                {format(dia, "EEEE", { locale: ptBR })}
              </span>
              <div className="flex items-center gap-1.5 sm:mt-1">
                <span className="text-xs font-semibold">{format(dia, "dd/MM")}</span>
                {ehHoje && !ehSel && <span className="text-[9px] px-1 rounded bg-primary/10 text-primary font-semibold">Hoje</span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground/70" />
          <Input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar aluno ou matrícula..." className="pl-9 h-9 text-xs rounded-lg bg-background/50 border-border/60" />
        </div>

        <Select value={rotaFiltro} onValueChange={setRotaFiltro}>
          <SelectTrigger className="w-full sm:w-[180px] h-9 text-xs rounded-lg bg-background/50 border-border/60"><SelectValue placeholder="Todas as rotas" /></SelectTrigger>
          <SelectContent className="rounded-xl text-xs">
            <SelectItem value={TODOS}>Todas as rotas</SelectItem>
            {rotas.map((r) => <SelectItem key={r.id} value={r.id}>{r.nome}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={turnoFiltro} onValueChange={setTurnoFiltro}>
          <SelectTrigger className="w-full sm:w-[150px] h-9 text-xs rounded-lg bg-background/50 border-border/60"><SelectValue placeholder="Todos turnos" /></SelectTrigger>
          <SelectContent className="rounded-xl text-xs">
            <SelectItem value={TODOS}>Todos turnos</SelectItem>
            {["Manhã", "Tarde", "Noite", "Integral"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>

        {(busca || rotaFiltro !== TODOS || turnoFiltro !== TODOS) && (
          <Button variant="ghost" size="sm" onClick={() => { setBusca(""); setRotaFiltro(TODOS); setTurnoFiltro(TODOS); }} className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground ml-auto">
            <Filter className="size-3.5 mr-1.5" /> Limpar
          </Button>
        )}
      </div>

      {/* Conteúdo */}
      {loading ? (
        <div className="py-16 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
          <Loader2 className="size-4 animate-spin text-primary" /> Carregando escala...
        </div>
      ) : gruposPorMotorista.length === 0 ? (
        <div className="py-12 text-center text-xs text-muted-foreground border border-border/60 rounded-xl bg-card/50">
          Nenhum agendamento encontrado para {format(diaSelecionado, "dd/MM", { locale: ptBR })}.
        </div>
      ) : (
        <div className="space-y-4">
          {gruposPorMotorista.map((grupoMot, mIndex) => {
            const isMotoristaOpen = motoristasAbertos[grupoMot.motorista] ?? true;

            return (
              <Collapsible
                key={mIndex}
                open={isMotoristaOpen}
                onOpenChange={() => toggleMotorista(grupoMot.motorista)}
                className="rounded-xl border border-border/60 bg-card/50 overflow-hidden shadow-2xs"
              >
                {/* Cabeçalho do Motorista com Botão de PDF por Motorista */}
                <div className="flex items-center justify-between p-4 bg-muted/20 border-b border-border/40 hover:bg-muted/40 transition-colors">
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center gap-3 cursor-pointer flex-1">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <User className="size-4" />
                      </div>
                      <div>
                        <h2 className="text-xs font-semibold text-foreground flex items-center gap-2">
                          {grupoMot.motorista}
                        </h2>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {grupoMot.rotas.length} {grupoMot.rotas.length === 1 ? "rota atribuída" : "rotas atribuídas"}
                        </p>
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2.5 text-[11px] gap-1 bg-background"
                      onClick={(e) => {
                        e.stopPropagation();
                        exportarPdfPorMotorista(grupoMot);
                      }}
                    >
                      <FileText className="size-3 text-primary" /> PDF do Motorista
                    </Button>

                    <Badge variant="outline" className="text-xs font-medium px-2.5 py-0.5 rounded-lg bg-background/50">
                      {grupoMot.totalPassageirosMotorista} {grupoMot.totalPassageirosMotorista === 1 ? "passageiro" : "passageiros"}
                    </Badge>

                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-7 cursor-pointer">
                        <ChevronDown className={`size-4 text-muted-foreground transition-transform duration-200 ${isMotoristaOpen ? "transform rotate-180" : ""}`} />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>

                {/* Conteúdo do Motorista */}
                <CollapsibleContent>
                  <div className="p-3 space-y-2.5 bg-background/20">
                    {grupoMot.rotas.map((rota) => {
                      const isRotaOpen = rotasAbertas[rota.id] ?? true;

                      return (
                        <Collapsible
                          key={rota.id}
                          open={isRotaOpen}
                          onOpenChange={() => toggleRota(rota.id)}
                          className="rounded-lg border border-border/50 bg-card overflow-hidden shadow-none"
                        >
                          {/* Cabeçalho da Rota */}
                          <div className="flex items-center justify-between px-3.5 py-2.5 bg-muted/10 hover:bg-muted/30 transition-colors">
                            <CollapsibleTrigger asChild>
                              <div className="flex items-center gap-2 cursor-pointer flex-1">
                                <Bus className="size-3.5 text-primary" />
                                <span className="text-xs font-medium text-foreground">{rota.nome}</span>
                              </div>
                            </CollapsibleTrigger>

                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md font-medium">
                                {rota.totalPassageiros} {rota.totalPassageiros === 1 ? "passageiro" : "passageiros"}
                              </span>

                              <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-7 cursor-pointer">
                                  <ChevronDown className={`size-3 text-muted-foreground transition-transform duration-200 ${isRotaOpen ? "rotate-180" : ""}`} />
                                </Button>
                              </CollapsibleTrigger>
                            </div>
                          </div>

                          {/* Corpo da Rota */}
                          <CollapsibleContent>
                            <div className="p-2.5 border-t border-border/40 bg-background/40 space-y-3">
                              {rota.grupos.length === 0 ? (
                                <div className="px-2 py-2 text-[11px] text-muted-foreground/70 italic">Nenhum aluno alocado nesta rota para este dia.</div>
                              ) : (
                                rota.grupos.map((grupo, gIndex) => (
                                  <div key={gIndex} className="space-y-1.5">
                                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground px-1">
                                      <School className="size-2.5" />
                                      <span>{grupo.escola}</span>
                                      <span className="text-border">•</span>
                                      <span>{grupo.turno}</span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                      {grupo.alunos.map((aluno) => {
                                        const fotoUrl = aluno.foto || aluno.foto_url || aluno.avatar_url;

                                        return (
                                          <div
                                            key={aluno.id}
                                            onClick={() => navigate(`/alunos/${aluno.id}`)}
                                            className="flex items-center justify-between p-2 rounded-md bg-card/80 border border-border/40 hover:border-border transition-all cursor-pointer group"
                                          >
                                            <div className="flex items-center gap-2 min-w-0">
                                              <Avatar className="size-5 shrink-0 border border-border/50">
                                                <AvatarImage src={fotoUrl ?? undefined} alt={aluno.nome} />
                                                <AvatarFallback className="text-[8px] bg-primary/10 text-primary font-medium">{getIniciais(aluno.nome)}</AvatarFallback>
                                              </Avatar>
                                              <div className="min-w-0">
                                                <p className="text-[11px] font-medium truncate group-hover:text-primary transition-colors text-foreground">{aluno.nome}</p>
                                              </div>
                                            </div>

                                            {aluno.horarioTrajeto && (
                                              <div className="flex items-center gap-1 text-[10px] text-muted-foreground shrink-0 bg-muted/50 px-1.5 py-0.5 rounded">
                                                <Clock className="size-2.5 text-muted-foreground/70" />
                                                <span>{aluno.horarioTrajeto}</span>
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      )}
    </div>
  );
}