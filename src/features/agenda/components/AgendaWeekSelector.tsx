import { format, addWeeks, subWeeks, startOfWeek, addDays, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AgendaWeekSelectorProps {
  dataAtual: Date;
  diaSelecionado: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onDiaSelecionado: (dia: Date) => void;
}

export function AgendaWeekSelector({
  dataAtual,
  diaSelecionado,
  onPreviousWeek,
  onNextWeek,
  onDiaSelecionado,
}: AgendaWeekSelectorProps) {
  const inicioDaSemana = startOfWeek(dataAtual, { weekStartsOn: 1 });
  const fimDaSemana = addDays(inicioDaSemana, 5);
  const diasDaSemana = Array.from({ length: 6 }).map((_, i) => addDays(inicioDaSemana, i));

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousWeek}
          className="h-8 rounded-lg"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <div className="px-4">
          <h2 className="text-sm font-semibold">
            {format(inicioDaSemana, "dd")} a {format(fimDaSemana, "dd 'de' MMMM", { locale: ptBR })}
          </h2>
          <p className="text-xs text-muted-foreground">
            {format(inicioDaSemana, "MMMM yyyy", { locale: ptBR })}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onNextWeek}
          className="h-8 rounded-lg"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="flex gap-1">
        {diasDaSemana.map((dia, index) => {
          const isSelected = isSameDay(dia, diaSelecionado);
          return (
            <button
              key={dia.toISOString()}
              onClick={() => onDiaSelecionado(dia)}
              className={`text-center min-w-[40px] px-2 py-1 rounded-lg transition-colors ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/30 hover:bg-muted/50"
              }`}
            >
              <div className="text-[10px] uppercase opacity-80">
                {format(dia, "EEE", { locale: ptBR })}
              </div>
              <div className="text-sm font-medium">
                {format(dia, "dd")}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
