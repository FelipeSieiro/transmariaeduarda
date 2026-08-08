import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { addWeeks, subWeeks, startOfWeek, addDays, getDay, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";

import { Button } from "@/components/ui/button";

import { listarAlunos, obterAgendamentosRotasDoAluno } from "@/features/alunos/services/alunos.service";
import { listarRotas } from "@/features/rotas/services/rotas.service";
import type { Aluno } from "@/features/alunos/types/alunos";
import type { Rota } from "@/features/rotas/types/rota";
import type { AgendamentoRota } from "@/features/agenda/types/agendamento";
import { AgendaWeekSelector } from "@/features/agenda/components/AgendaWeekSelector";
import { AgendaFilters } from "@/features/agenda/components/AgendaFilters";
import { AgendaMotoristaGroup } from "@/features/agenda/components/AgendaMotoristaGroup";
import {
  processarGruposPorMotorista,
  type GrupoMotorista,
} from "@/features/agenda/utils/agenda-helpers";

const TODOS = "__todos__";

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

        const res = await Promise.all(
          listaAlunos.map((a) => obterAgendamentosRotasDoAluno(a.id).catch(() => []))
        );
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
    const inicioNovaSemana = startOfWeek(nova, { weekStartsOn: 1 });
    setDiaSelecionado(inicioNovaSemana);
  };

  const selecionarDia = (dia: Date) => {
    setDiaSelecionado(dia);
  };

  const diaSemanaIndex = getDay(diaSelecionado);

  const gruposPorMotorista = useMemo(
    () =>
      processarGruposPorMotorista(
        rotas,
        alunos,
        agendamentos,
        busca,
        rotaFiltro,
        turnoFiltro,
        diaSemanaIndex
      ),
    [rotas, alunos, agendamentos, busca, rotaFiltro, turnoFiltro, diaSemanaIndex]
  );

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

  const limparFiltros = () => {
    setBusca("");
    setRotaFiltro(TODOS);
    setTurnoFiltro(TODOS);
  };

  const hasActiveFilters = Boolean(busca || rotaFiltro !== TODOS || turnoFiltro !== TODOS);

  const exportarPDF = () => {
    toast.success("Exportação iniciada");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="size-8 animate-spin mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Carregando agenda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 py-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Agenda por Rotas
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {format(diaSelecionado, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-lg text-xs"
            onClick={exportarPDF}
          >
            <Download className="mr-1.5 size-3.5 opacity-70" />
            Exportar
          </Button>
        </div>
      </div>

      <AgendaWeekSelector
        dataAtual={dataAtual}
        diaSelecionado={diaSelecionado}
        onPreviousWeek={() => mudarSemana("ant")}
        onNextWeek={() => mudarSemana("prox")}
        onDiaSelecionado={selecionarDia}
      />

      <AgendaFilters
        busca={busca}
        onBuscaChange={setBusca}
        rotaFiltro={rotaFiltro}
        onRotaFiltroChange={setRotaFiltro}
        turnoFiltro={turnoFiltro}
        onTurnoFiltroChange={setTurnoFiltro}
        rotas={rotas}
        onClear={limparFiltros}
        hasActiveFilters={hasActiveFilters}
      />

      <div className="space-y-4">
        {gruposPorMotorista.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground">
            Nenhum agendamento encontrado para os filtros selecionados.
          </div>
        ) : (
          gruposPorMotorista.map((grupo) => (
            <AgendaMotoristaGroup
              key={grupo.motorista}
              grupo={grupo}
              isOpen={motoristasAbertos[grupo.motorista] || false}
              onToggle={() => toggleMotorista(grupo.motorista)}
              rotasAbertas={rotasAbertas}
              onToggleRota={toggleRota}
              dataSelecionada={diaSelecionado}
            />
          ))
        )}
      </div>
    </div>
  );
}
