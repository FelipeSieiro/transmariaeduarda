// src/components/alunos/AlunoHistorico.tsx
import { useMemo } from "react";
import { 
  CalendarDays, 
  Clock,
  FileText, 
  UserPlus, 
  History, 
  DollarSign, 
  AlertTriangle,
  UserCheck,
  type LucideIcon
} from "lucide-react";

import { SectionCard } from "@/components/ui-kit/primitives";
import type { EventoHistorico } from "@/types";

interface AlunoHistoricoProps {
  readonly historico?: readonly EventoHistorico[];
}

interface EstiloTipoEvento {
  readonly icon: LucideIcon;
  readonly bg: string;
}

// Mapeamento de ícones e estilos visuais por tipo de evento
const ICONES_TIPO: Record<string, EstiloTipoEvento> = {
  contrato: { icon: FileText, bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
  responsavel: { icon: UserPlus, bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
  cadastro: { icon: UserCheck, bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" },
  pagamento: { icon: DollarSign, bg: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" },
  ocorrencia: { icon: AlertTriangle, bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
  sistema: { icon: History, bg: "bg-muted text-muted-foreground border-border" },
};

// Obtém o timestamp exato para ordenação decrescente (mais recente primeiro)
function obterTimestamp(item: EventoHistorico): number {
  if (item.created_at) {
    const t = new Date(item.created_at).getTime();
    if (!isNaN(t)) return t;
  }
  
  if (item.data) {
    if (item.data.includes("-")) {
      const t = new Date(item.data).getTime();
      if (!isNaN(t)) return t;
    }

    const partesData = item.data.split("/");
    if (partesData.length === 3) {
      const [dia, mes, ano] = partesData.map(Number);
      let hora = 0;
      let min = 0;
      if (item.hora) {
        const partesHora = item.hora.split(":");
        hora = Number(partesHora[0]) || 0;
        min = Number(partesHora[1]) || 0;
      }
      return new Date(ano, mes - 1, dia, hora, min).getTime();
    }
  }

  return 0;
}

function formatarDataHoraExibicao(item: EventoHistorico): { dataStr: string; horaStr?: string } {
  if (item.data) {
    return { dataStr: item.data, horaStr: item.hora };
  }

  if (item.created_at) {
    try {
      const data = new Date(item.created_at);
      if (!isNaN(data.getTime())) {
        const dataStr = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(data);
        const horaStr = new Intl.DateTimeFormat("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "UTC",
        }).format(data);
        return { dataStr, horaStr };
      }
    } catch {
      // Ignora erro e usa fallback
    }
  }

  return { dataStr: "-" };
}

export function AlunoHistorico({ historico = [] }: AlunoHistoricoProps) {
  // Ordena garantindo os mais recentes no topo sem mutar o array recebido
  const historicoOrdenado = useMemo(() => {
    return [...historico].sort((a, b) => obterTimestamp(b) - obterTimestamp(a));
  }, [historico]);

  if (historicoOrdenado.length === 0) {
    return (
      <SectionCard
        title="Linha do tempo"
        description="Eventos do relacionamento com a empresa"
      >
        <p className="py-6 text-center text-sm text-muted-foreground">
          Nenhum histórico ou evento registrado para este aluno até o momento.
        </p>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Linha do tempo"
      description="Histórico de alterações, contratos, responsáveis e atividades"
    >
      <div className="relative border-l-2 border-border/70 ml-4 pl-6 space-y-4 py-1">
        {historicoOrdenado.map((h, index) => {
          const config = (h.tipo && ICONES_TIPO[h.tipo]) || ICONES_TIPO.sistema;
          const IconComponent = config.icon;
          const { dataStr, horaStr } = formatarDataHoraExibicao(h);

          return (
            <div key={h.id || `${h.data || "evt"}-${index}`} className="relative group">
              {/* Ícone alinhado à linha do tempo */}
              <div 
                className={`absolute -left-[37px] top-3.5 grid size-7 place-items-center rounded-full border shadow-sm transition-transform group-hover:scale-105 ${config.bg}`}
              >
                <IconComponent className="size-3.5" />
              </div>

              {/* Card de Evento */}
              <div className="flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4 shadow-sm transition-colors hover:border-border">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground tracking-tight">
                      {h.titulo}
                    </p>
                    
                    {/* Badge de Data e Hora */}
                    <div className="inline-flex shrink-0 items-center gap-2 rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="size-3 text-muted-foreground/70" />
                        {dataStr}
                      </span>
                      {horaStr && (
                        <>
                          <span className="text-border">•</span>
                          <span className="flex items-center gap-1 font-mono text-foreground/80">
                            <Clock className="size-3 text-muted-foreground/70" />
                            {horaStr}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {h.descricao ? (
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {h.descricao}
                    </p>
                  ) : (
                    <p className="text-xs italic text-muted-foreground/60">
                      Sem detalhes adicionais registrados.
                    </p>
                  )}
                </div>

                {h.usuario && (
                  <div className="mt-3 pt-2 border-t border-border/40 text-[11px] font-medium text-muted-foreground/80 flex justify-between items-center">
                    <span>Registrado por:</span>
                    <span className="text-foreground">{h.usuario}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}