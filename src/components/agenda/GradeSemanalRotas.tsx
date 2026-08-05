// src/components/alunos/GradeSemanalRotas.tsx

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
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

import type { Rota } from "@/types/rota";
import { AgendamentoRotaItem } from "@/types";

export type TipoTrajeto = "ENTRADA" | "SAIDA";

export interface DiaSemanaOption {
  readonly label: string;
  readonly value: number;
}

export const DIAS_SEMANA: readonly DiaSemanaOption[] = [
  { label: "Segunda-feira", value: 1 },
  { label: "Terça-feira", value: 2 },
  { label: "Quarta-feira", value: 3 },
  { label: "Quinta-feira", value: 4 },
  { label: "Sexta-feira", value: 5 },
] as const;

type AgendamentoKey = `${number}_${TipoTrajeto}`;

function normalizarTipoTrajeto(tipo: string): TipoTrajeto {
  const normalizado = String(tipo).toUpperCase();

  if (normalizado === "IDA" || normalizado === "ENTRADA") {
    return "ENTRADA";
  }

  if (
    normalizado === "VOLTA" ||
    normalizado === "SAIDA" ||
    normalizado === "RETORNO"
  ) {
    return "SAIDA";
  }

  return "ENTRADA";
}

interface GradeSemanalProps {
  alunoId: string;
  nomeRotaPrincipal?: string;
}

