// src/components/alunos/GradeSemanalRotas.tsx
import { useEffect, useState } from "react";
import { Bus, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionCard } from "@/components/ui-kit/primitives";
import { Skeleton } from "@/components/ui/skeleton";

import { rotasService } from "@/services/rotas.service";
import { agendamentoRotasService } from "@/services/agendamento-rotas.service";
import { Rota } from "@/types/rota";
import { AgendamentoRotaItem } from "@/types/agendamento";

const DIAS_SEMANA = [
  { label: "Segunda-feira", value: 1 },
  { label: "Terça-feira", value: 2 },
  { label: "Quarta-feira", value: 3 },
  { label: "Quinta-feira", value: 4 },
  { label: "Sexta-feira", value: 5 },
];

// Utilitário para normalizar o tipo de trajeto vindo do banco/API para o padrão da UI
function normalizarTipoTrajeto(tipo: string): "ENTRADA" | "SAIDA" {
  const normalizado = String(tipo).toUpperCase();
  if (normalizado === "IDA" || normalizado === "ENTRADA") return "ENTRADA";
  if (normalizado === "VOLTA" || normalizado === "SAIDA" || normalizado === "RETORNO") return "SAIDA";
  return "ENTRADA";
}

interface GradeSemanalProps {
  alunoId: string;
  nomeRotaPrincipal?: string;
}

