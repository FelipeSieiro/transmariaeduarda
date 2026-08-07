import { Loader2 } from "lucide-react";

// Fallback exibido enquanto o chunk de uma página é carregado.
export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}
