// src/components/alunos/ModalAgendaAluno.tsx
import { useEffect, useState } from "react";
import { X, Save, Plus, Trash2, Clock, Bus } from "lucide-react";
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

import { agendamentoRotasService } from "@/services/agendamento-rotas.service";
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
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/50">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Grade Semanal de Transporte</h2>
            <p className="text-xs text-slate-400">
              Aluno: <span className="text-blue-400 font-medium">{alunoNome}</span>
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {loading ? (
            <div className="text-center py-8 text-slate-400">Carregando horários...</div>
          ) : (
            DIAS_SEMANA_MODAL.map((dia) => {
              const agendamentosDia = agendamentos
                .map((item, originalIndex) => ({ ...item, originalIndex }))
                .filter((item) => item.dia_semana === dia.id);

              return (
                <div key={dia.id} className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      {dia.label}
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddHorario(dia.id, "ida")}
                        className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                      >
                        <Plus className="w-3 h-3 mr-1" /> + Ida (Entrada)
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddHorario(dia.id, "volta")}
                        className="text-xs bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
                      >
                        <Plus className="w-3 h-3 mr-1" /> + Volta (Saída)
                      </Button>
                    </div>
                  </div>

                  {agendamentosDia.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">
                      Nenhum transporte configurado para este dia.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {agendamentosDia.map((item) => (
                        <div
                          key={item.originalIndex}
                          className="flex items-center gap-3 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800"
                        >
                          <span
                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                              item.tipo_trajeto === "ida" || item.tipo_trajeto === "ENTRADA"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-amber-500/20 text-amber-400"
                            }`}
                          >
                            {item.tipo_trajeto}
                          </span>

                          <div className="flex-1 flex items-center gap-1.5">
                            <Bus className="w-3.5 h-3.5 text-slate-400" />
                            <Select
                              value={item.rota_id}
                              onValueChange={(val) =>
                                handleUpdateItem(item.originalIndex, "rota_id", val)
                              }
                            >
                              <SelectTrigger className="h-8 bg-slate-800 border-slate-700 text-xs text-slate-200">
                                <SelectValue placeholder="Selecione a rota" />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                                {rotasDisponiveis.map((r) => (
                                  <SelectItem key={r.id} value={r.id}>
                                    {r.nome}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-center gap-1.5 w-32">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <Input
                              type="time"
                              value={item.horario || ""}
                              onChange={(e) =>
                                handleUpdateItem(item.originalIndex, "horario", e.target.value)
                              }
                              className="h-8 bg-slate-800 border-slate-700 text-xs text-slate-200"
                            />
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.originalIndex)}
                            className="text-slate-500 hover:text-red-400 transition-colors h-8 w-8"
                          >
                            <Trash2 className="w-4 h-4" />
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

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="rounded-xl">
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Salvando..." : "Salvar Horários"}
          </Button>
        </div>
      </div>
    </div>
  );
}