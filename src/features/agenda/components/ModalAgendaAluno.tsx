// src/components/alunos/ModalAgendaAluno.tsx

import { useEffect, useState } from "react";
import { X, Save, Plus, Trash2, Clock, Bus, Sparkles, Loader2 } from "lucide-react";
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

import { agendamentoRotasService } from "@/features/agenda/services/agendamento-rotas.service";
import type { ItemAgendamento, TipoTrajeto } from "@/types";

export interface OptionRota {
  readonly id: string;
  readonly nome: string;
}

interface ModalAgendaAlunoProps {
  alunoId: string;
  alunoNome: string;
  isOpen: boolean;
  onClose: () => void;
  rotasDisponiveis: readonly OptionRota[];
}

export interface DiaOpcao {
  readonly id: number;
  readonly label: string;
}

export const DIAS_SEMANA_MODAL: readonly DiaOpcao[] = [
  { id: 1, label: "Segunda-feira" },
  { id: 2, label: "Terça-feira" },
  { id: 3, label: "Quarta-feira" },
  { id: 4, label: "Quinta-feira" },
  { id: 5, label: "Sexta-feira" },
  { id: 6, label: "Sábado" },
] as const;

export function ModalAgendaAluno({
  alunoId,
  alunoNome,
  isOpen,
  onClose,
  rotasDisponiveis,
}: ModalAgendaAlunoProps) {
  const [agendamentos, setAgendamentos] = useState<ItemAgendamento[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen || !alunoId) return;

    async function loadAgenda() {
      try {
        setLoading(true);
        const data = await agendamentoRotasService.getByAlunoId(alunoId);
        setAgendamentos(data ?? []);
      } catch (err) {
        console.error("Erro ao carregar agenda:", err);
        toast.error("Erro ao carregar a grade de transporte do aluno.");
      } finally {
        setLoading(false);
      }
    }

    loadAgenda();
  }, [isOpen, alunoId]);

  const handleAddHorario = (dia_semana: number, tipo_trajeto: TipoTrajeto) => {
    const defaultRota = rotasDisponiveis[0]?.id || "";
    setAgendamentos((prev) => [
      ...prev,
      {
        aluno_id: alunoId,
        rota_id: defaultRota,
        dia_semana,
        tipo_trajeto,
        horario: tipo_trajeto === "ida" || tipo_trajeto === "ENTRADA" ? "07:00" : "12:00",
      },
    ]);
  };

  const handleUpdateItem = <K extends keyof ItemAgendamento>(
    index: number,
    field: K,
    value: ItemAgendamento[K]
  ) => {
    setAgendamentos((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveItem = (index: number) => {
    setAgendamentos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await agendamentoRotasService.syncAgendamentos(alunoId, {
        agendamentos: agendamentos.map((item) => ({
          rota_id: item.rota_id,
          dia_semana: item.dia_semana,
          tipo_trajeto: item.tipo_trajeto,
          horario: item.horario,
        })),
      });
      toast.success("Grade semanal salva com sucesso!");
      onClose();
    } catch (err) {
      console.error("Erro ao salvar agenda:", err);
      toast.error("Não foi possível salvar os horários da grade.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card border border-border/80 w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Modernizado */}
        <div className="flex flex-col gap-2 p-6 border-b border-border/60 bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CalendarDays className="size-4" />
              </span>
              <h2 className="text-xl font-bold tracking-tight text-foreground">Grade Semanal de Transporte</h2>
            </div>
            <p className="text-xs text-muted-foreground pl-10">
              Configurando rotas e horários para: <span className="font-semibold text-foreground">{alunoNome}</span>
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-xl h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
              <Loader2 className="size-6 animate-spin text-primary" />
              <p className="text-sm font-medium">Carregando grade de horários...</p>
            </div>
          ) : (
            DIAS_SEMANA_MODAL.map((dia) => {
              const agendamentosDia = agendamentos
                .map((item, originalIndex) => ({ ...item, originalIndex }))
                .filter((item) => item.dia_semana === dia.id);

              return (
                <div key={dia.id} className="bg-muted/20 border border-border/60 rounded-2xl p-5 transition-all hover:bg-muted/40">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-foreground text-sm flex items-center gap-2.5">
                      <span className="size-2.5 rounded-full bg-primary shadow-sm shadow-primary/50" />
                      {dia.label}
                    </h3>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddHorario(dia.id, "ida")}
                        className="h-8 text-xs font-semibold bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20 rounded-xl"
                      >
                        <Plus className="size-3.5 mr-1" /> Ida (Entrada)
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddHorario(dia.id, "volta")}
                        className="h-8 text-xs font-semibold bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20 rounded-xl"
                      >
                        <Plus className="size-3.5 mr-1" /> Volta (Saída)
                      </Button>
                    </div>
                  </div>

                  {agendamentosDia.length === 0 ? (
                    <p className="text-xs text-muted-foreground/70 italic py-2">
                      Nenhum transporte configurado para este dia da semana.
                    </p>
                  ) : (
                    <div className="space-y-2.5">
                      {agendamentosDia.map((item) => (
                        <div
                          key={item.originalIndex}
                          className="flex flex-col sm:flex-row items-center gap-3 bg-card p-3 rounded-xl border border-border/80 shadow-xs"
                        >
                          <span
                            className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-lg w-full sm:w-auto text-center ${
                              item.tipo_trajeto === "ida" || item.tipo_trajeto === "ENTRADA"
                                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                            }`}
                          >
                            {item.tipo_trajeto}
                          </span>

                          <div className="flex-1 w-full flex items-center gap-2">
                            <Bus className="size-4 text-muted-foreground shrink-0" />
                            <Select
                              value={item.rota_id}
                              onValueChange={(val) =>
                                handleUpdateItem(item.originalIndex, "rota_id", val)
                              }
                            >
                              <SelectTrigger className="h-10 bg-muted/40 border-border/80 text-xs rounded-xl">
                                <SelectValue placeholder="Selecione a rota" />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-border/80 bg-card">
                                {rotasDisponiveis.map((r) => (
                                  <SelectItem key={r.id} value={r.id}>
                                    {r.nome}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex w-full sm:w-36 items-center gap-2">
                            <Clock className="size-4 text-muted-foreground shrink-0" />
                            <Input
                              type="time"
                              value={item.horario || ""}
                              onChange={(e) =>
                                handleUpdateItem(item.originalIndex, "horario", e.target.value)
                              }
                              className="h-10 w-full bg-muted/40 border-border/80 text-xs rounded-xl"
                            />
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.originalIndex)}
                            className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors h-10 w-10 rounded-xl shrink-0 self-end sm:self-center"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Moderno */}
        <div className="p-5 border-t border-border/60 bg-muted/30 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="rounded-xl h-11 px-6 font-semibold border-border/80">
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl h-11 px-6 font-bold shadow-lg shadow-primary/25"
          >
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="size-4 mr-2" />
                Salvar Grade
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}