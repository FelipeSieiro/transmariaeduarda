import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Rota } from "@/features/rotas/types/rota";

interface AgendaFiltersProps {
  busca: string;
  onBuscaChange: (value: string) => void;
  rotaFiltro: string;
  onRotaFiltroChange: (value: string) => void;
  turnoFiltro: string;
  onTurnoFiltroChange: (value: string) => void;
  rotas: readonly Rota[];
  onClear: () => void;
  hasActiveFilters: boolean;
}

const TURNOS = [
  { value: "Manhã", label: "Manhã" },
  { value: "Tarde", label: "Tarde" },
  { value: "Noite", label: "Noite" },
];

export function AgendaFilters({
  busca,
  onBuscaChange,
  rotaFiltro,
  onRotaFiltroChange,
  turnoFiltro,
  onTurnoFiltroChange,
  rotas,
  onClear,
  hasActiveFilters,
}: AgendaFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground/70" />
        <Input
          value={busca}
          onChange={(e) => onBuscaChange(e.target.value)}
          placeholder="Buscar por nome ou matrícula..."
          className="pl-9 h-9 text-xs rounded-lg bg-background/50 border-border/60"
        />
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <Select value={rotaFiltro} onValueChange={onRotaFiltroChange}>
          <SelectTrigger className="w-full sm:w-[180px] h-9 text-xs rounded-lg bg-background/50 border-border/60">
            <SelectValue placeholder="Todas as rotas" />
          </SelectTrigger>
          <SelectContent className="rounded-xl text-xs">
            <SelectItem value="__todos__">Todas as rotas</SelectItem>
            {rotas.map((rota) => (
              <SelectItem key={rota.id} value={rota.id}>
                {rota.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={turnoFiltro} onValueChange={onTurnoFiltroChange}>
          <SelectTrigger className="w-full sm:w-[140px] h-9 text-xs rounded-lg bg-background/50 border-border/60">
            <SelectValue placeholder="Todos os turnos" />
          </SelectTrigger>
          <SelectContent className="rounded-xl text-xs">
            <SelectItem value="__todos__">Todos os turnos</SelectItem>
            {TURNOS.map((turno) => (
              <SelectItem key={turno.value} value={turno.value}>
                {turno.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Filter className="size-3.5 mr-1.5 opacity-70" />
            Limpar
          </Button>
        )}
      </div>
    </div>
  );
}
