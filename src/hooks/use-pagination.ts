import { useMemo, useState } from "react";

import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";

interface UsePaginationResult<T> {
  page: number;
  totalPages: number;
  items: readonly T[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  reset: () => void;
}

// Paginação client-side compartilhada pelas listagens.
export function usePagination<T>(
  data: readonly T[],
  pageSize: number = DEFAULT_PAGE_SIZE,
): UsePaginationResult<T> {
  const [requestedPage, setRequestedPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const page = Math.min(requestedPage, totalPages);

  const items = useMemo(
    () => data.slice((page - 1) * pageSize, page * pageSize),
    [data, page, pageSize],
  );

  return {
    page,
    totalPages,
    items,
    goToPage: (destino: number) =>
      setRequestedPage(Math.min(Math.max(1, destino), totalPages)),
    nextPage: () => setRequestedPage(Math.min(totalPages, page + 1)),
    previousPage: () => setRequestedPage(Math.max(1, page - 1)),
    reset: () => setRequestedPage(1),
  };
}
