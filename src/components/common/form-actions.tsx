import { Loader2, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

interface FormActionsProps {
  submitting: boolean;
  submitLabel: string;
  cancelTo: string;
}

// Rodapé padrão dos formulários: cancelar (volta) e salvar (com estado de envio).
export function FormActions({
  submitting,
  submitLabel,
  cancelTo,
}: FormActionsProps) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end gap-3 border-t border-border/60 pt-6">
      <Button
        type="button"
        variant="outline"
        className="rounded-xl"
        onClick={() => navigate(cancelTo)}
        disabled={submitting}
      >
        Cancelar
      </Button>

      <Button type="submit" className="rounded-xl px-6" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Salvando...
          </>
        ) : (
          <>
            <Save className="mr-2 size-4" />
            {submitLabel}
          </>
        )}
      </Button>
    </div>
  );
}
