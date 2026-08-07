import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface UseAsyncDataOptions<T> {
  // Valor inicial enquanto a primeira requisição não retorna.
  initialData: T;
  // Mensagem exibida via toast quando a requisição falha.
  errorMessage: string;
  // Quando false, a requisição não é disparada (ex.: id ainda indefinido).
  enabled?: boolean;
  // Executado após uma falha (ex.: navegar de volta para a listagem).
  onError?: (error: unknown) => void;
}

interface UseAsyncDataResult<T> {
  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;
  loading: boolean;
  reload: () => Promise<void>;
}

// Centraliza o padrão "carregar dados + loading + toast de erro" repetido nas páginas.
export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  {
    initialData,
    errorMessage,
    enabled = true,
    onError,
  }: UseAsyncDataOptions<T>,
): UseAsyncDataResult<T> {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(enabled);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setData(await fetcherRef.current());
    } catch (error) {
      console.error(errorMessage, error);
      toast.error(errorMessage);
      onErrorRef.current?.(error);
    } finally {
      setLoading(false);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    void load();
  }, [enabled, load]);

  return { data, setData, loading, reload: load };
}
