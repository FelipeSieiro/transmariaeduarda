import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Bus, Save } from "lucide-react";
import { toast } from "sonner";

import { SectionCard } from "@/components/ui-kit/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { veiculosService, type Veiculo } from "@/services/veiculos.service";

export default function NovoVeiculo() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [salvando, setSalvando] = useState(false);
  const [formData, setFormData] = useState<Partial<Veiculo>>({
    placa: "",
    modelo: "",
    marca: "",
    ano: undefined,
    capacidade: undefined,
    status: "ativo",
  });

  useEffect(() => {
    if (isEditing && id) {
      async function carregar() {
        try {
          const veiculo = await veiculosService.getById(id!);
          if (veiculo) {
            setFormData(veiculo);
          }
        } catch (error) {
          console.error("Erro ao carregar veículo", error);
          toast.error("Erro ao carregar dados do veículo");
          navigate("/veiculos");
        }
      }
      carregar();
    }
  }, [id, isEditing, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.placa || !formData.modelo) {
      toast.error("Placa e Modelo são campos obrigatórios");
      return;
    }

    setSalvando(true);

    const payload = {
      ...formData,
      placa: formData.placa.toUpperCase().trim(),
      capacidade: formData.capacidade ? Number(formData.capacidade) : null,
      ano: formData.ano ? Number(formData.ano) : null,
    };

    try {
      if (isEditing && id) {
        await veiculosService.update(id, payload);
        toast.success("Veículo atualizado com sucesso!");
      } else {
        await veiculosService.create(payload);
        toast.success("Veículo cadastrado com sucesso!");
      }
      navigate("/veiculos");
    } catch (error: any) {
      console.error("Erro ao salvar veículo:", error.response?.data);
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Erro ao salvar veículo";
      toast.error(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1000px] space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="rounded-xl"
          onClick={() => navigate("/veiculos")}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="font-display text-2xl font-semibold">
            {isEditing ? "Editar Veículo" : "Novo Veículo"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditing
              ? "Atualize as informações do veículo cadastrado"
              : "Preencha os dados abaixo para cadastrar um novo veículo"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionCard
          title="Dados do Veículo"
          description="Informações principais de identificação"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="placa">Placa *</Label>
              <Input
                id="placa"
                placeholder="ABC-1234"
                value={formData.placa || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, placa: e.target.value }))
                }
                className="rounded-xl font-mono uppercase"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="modelo">Modelo *</Label>
              <Input
                id="modelo"
                placeholder="Ex: Mercedes Sprinter"
                value={formData.modelo || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, modelo: e.target.value }))
                }
                className="rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="marca">Marca</Label>
              <Input
                id="marca"
                placeholder="Ex: Mercedes-Benz"
                value={formData.marca || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, marca: e.target.value }))
                }
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacidade">Capacidade (Passageiros)</Label>
              <Input
                id="capacidade"
                type="number"
                placeholder="Ex: 15"
                value={formData.capacidade ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, capacidade: e.target.value ? Number(e.target.value) : undefined }))
                }
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ano">Ano Fabricação</Label>
              <Input
                id="ano"
                type="number"
                placeholder="Ex: 2022"
                value={formData.ano ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, ano: e.target.value ? Number(e.target.value) : undefined }))
                }
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status || "ativo"}
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, status: val }))
                }
              >
                <SelectTrigger id="status" className="rounded-xl">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="manutencao">Em Manutenção</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </SectionCard>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() => navigate("/veiculos")}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={salvando} className="rounded-xl">
            <Save className="size-4 mr-2" />
            {salvando ? "Salvando..." : isEditing ? "Atualizar" : "Salvar Veículo"}
          </Button>
        </div>
      </form>
    </div>
  );
}