// src/pages/NovoVeiculo.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Bus, Save, Loader2 } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";

import { veiculosService, type Veiculo } from "@/services/veiculos.service";

export default function NovoVeiculo() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
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
          setLoading(true);
          const veiculo = await veiculosService.getById(id!);
          if (veiculo) {
            setFormData(veiculo);
          }
        } catch (error) {
          console.error("Erro ao carregar veículo", error);
          toast.error("Erro ao carregar dados do veículo");
          navigate("/veiculos");
        } finally {
          setLoading(false);
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

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/veiculos")}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="inline-flex p-2 rounded-xl bg-primary/10 text-primary">
              <Bus className="size-5" />
            </div>
            <div className="space-y-0.5">
              <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                {isEditing ? "Editar Veículo" : "Novo Veículo"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isEditing
                  ? "Atualize as informações do veículo cadastrado"
                  : "Preencha os dados abaixo para cadastrar um novo veículo"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionCard
          title="Dados do Veículo"
          description="Informações principais de identificação, marca e capacidade"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="placa" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Placa *
              </Label>
              <Input
                id="placa"
                placeholder="ABC-1234"
                value={formData.placa || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, placa: e.target.value }))
                }
                className="rounded-xl h-10 font-mono uppercase"
                disabled={salvando}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="modelo" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Modelo *
              </Label>
              <Input
                id="modelo"
                placeholder="Ex: Mercedes Sprinter"
                value={formData.modelo || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, modelo: e.target.value }))
                }
                className="rounded-xl h-10"
                disabled={salvando}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="marca" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Marca
              </Label>
              <Input
                id="marca"
                placeholder="Ex: Mercedes-Benz"
                value={formData.marca || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, marca: e.target.value }))
                }
                className="rounded-xl h-10"
                disabled={salvando}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="capacidade" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Capacidade (Passageiros)
              </Label>
              <Input
                id="capacidade"
                type="number"
                placeholder="Ex: 15"
                value={formData.capacidade ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    capacidade: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
                className="rounded-xl h-10"
                disabled={salvando}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ano" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Ano Fabricação
              </Label>
              <Input
                id="ano"
                type="number"
                placeholder="Ex: 2022"
                value={formData.ano ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    ano: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
                className="rounded-xl h-10"
                disabled={salvando}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="status" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </Label>
              <Select
                value={formData.status || "ativo"}
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, status: val }))
                }
                disabled={salvando}
              >
                <SelectTrigger id="status" className="rounded-xl h-10">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="manutencao">Em Manutenção</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => navigate("/veiculos")}
              disabled={salvando}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={salvando} className="rounded-xl px-6">
              {salvando ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="size-4 mr-2" />
                  {isEditing ? "Salvar Alterações" : "Cadastrar Veículo"}
                </>
              )}
            </Button>
          </div>
        </SectionCard>
      </form>
    </div>
  );
}