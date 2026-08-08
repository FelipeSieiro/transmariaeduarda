import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Route as RouteIcon } from "lucide-react";
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
import { rotasService } from "@/features/rotas/services/rotas.service";
import { motoristasService } from "@/features/motoristas/services/motoristas.service";
import type { Motorista } from "@/features/motoristas/types/motorista";
import { veiculosService } from "@/features/veiculos/services/veiculos.service";
import type { Veiculo } from "@/features/veiculos/types/veiculos";
import { listarEscolas } from "@/services/escolas.service";
import type { Escola } from "@/features/escolas/types/escola";

export default function EditarRota() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    bairro: "",
    horario_saida: "",
    horario_retorno: "",
    motorista_id: "",
    veiculo_id: "",
    status: "ativa",
    descricao: "",
  });

  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [escolas, setEscolas] = useState<Escola[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      if (!id) return;

      try {
        setLoading(true);
        const [rota, listaMotoristas, listaVeiculos, listaEscolas] =
          await Promise.all([
            rotasService.getById(id),
            motoristasService.getAll().catch(() => []),
            veiculosService.getAll().catch(() => []),
            listarEscolas().catch(() => []),
          ]);

        setMotoristas(listaMotoristas || []);
        setVeiculos(listaVeiculos || []);
        setEscolas(listaEscolas || []);

        if (rota) {
          setForm({
            nome: rota.nome || "",
            bairro: rota.bairro || "",
            horario_saida: rota.horario_saida ? rota.horario_saida.slice(0, 5) : "",
            horario_retorno: rota.horario_retorno ? rota.horario_retorno.slice(0, 5) : "",
            motorista_id: rota.motorista_id || "",
            veiculo_id: rota.veiculo_id || "",
            status: rota.status?.toLowerCase() || "ativa",
            descricao: rota.descricao || "",
          });
        }
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar dados da rota");
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
    if (!form.nome.trim()) {
      toast.error("Informe o nome da rota");
      return;
    }

    if (!id) return;

    try {
      setSaving(true);

      const payload = {
        nome: form.nome.trim(),
        bairro: form.bairro.trim() || null,
        horario_saida: form.horario_saida.trim() ? `${form.horario_saida}:00` : null,
        horario_retorno: form.horario_retorno.trim() ? `${form.horario_retorno}:00` : null,
        motorista_id: form.motorista_id || null,
        veiculo_id: form.veiculo_id || null,
        status: form.status.toUpperCase(),
        descricao: form.descricao.trim() || null,
      };

      await rotasService.update(id, payload);
      toast.success("Rota atualizada com sucesso");
      navigate(ROUTES.ROTAS);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar rota");
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
          onClick={() => navigate(ROUTES.ROTAS)}
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="inline-flex p-2 rounded-xl bg-primary/10 text-primary">
            <RouteIcon className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Editar Rota</h1>
            <p className="text-sm text-muted-foreground">
              Atualize as informações da rota
            </p>
          </div>
        </div>
      </div>

      <SectionCard title="Dados da Rota">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>Nome *</Label>
            <Input
              value={form.nome}
              onChange={(e) => alterar("nome", e.target.value)}
              placeholder="Nome da rota"
            />
          </div>

          <div className="space-y-2">
            <Label>Bairro</Label>
            <Input
              value={form.bairro}
              onChange={(e) => alterar("bairro", e.target.value)}
              placeholder="Bairro atendido"
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
                <SelectItem value="ativa">Ativa</SelectItem>
                <SelectItem value="inativa">Inativa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Horário de saída</Label>
            <Input
              type="time"
              value={form.horario_saida}
              onChange={(e) => alterar("horario_saida", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Horário de retorno</Label>
            <Input
              type="time"
              value={form.horario_retorno}
              onChange={(e) => alterar("horario_retorno", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Motorista</Label>
            <Select
              value={form.motorista_id}
              onValueChange={(value) => alterar("motorista_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o motorista" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Sem motorista</SelectItem>
                {motoristas.map((motorista) => (
                  <SelectItem key={motorista.id} value={motorista.id}>
                    {motorista.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Veículo</Label>
            <Select
              value={form.veiculo_id}
              onValueChange={(value) => alterar("veiculo_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o veículo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Sem veículo</SelectItem>
                {veiculos.map((veiculo) => (
                  <SelectItem key={veiculo.id} value={veiculo.id}>
                    {veiculo.modelo} - {veiculo.placa}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <Label>Descrição</Label>
          <Textarea
            value={form.descricao}
            onChange={(e) => alterar("descricao", e.target.value)}
            placeholder="Descrição da rota..."
            rows={3}
          />
        </div>
      </SectionCard>

      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => navigate(ROUTES.ROTAS)}
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
