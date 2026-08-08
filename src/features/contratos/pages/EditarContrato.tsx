import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

import { SectionCard } from "@/components/ui-kit/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROUTES } from "@/constants/routes";
import { contratosService } from "@/features/contratos/services/contratos.service";
import { alunosService } from "@/features/alunos/services/alunos.service";
import type { Contrato } from "@/features/contratos/types/contrato";

import { FORMAS_PAGAMENTO } from "@/constants";

export default function EditarContrato() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [alunos, setAlunos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    aluno_id: "",
    numero: "",
    valor_mensalidade: "",
    dia_vencimento: "",
    data_inicio: "",
    data_fim: "",
    status: "ativo",
    observacoes: "",
    forma_pagamento: "mensal",
  });

  useEffect(() => {
    async function carregarDados() {
      if (!id) return;

      try {
        setLoading(true);
        const [contrato, listaAlunos] = await Promise.all([
          contratosService.getById(id),
          alunosService.getAll(),
        ]);

        setAlunos(listaAlunos || []);

        if (contrato) {
          setForm({
            aluno_id: contrato.aluno_id || "",
            numero: contrato.numero || "",
            valor_mensalidade: contrato.valor_mensalidade ? String(contrato.valor_mensalidade) : "",
            dia_vencimento: contrato.dia_vencimento ? String(contrato.dia_vencimento) : "",
            data_inicio: contrato.data_inicio ? contrato.data_inicio.split("T")[0] ?? "" : "",
            data_fim: contrato.data_fim ? contrato.data_fim.split("T")[0] ?? "" : "",
            status: contrato.status?.toLowerCase() || "ativo",
            observacoes: contrato.observacoes || "",
            forma_pagamento: contrato.forma_pagamento || "mensal",
          });
        }
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar dados do contrato");
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [id]);

  function alterar(campo: string, valor: string) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  async function salvar() {
    if (!form.aluno_id) {
      toast.error("Selecione um aluno");
      return;
    }

    if (!form.numero) {
      toast.error("Informe o número do contrato");
      return;
    }

    if (!id) return;

    try {
      setSaving(true);
      const payload = {
        aluno_id: form.aluno_id,
        numero: form.numero.trim(),
        valor_mensalidade: form.valor_mensalidade ? parseFloat(form.valor_mensalidade) : 0,
        dia_vencimento: form.dia_vencimento ? parseInt(form.dia_vencimento, 10) : 10,
        data_inicio: form.data_inicio || "",
        data_fim: form.data_fim || null,
        status: form.status.toLowerCase(),
        observacoes: form.observacoes.trim() || "",
        forma_pagamento: form.forma_pagamento || "mensal",
      };

      await contratosService.update(id, payload);
      toast.success("Contrato atualizado com sucesso");
      navigate(ROUTES.CONTRATOS);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar contrato");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(ROUTES.CONTRATOS)}
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Editar Contrato</h1>
          <p className="text-sm text-muted-foreground">
            Atualize as informações do contrato
          </p>
        </div>
      </div>

      <SectionCard title="Dados do Contrato">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Aluno *</Label>
            <Select
              value={form.aluno_id}
              onValueChange={(value) => alterar("aluno_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o aluno" />
              </SelectTrigger>
              <SelectContent>
                {alunos.map((aluno) => (
                  <SelectItem key={aluno.id} value={aluno.id}>
                    {aluno.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Número do contrato *</Label>
            <Input
              value={form.numero}
              onChange={(e) => alterar("numero", e.target.value)}
              placeholder="CTR-12345"
            />
          </div>

          <div className="space-y-2">
            <Label>Valor da mensalidade *</Label>
            <Input
              type="number"
              step="0.01"
              value={form.valor_mensalidade}
              onChange={(e) => alterar("valor_mensalidade", e.target.value)}
              placeholder="0,00"
            />
          </div>

          <div className="space-y-2">
            <Label>Dia de vencimento *</Label>
            <Input
              type="number"
              min="1"
              max="31"
              value={form.dia_vencimento}
              onChange={(e) => alterar("dia_vencimento", e.target.value)}
              placeholder="10"
            />
          </div>

          <div className="space-y-2">
            <Label>Data de início</Label>
            <Input
              type="date"
              value={form.data_inicio}
              onChange={(e) => alterar("data_inicio", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Data de fim</Label>
            <Input
              type="date"
              value={form.data_fim}
              onChange={(e) => alterar("data_fim", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(value) => alterar("status", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Forma de pagamento</Label>
            <Select
              value={form.forma_pagamento}
              onValueChange={(value) => alterar("forma_pagamento", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FORMAS_PAGAMENTO.map((forma) => (
                  <SelectItem key={forma} value={forma}>
                    {forma}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <Label>Observações</Label>
          <Textarea
            value={form.observacoes}
            onChange={(e) => alterar("observacoes", e.target.value)}
            placeholder="Observações adicionais..."
            rows={3}
          />
        </div>
      </SectionCard>

      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => navigate(ROUTES.CONTRATOS)}
          disabled={saving}
        >
          Cancelar
        </Button>
        <Button onClick={salvar} disabled={saving}>
          <Save className="mr-2 size-4" />
          {saving ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </div>
  );
}
