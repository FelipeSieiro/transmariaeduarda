import { useMemo, useRef, useState } from "react";

import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { matchesSearch } from "@/utils/format-text";

interface UseListControlsOptions<T, S extends string> {
  // Campos considerados na busca textual de cada item.
  searchFields: (item: T) => readonly (string | null | undefined)[];
  // Comparadores de ordenação disponíveis, indexados pela chave de ordem.
  sorters: Record<S, (a: T, b: T) => number>;
  // Chave de ordenação inicial.
  initialSort: S;
  pageSize?: number;
}

interface UseListControlsResult<T, S extends string> {
  search: string;
  setSearch: (termo: string) => void;
  sort: S;
  setSort: (ordem: S) => void;
  // Itens após busca e ordenação (todos, sem paginar).
  filtered: readonly T[];
  // Itens da página atual.
  visible: readonly T[];
  page: number;
  totalPages: number;
  nextPage: () => void;
  previousPage: () => void;
  clear: () => void;
  hasActiveFilters: boolean;
}

// Reúne busca, ordenação e paginação — o trio repetido em todas as listagens.
// Filtros específicos de cada tela devem ser aplicados em `data` antes de entrar aqui.
export function useListControls<T, S extends string>(
  data: readonly T[],
  {
    searchFields,
    sorters,
    initialSort,
    pageSize = DEFAULT_PAGE_SIZE,
  }: UseListControlsOptions<T, S>,
): UseListControlsResult<T, S> {
  const [search, setSearchTerm] = useState("");
  const [sort, setSort] = useState<S>(initialSort);

  // As funções são recriadas a cada render pelas páginas, mas o comportamento é
  // estável — guardá-las em refs mantém a memoização dependente apenas dos dados.
  const searchFieldsRef = useRef(searchFields);
  searchFieldsRef.current = searchFields;

  const sortersRef = useRef(sorters);
  sortersRef.current = sorters;

  const filtered = useMemo(
    () =>
      data
        .filter((item) => matchesSearch(search, searchFieldsRef.current(item)))
        .slice()
        .sort(sortersRef.current[sort]),
    [data, search, sort],
  );

  const pagination = usePagination(filtered, pageSize);

  return {
    search,
    setSearch: (termo: string) => {
      setSearchTerm(termo);
      pagination.reset();
    },
    sort,
    setSort,
    filtered,
    visible: pagination.items,
    page: pagination.page,
    totalPages: pagination.totalPages,
    nextPage: pagination.nextPage,
    previousPage: pagination.previousPage,
    clear: () => {
      setSearchTerm("");
      pagination.reset();
    },
    hasActiveFilters: Boolean(search) || pagination.page > 1,
  };
}