export function GradeSemanalRotas({ alunoId, nomeRotaPrincipal }: GradeSemanalProps) {
  const [rotasDisponiveis, setRotasDisponiveis] = useState<Rota[]>([]);
  const [agendamentos, setAgendamentos] = useState<Record<string, AgendamentoRotaItem>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Mapeia array de agendamentos vindo do backend para o Record<string, AgendamentoRotaItem>
  const popularMapaAgendamentos = (agendamentosData: AgendamentoRotaItem[]) => {
    const mapa: Record<string, AgendamentoRotaItem> = {};
    if (Array.isArray(agendamentosData)) {
      agendamentosData.forEach((item) => {
        const tipoNormalizado = normalizarTipoTrajeto(item.tipo_trajeto);
        mapa[`${item.dia_semana}_${tipoNormalizado}`] = {
          ...item,
          tipo_trajeto: tipoNormalizado,
        };
      });
    }
    return mapa;
  };

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);

        const [rotasRes, agendamentosData] = await Promise.all([
          rotasService.getAll ? rotasService.getAll() : [],
          agendamentoRotasService.getByAlunoId(alunoId),
        ]);

        let listaRotas: Rota[] = [];
        if (Array.isArray(rotasRes)) {
          listaRotas = rotasRes;
        } else if (rotasRes && typeof rotasRes === "object") {
          listaRotas = (rotasRes as any).data || (rotasRes as any).resultado || [];
        }

        setRotasDisponiveis(listaRotas);
        setAgendamentos(popularMapaAgendamentos(agendamentosData));
      } catch (error) {
        console.error("Erro ao carregar dados da grade:", error);
        toast.error("Erro ao carregar grade de transporte do aluno.");
      } finally {
        setLoading(false);
      }
    }

    if (alunoId) carregarDados();
  }, [alunoId]);

  function handleRotaChange(
    dia: number,
    tipo: "ENTRADA" | "SAIDA",
    rotaId: string
  ) {
    const key = `${dia}_${tipo}`;

    if (!rotaId || rotaId === "none") {
      setAgendamentos((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
      return;
    }

    const rotaSelecionada = rotasDisponiveis.find((r) => r.id === rotaId);
    const horarioPadrao =
      tipo === "ENTRADA"
        ? rotaSelecionada?.horario_saida?.slice(0, 5) || "07:00"
        : rotaSelecionada?.horario_retorno?.slice(0, 5) || "12:00";

    setAgendamentos((prev) => ({
      ...prev,
      [key]: {
        dia_semana: dia,
        tipo_trajeto: tipo,
        rota_id: rotaId,
        horario: prev[key]?.horario || horarioPadrao,
      },
    }));
  }

  function handleHorarioChange(dia: number, tipo: "ENTRADA" | "SAIDA", horario: string) {
    const key = `${dia}_${tipo}`;
    if (!agendamentos[key]) return;

    setAgendamentos((prev) => ({
      ...prev,
      [key]: { ...prev[key], horario },
    }));
  }

  async function handleSalvar() {
    try {
      setSaving(true);
      const listaAgendamentos = Object.values(agendamentos).map((item) => ({
        rota_id: item.rota_id,
        dia_semana: item.dia_semana,
        tipo_trajeto: item.tipo_trajeto,
        horario: item.horario,
      }));

      const response = await agendamentoRotasService.syncAgendamentos(alunoId, {
        agendamentos: listaAgendamentos,
      });

      // Atualiza o estado com a resposta tratada do backend para sincronizar ids e tipos
      const dadosAtualizados = Array.isArray(response)
        ? response
        : (response as any)?.data || [];
      
      if (dadosAtualizados.length > 0) {
        setAgendamentos(popularMapaAgendamentos(dadosAtualizados));
      }

      toast.success("Grade semanal de transportes salva com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar agendamentos.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <Skeleton className="h-96 w-full rounded-xl" />;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <Bus className="size-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Rota Principal Atribuída (Cadastro)
            </h4>
            <p className="text-base font-semibold text-foreground mt-0.5">
              {nomeRotaPrincipal && nomeRotaPrincipal !== "-" ? (
                nomeRotaPrincipal
              ) : (
                <span className="text-amber-600 font-normal text-sm">
                  Nenhuma rota principal definida no cadastro geral do aluno
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      <SectionCard
        title="Grade Semanal de Transportes"
        description="Configure a rota e o horário de entrada e saída para cada dia da semana"
        action={
          <Button onClick={handleSalvar} disabled={saving} className="rounded-xl">
            <Save className="mr-2 size-4" />
            {saving ? "Salvando..." : "Salvar Grade"}
          </Button>
        }
      >
        <div className="space-y-4">
          {DIAS_SEMANA.map((dia) => (
            <div
              key={dia.value}
              className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between bg-card"
            >
              <div className="w-36 font-semibold text-sm">{dia.label}</div>

              {/* Trajeto ENTRADA */}
              <div className="flex flex-1 items-center gap-2">
                <span className="text-xs font-semibold px-2 py-1 rounded bg-emerald-500/10 text-emerald-600">
                  Entrada
                </span>
                <Select
                  value={agendamentos[`${dia.value}_ENTRADA`]?.rota_id || "none"}
                  onValueChange={(val) => handleRotaChange(dia.value, "ENTRADA", val)}
                >
                  <SelectTrigger className="w-full rounded-xl">
                    <SelectValue placeholder="Selecione a rota..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma rota</SelectItem>
                    {rotasDisponiveis.map((rota) => (
                      <SelectItem key={rota.id} value={rota.id}>
                        {rota.nome} {rota.bairro ? `(${rota.bairro})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {agendamentos[`${dia.value}_ENTRADA`] && (
                  <Input
                    type="time"
                    className="w-28 rounded-xl"
                    value={agendamentos[`${dia.value}_ENTRADA`].horario || "07:00"}
                    onChange={(e) =>
                      handleHorarioChange(dia.value, "ENTRADA", e.target.value)
                    }
                  />
                )}
              </div>

              {/* Trajeto SAÍDA */}
              <div className="flex flex-1 items-center gap-2">
                <span className="text-xs font-semibold px-2 py-1 rounded bg-amber-500/10 text-amber-600">
                  Saída
                </span>
                <Select
                  value={agendamentos[`${dia.value}_SAIDA`]?.rota_id || "none"}
                  onValueChange={(val) => handleRotaChange(dia.value, "SAIDA", val)}
                >
                  <SelectTrigger className="w-full rounded-xl">
                    <SelectValue placeholder="Selecione a rota..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma rota</SelectItem>
                    {rotasDisponiveis.map((rota) => (
                      <SelectItem key={rota.id} value={rota.id}>
                        {rota.nome} {rota.bairro ? `(${rota.bairro})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {agendamentos[`${dia.value}_SAIDA`] && (
                  <Input
                    type="time"
                    className="w-28 rounded-xl"
                    value={agendamentos[`${dia.value}_SAIDA`].horario || "12:00"}
                    onChange={(e) =>
                      handleHorarioChange(dia.value, "SAIDA", e.target.value)
                    }
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}