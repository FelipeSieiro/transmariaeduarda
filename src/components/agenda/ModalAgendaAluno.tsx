import { useState, useEffect } from "react";
import { X, Save, Plus, Trash2, Clock, Bus } from "lucide-react";
import { AgendamentosService } from "@/services/agendamentos.service";
import { ItemAgendamento, TipoTrajeto } from "@/types/agendamento";

interface Props {
  alunoId: string;
  alunoNome: string;
  isOpen: boolean;
  onClose: () => void;
  rotasDisponiveis: { id: string; nome: string }[];
}

const DIAS = [
  { id: 1, label: "Segunda-feira" },
  { id: 2, label: "Terça-feira" },
  { id: 3, label: "Quarta-feira" },
  { id: 4, label: "Quinta-feira" },
  { id: 5, label: "Sexta-feira" },
  { id: 6, label: "Sábado" },
];

export function ModalAgendaAluno({ alunoId, alunoNome, isOpen, onClose, rotasDisponiveis }: Props) {
  const [agendamentos, setAgendamentos] = useState<ItemAgendamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Carregar a grade existente do aluno
  useEffect(() => {
    if (!isOpen || !alunoId) return;

    async function loadAgenda() {
      try {
        setLoading(true);
        const data = await AgendamentosService.getAgendaPorAluno(alunoId);
        setAgendamentos(data);
      } catch (err) {
        console.error("Erro ao carregar agenda:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAgenda();
  }, [isOpen, alunoId]);

  // Adicionar um novo horário na grade
  const handleAddHorario = (dia_semana: number, tipo_trajeto: TipoTrajeto) => {
    const defaultRota = rotasDisponiveis[0]?.id || "";
    setAgendamentos((prev) => [
      ...prev,
      {
        aluno_id: alunoId,
        rota_id: defaultRota,
        dia_semana,
        tipo_trajeto,
        horario: tipo_trajeto === "ida" ? "07:00" : "12:00",
      },
    ]);
  };

  // Atualizar campo de um item
  const handleUpdateItem = (index: number, field: keyof ItemAgendamento, value: any) => {
    setAgendamentos((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Remover um horário da grade
  const handleRemoveItem = (index: number) => {
    setAgendamentos((prev) => prev.filter((_, i) => i !== index));
  };

  // Salvar tudo no backend
  const handleSave = async () => {
    try {
      setSaving(true);
      await AgendamentosService.sincronizarAgenda(alunoId, agendamentos);
      onClose();
    } catch (err) {
      console.error("Erro ao salvar agenda:", err);
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
            <p className="text-xs text-slate-400">Aluno: <span className="text-blue-400 font-medium">{alunoNome}</span></p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body - Tabela por Dia da Semana */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {loading ? (
            <div className="text-center py-8 text-slate-400">Carregando horários...</div>
          ) : (
            DIAS.map((dia) => {
              const agendamentosDia = agendamentos
                .map((item, originalIndex) => ({ ...item, originalIndex }))
                .filter((item) => item.dia_semana === dia.id);

              return (
                <div key={dia.id} className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      {dia.label}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddHorario(dia.id, "ida")}
                        className="text-xs px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md hover:bg-emerald-500/20 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> + Ida (Entrada)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddHorario(dia.id, "volta")}
                        className="text-xs px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md hover:bg-amber-500/20 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> + Volta (Saída)
                      </button>
                    </div>
                  </div>

                  {agendamentosDia.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">Nenhum transporte configurado para este dia.</p>
                  ) : (
                    <div className="space-y-2">
                      {agendamentosDia.map((item) => (
                        <div key={item.originalIndex} className="flex items-center gap-3 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                          {/* Badge Tipo */}
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                            item.tipo_trajeto === "ida" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                          }`}>
                            {item.tipo_trajeto}
                          </span>

                          {/* Seletor Rota */}
                          <div className="flex-1 flex items-center gap-1.5">
                            <Bus className="w-3.5 h-3.5 text-slate-400" />
                            <select
                              value={item.rota_id}
                              onChange={(e) => handleUpdateItem(item.originalIndex, "rota_id", e.target.value)}
                              className="w-full bg-slate-800 border border-slate-700 text-xs rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-blue-500"
                            >
                              {rotasDisponiveis.map((r) => (
                                <option key={r.id} value={r.id}>{r.nome}</option>
                              ))}
                            </select>
                          </div>

                          {/* Input Horário */}
                          <div className="flex items-center gap-1.5 w-32">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <input
                              type="time"
                              value={item.horario}
                              onChange={(e) => handleUpdateItem(item.originalIndex, "horario", e.target.value)}
                              className="bg-slate-800 border border-slate-700 text-xs rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-blue-500 w-full"
                            />
                          </div>

                          {/* Botão Remover */}
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.originalIndex)}
                            className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-slate-300 text-sm font-medium rounded-xl hover:bg-slate-700"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/20"
          >
            <Save className="w-4 h-4" />
            {saving ? "Salvando..." : "Salvar Horários"}
          </button>
        </div>
      </div>
    </div>
  );
}