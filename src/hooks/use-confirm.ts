import { useCallback, useState } from "react";

interface UseConfirmResult<T> {
  // Item aguardando confirmação (null quando o diálogo está fechado).
  target: T | null;
  isOpen: boolean;
  // Abre o diálogo guardando o item alvo.
  request: (target: T) => void;
  // Fecha o diálogo sem executar a ação.
  cancel: () => void;
  // Fecha o diálogo e executa a ação com o item guardado.
  confirm: () => void;
  setOpen: (open: boolean) => void;
}

// Guarda o item alvo de uma ação destrutiva até o usuário confirmar.
export function useConfirm<T>(
  onConfirm: (target: T) => void,
): UseConfirmResult<T> {
  const [target, setTarget] = useState<T | null>(null);

  const cancel = useCallback(() => setTarget(null), []);

  const confirm = useCallback(() => {
    if (target !== null) onConfirm(target);
    setTarget(null);
  }, [onConfirm, target]);

  return {
    target,
    isOpen: target !== null,
    request: setTarget,
    cancel,
    confirm,
    setOpen: (open: boolean) => {
      if (!open) setTarget(null);
    },
  };
}
