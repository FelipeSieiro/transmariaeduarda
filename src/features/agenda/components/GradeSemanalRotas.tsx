import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SectionCard } from "@/components/ui-kit/primitives";
import { Skeleton } from "@/components/ui/skeleton";

import { rotasService } from "@/features/rotas/services/rotas.service";
import { agendamentoRotasService } from "@/features/agenda/services/agendamento-rotas.service";

import { DIAS_SEMANA_UTEIS } from "@/features/agenda/constants/agenda.constants";
import type { AgendamentoRota } from "@/features/agenda/types/agendamento";
import type { Rota } from "@/features/rotas/types/rota";
import type { DiaSemana, TipoTrajeto } from "@/types/transporte";

type AgendamentoKey = `${DiaSemana}_${TipoTrajeto}`;

function normalizarTipoTrajeto(tipo: string): TipoTrajeto {
  const t = String(tipo).toUpperCase();
  if (t === "IDA" || t === "ENTRADA") return "ENTRADA";
  return "SAIDA";
}

interface GradeSemanalProps {
  alunoId: string;
  nomeRotaPrincipal?: string;
}

export function GradeSemanalRotas({ alunoId }: GradeSemanalProps) {
  const [rotasDisponiveis, setRotasDisponiveis] = useState<Rota[]>([]);
  const [agendamentos, setAgendamentos] = useState<Record<string, AgendamentoRota>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const popularMapa = (data: AgendamentoRota[]): Record<string, AgendamentoRota> => {
    const mapa: Record<string, AgendamentoRota> = {};
    if (Array.isArray(data)) {
      data.forEach((item) => {
        const tipoNormalizado = normalizarTipoTrajeto(item.tipo_trajeto || "ENTRADA");
        const diaSemana = Number(item.dia_semana);
        mapa[`${diaSemana}_${tipoNormalizado}`] = {
          ...item,
          dia_semana: diaSemana,
          tipo_trajeto: tipoNormalizado,
          horario: item.horario || (tipoNormalizado === "ENTRADA" ? "07:00" : "12:00"),
        };
      });
    }
    return mapa;
  };

  useEffect(() => {
    if (!alunoId) return;
    async function carregarDados() {
      try {
        setLoading(true);
        const [rotasRes, agendamentosData] = await Promise.all([
          rotasService.listar ? rotasService.listar() : rotasService.getAll(),
          agendamentoRotasService.getByAlunoId(alunoId),
        ]);
        setRotasDisponiveis(Array.isArray(rotasRes) ? rotasRes : []);
        setAgendamentos(popularMapa(agendamentosData));
      } catch (error) {
        console.error("Erro ao carregar dados da grade:", error);
        toast.error("Erro ao carregar grade de transporte do aluno.");
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, [alunoId]);

  const handleRotaChange = (dia: DiaSemana, tipo: TipoTrajeto, rotaId: string) => {
    const key: AgendamentoKey = `${dia}_${tipo}`;
    if (!rotaId || rotaId === "none") {
      setAgendamentos((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
      return;
    }

    const rotaSel = rotasDisponiveis.find((r) => r.id === rotaId);
    const horarioPadrao = tipo === "ENTRADA" ? rotaSel?.horario_saida?.slice(0, 5) ?? "07:00" : rotaSel?.horario_retorno?.slice(0, 5) ?? "12:00";

    setAgendamentos((prev) => ({
      ...prev,
      [key]: { dia_semana: dia, tipo_trajeto: tipo, rota_id: rotaId, horario: prev[key]?.horario || horarioPadrao },
    }));
  };

  const handleHorarioChange = (dia: DiaSemana, tipo: TipoTrajeto, horario: string) => {
    const key: AgendamentoKey = `${dia}_${tipo}`;
    setAgendamentos((prev) => (prev[key] ? { ...prev, [key]: { ...prev[key], horario } } : prev));
  };

  const handleSalvar = async () => {
    try {
      setSaving(true);
      const lista = Object.values(agendamentos).map((item) => ({
        rota_id: item.rota_id,
        dia_semana: Number(item.dia_semana),
        tipo_trajeto: item.tipo_trajeto,
        horario: item.horario,
      }));

      const res = await agendamentoRotasService.syncAgendamentos(alunoId, { agendamentos: lista });
      const atualizados = Array.isArray(res) ? res : res?.data ?? [];
      if (atualizados.length > 0) setAgendamentos(popularMapa(atualizados));

      toast.success("Grade semanal de transportes salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar agendamentos:", error);
      toast.error("Erro ao salvar agendamentos.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Skeleton className="h-96 w-full rounded-xl" />;

  return (
    <div className="space-y-6">
      <SectionCard
        title="Grade Semanal de Transportes"
        description="Configure a rota e o horário de entrada e saída para cada dia da semana"
        action={
          <Button onClick={handleSalvar} disabled={saving} className="w-full sm:w-auto rounded-xl">
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Salvando..." : "Salvar Grade"}
          </Button>
        }
      >
        <div className="space-y-4">
          {DIAS_SEMANA_UTEIS.map((dia) => {
            const kEntrada: AgendamentoKey = `${dia.value}_ENTRADA`;
            const kSaida: AgendamentoKey = `${dia.value}_SAIDA`;

            return (
              <div key={dia.value} className="rounded-xl border bg-card shadow-sm p-3 sm:p-4 space-y-4">
                <div className="border-b border-border pb-2">
                  <h3 className="text-sm sm:text-base font-semibold">{dia.label}</h3>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {/* Bloco de Trajeto (Entrada / Saída) */}
                  {[
                    { tipo: "ENTRADA" as TipoTrajeto, key: kEntrada, label: "Entrada", bgBadge: "bg-primary/10 text-primary", defaultTime: "07:00" },
                    { tipo: "SAIDA" as TipoTrajeto, key: kSaida, label: "Saída", bgBadge: "bg-accent/20 text-accent-foreground", defaultTime: "12:00" },
                  ].map(({ tipo, key, label, bgBadge, defaultTime }) => (
                    <div key={tipo} className="flex flex-col gap-3 rounded-xl border border-border/50 bg-muted/30 p-3">
                      <span className={`self-start rounded-md px-3 py-1 text-xs font-semibold whitespace-nowrap ${bgBadge}`}>{label}</span>
                      <div className="flex flex-col sm:flex-row gap-2 w-full">
                        <Select
                          value={agendamentos[key]?.rota_id || "none"}
                          onValueChange={(val) => handleRotaChange(dia.value, tipo, val)}
                        >
                          <SelectTrigger className="w-full min-w-0 rounded-xl bg-card">
                            <SelectValue placeholder="Selecione a rota..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Nenhuma rota</SelectItem>
                            {rotasDisponiveis.map((rota) => (
                              <SelectItem key={rota.id} value={rota.id}>
                                <span className="truncate">{rota.nome}{rota.bairro ? ` (${rota.bairro})` : ""}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {agendamentos[key] && (
                          <Input
                            type="time"
                            className="w-full sm:w-28 rounded-xl bg-card"
                            value={agendamentos[key].horario || defaultTime}
                            onChange={(e) => handleHorarioChange(dia.value, tipo, e.target.value)}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}