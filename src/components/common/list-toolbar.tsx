import type { ReactNode } from "react";
import { ArrowUpDown } from "lucide-react";

import { SearchInput } from "@/components/common/search-input";
import { Button } from "@/components/ui/button";

interface ListToolbarProps {
  search: string;
  onSearchChange: (valor: string) => void;
  searchPlaceholder: string;
  // Rótulo do botão de ordenação ("Ordenar por {sortLabel}").
  sortLabel?: string;
  onToggleSort?: () => void;
  showClear?: boolean;
  onClear?: () => void;
  // Filtros extras (selects) exibidos antes das ações.
  filters?: ReactNode;
}

// Barra de busca, filtros, ordenação e limpeza das listagens.
export function ListToolbar({
  search,
  onSearchChange,
  searchPlaceholder,
  sortLabel,
  onToggleSort,
  showClear = false,
  onClear,
  filters,
}: ListToolbarProps) {
  return (
    <div className="flex flex-col items-center justify-between gap-2.5 sm:flex-row">
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder={searchPlaceholder}
      />

      <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
        {filters}

        {sortLabel && onToggleSort && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSort}
            className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowUpDown className="mr-1.5 size-3.5 opacity-70" />
            Ordenar por {sortLabel}
          </Button>
        )}

        {showClear && onClear && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground"
          >
            Limpar
          </Button>
        )}
      </div>
    </div>
  );
}
