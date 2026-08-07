import type { ReactNode } from "react";

interface FieldValueProps {
  label: string;
  value?: ReactNode;
}

// Par rótulo/valor das telas de detalhe.
export function FieldValue({ label, value }: FieldValueProps) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="text-sm font-medium text-foreground">{value || "—"}</div>
    </div>
  );
}
