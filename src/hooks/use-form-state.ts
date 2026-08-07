import { useCallback, useRef, useState } from "react";

interface UseFormStateResult<T> {
  values: T;
  setField: <K extends keyof T>(campo: K, valor: T[K]) => void;
  setValues: React.Dispatch<React.SetStateAction<T>>;
  reset: () => void;
}

// Estado de formulário em um único objeto, no lugar de um useState por campo.
export function useFormState<T extends object>(
  initialValues: T,
): UseFormStateResult<T> {
  const initialRef = useRef(initialValues);
  const [values, setValues] = useState<T>(initialValues);

  const setField = useCallback(<K extends keyof T>(campo: K, valor: T[K]) => {
    setValues((atual) => ({ ...atual, [campo]: valor }));
  }, []);

  const reset = useCallback(() => setValues(initialRef.current), []);

  return { values, setField, setValues, reset };
}
