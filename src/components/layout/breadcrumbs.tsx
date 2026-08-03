import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const labels: Record<string, string> = {
  alunos: "Alunos",
  responsaveis: "Responsáveis",
  contratos: "Contratos",
  financeiro: "Financeiro",
  agenda: "Agenda",
  rotas: "Rotas",
  motoristas: "Motoristas",
  veiculos: "Veículos",
  patrimonio: "Patrimônio",
  abastecimentos: "Abastecimentos",
  manutencoes: "Manutenções",
  despesas: "Despesas",
  relatorios: "Relatórios",
  configuracoes: "Configurações",
};

export function Breadcrumbs({ trailing }: { trailing?: string }) {
  const location = useLocation();
  const pathname = location.pathname;
  const parts = pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Trilha de navegação" className="flex min-w-0 items-center gap-1 text-xs">
      <Link to="/" className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground">
        <Home className="size-3.5" />
        <span className="hidden sm:inline">Início</span>
      </Link>
      {parts.map((part, i) => {
        const last = i === parts.length - 1;
        const label = labels[part] ?? (last && trailing ? trailing : decodeURIComponent(part));
        return (
          <span key={part + i} className="flex min-w-0 items-center gap-1">
            <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/50" />
            {last ? (
              <span className="truncate font-medium text-foreground">{trailing ?? label}</span>
            ) : (
              <Link
                to={"/" + parts.slice(0, i + 1).join("/")}
                className="truncate text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
