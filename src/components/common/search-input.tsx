import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (valor: string) => void;
  placeholder?: string;
  className?: string;
}

// Campo de busca das listagens.
export function SearchInput({
  value,
  onChange,
  placeholder = "Pesquisar…",
  className,
}: SearchInputProps) {
  return (
    <div className={cn("relative w-full sm:max-w-xs", className)}>
      <Search className="pointer-events-none absolute left-3 top-2.5 size-3.5 text-muted-foreground/70" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-9 rounded-lg border-border/60 bg-background/50 pl-9 text-xs"
      />
    </div>
  );
}