export function GradeSemanalRotas({
  alunoId,
  nomeRotaPrincipal,
}: GradeSemanalProps) {
  const [rotasDisponiveis, setRotasDisponiveis] =
    useState<Rota[]>([]);

  const [agendamentos, setAgendamentos] = useState<
    Record<string, AgendamentoRotaItem>
  >({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const popularMapaAgendamentos = (
    agendamentosData: AgendamentoRotaItem[]
  ): Record<string, AgendamentoRotaItem> => {
    const mapa: Record<string, AgendamentoRotaItem> = {};

    if (Array.isArray(agendamentosData)) {
      agendamentosData.forEach((item) => {
        const tipoNormalizado = normalizarTipoTrajeto(
          item.tipo_trajeto
        );

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

        const [rotasRes, agendamentosData] =
          await Promise.all([
            rotasService.listar
              ? rotasService.listar()
              : rotasService.getAll(),
            agendamentoRotasService.getByAlunoId(alunoId),
          ]);

        setRotasDisponiveis(
          Array.isArray(rotasRes) ? rotasRes : []
        );

        setAgendamentos(
          popularMapaAgendamentos(agendamentosData)
        );
      } catch (error) {
        console.error(
          "Erro ao carregar dados da grade:",
          error
        );

        toast.error(
          "Erro ao carregar grade de transporte do aluno."
        );
      } finally {
        setLoading(false);
      }
    }

    if (alunoId) {
      carregarDados();
    }
  }, [alunoId]);

  function handleRotaChange(
    dia: number,
    tipo: TipoTrajeto,
    rotaId: string
  ) {
    const key: AgendamentoKey = `${dia}_${tipo}`;

    if (!rotaId || rotaId === "none") {
      setAgendamentos((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });

      return;
    }

    const rotaSelecionada = rotasDisponiveis.find(
      (rota) => rota.id === rotaId
    );

    const horarioPadrao =
      tipo === "ENTRADA"
        ? rotaSelecionada?.horario_saida?.slice(0, 5) ?? "07:00"
        : rotaSelecionada?.horario_retorno?.slice(0, 5) ?? "12:00";

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

  function handleHorarioChange(
    dia: number,
    tipo: TipoTrajeto,
    horario: string
  ) {
    const key: AgendamentoKey = `${dia}_${tipo}`;

    if (!agendamentos[key]) return;

    setAgendamentos((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        horario,
      },
    }));
  }

  async function handleSalvar() {
    try {
      setSaving(true);

      const listaAgendamentos = Object.values(
        agendamentos
      ).map((item) => ({
        rota_id: item.rota_id,
        dia_semana: item.dia_semana,
        tipo_trajeto: item.tipo_trajeto,
        horario: item.horario,
      }));

      const response =
        await agendamentoRotasService.syncAgendamentos(
          alunoId,
          {
            agendamentos: listaAgendamentos,
          }
        );
              const dadosAtualizados = Array.isArray(response)
        ? response
        : [];

      if (dadosAtualizados.length > 0) {
        setAgendamentos(
          popularMapaAgendamentos(dadosAtualizados)
        );
      }

      toast.success(
        "Grade semanal de transportes salva com sucesso!"
      );
    } catch (error) {
      console.error(
        "Erro ao salvar agendamentos:",
        error
      );

      toast.error(
        "Erro ao salvar agendamentos."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Skeleton className="h-96 w-full rounded-xl" />
    );
  }

  return (
    <div className="space-y-6">
      <SectionCard
        title="Grade Semanal de Transportes"
        description="Configure a rota e o horário de entrada e saída para cada dia da semana"
        action={
          <div className="w-full sm:w-auto">
            <Button
              onClick={handleSalvar}
              disabled={saving}
              className="w-full sm:w-auto rounded-xl"
            >
              <Save className="mr-2 h-4 w-4" />
              {saving
                ? "Salvando..."
                : "Salvar Grade"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {DIAS_SEMANA.map((dia) => {
            const keyEntrada: AgendamentoKey =
              `${dia.value}_ENTRADA`;

            const keySaida: AgendamentoKey =
              `${dia.value}_SAIDA`;

            return (
              <div
                key={dia.value}
                className="
                  rounded-xl
                  border
                  bg-card
                  shadow-sm
                  p-3
                  sm:p-4
                  space-y-4
                "
              >
                <div className="border-b border-border pb-2">
                  <h3 className="text-sm sm:text-base font-semibold">
                    {dia.label}
                  </h3>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

                  {/* ENTRADA */}

                  <div className="flex flex-col gap-3 rounded-xl border border-border/50 bg-muted/30 p-3">

                    <span className="self-start rounded-md bg-primary/10 px-3 py-1 text-xs font-semibold text-primary whitespace-nowrap">
                      Entrada
                    </span>

                    <div className="flex flex-col sm:flex-row gap-2 w-full">

                      <Select
                        value={
                          agendamentos[keyEntrada]?.rota_id ||
                          "none"
                        }
                        onValueChange={(valor) =>
                          handleRotaChange(
                            dia.value,
                            "ENTRADA",
                            valor
                          )
                        }
                      >
                        <SelectTrigger className="w-full min-w-0 rounded-xl bg-card">
                          <SelectValue placeholder="Selecione a rota..." />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="none">
                            Nenhuma rota
                          </SelectItem>

                          {rotasDisponiveis.map((rota) => (
                            <SelectItem
                              key={rota.id}
                              value={rota.id}
                            >
                              <span className="truncate">
                                {rota.nome}
                                {rota.bairro
                                  ? ` (${rota.bairro})`
                                  : ""}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {agendamentos[keyEntrada] && (
                        <Input
                          type="time"
                          className="w-full sm:w-28 rounded-xl bg-card"
                          value={
                            agendamentos[keyEntrada]
                              .horario || "07:00"
                          }
                          onChange={(e) =>
                            handleHorarioChange(
                              dia.value,
                              "ENTRADA",
                              e.target.value
                            )
                          }
                        />
                      )}
                    </div>
                  </div>
                                    {/* SAÍDA */}

                  <div className="flex flex-col gap-3 rounded-xl border border-border/50 bg-muted/30 p-3">

                    <span className="self-start rounded-md bg-accent/20 px-3 py-1 text-xs font-semibold text-accent-foreground whitespace-nowrap">
                      Saída
                    </span>

                    <div className="flex flex-col sm:flex-row gap-2 w-full">

                      <Select
                        value={
                          agendamentos[keySaida]?.rota_id ||
                          "none"
                        }
                        onValueChange={(valor) =>
                          handleRotaChange(
                            dia.value,
                            "SAIDA",
                            valor
                          )
                        }
                      >
                        <SelectTrigger className="w-full min-w-0 rounded-xl bg-card">
                          <SelectValue placeholder="Selecione a rota..." />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="none">
                            Nenhuma rota
                          </SelectItem>

                          {rotasDisponiveis.map((rota) => (
                            <SelectItem
                              key={rota.id}
                              value={rota.id}
                            >
                              <span className="truncate">
                                {rota.nome}
                                {rota.bairro
                                  ? ` (${rota.bairro})`
                                  : ""}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {agendamentos[keySaida] && (
                        <Input
                          type="time"
                          className="w-full sm:w-28 rounded-xl bg-card"
                          value={
                            agendamentos[keySaida]
                              .horario || "12:00"
                          }
                          onChange={(e) =>
                            handleHorarioChange(
                              dia.value,
                              "SAIDA",
                              e.target.value
                            )
                          }
                        />
                      )}
                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}