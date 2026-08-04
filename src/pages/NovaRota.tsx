import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { SectionCard } from "@/components/ui-kit/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import { rotasService } from "@/services/rotas.service";

export default function NovaRota() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [status, setStatus] = useState<string>("ativo");

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function carregarRota() {
      try {
        setLoading(true);
        const rota = await rotasService.getById(id!);
        if (rota) {
          setNome(rota.nome || "");
          setDescricao(rota.descricao || "");
          setStatus(rota.status || "ativo");
        }
      } catch (error) {
        console.error("Erro ao carregar rota", error);
        toast.error("Erro ao carregar dados da rota");
        navigate("/rotas");
      } finally {
        setLoading(false);
      }
    }

    carregarRota();
  }, [id, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!nome.trim()) {
      toast.error("Informe o nome da rota");
      return;
    }

    try {
      setSubmitting(true);
      const payload = { nome: nome.trim(), descricao: descricao.trim(), status };

      if (isEditing && id) {
        await rotasService.update(id, payload);
        toast.success("Rota atualizada com sucesso");
      } else {
        await rotasService.create(payload);
        toast.success("Rota cadastrada com sucesso");
      }

      navigate("/rotas");
    } catch (error) {
      console.error("Erro ao salvar rota", error);
      toast.error(isEditing ? "Erro ao atualizar rota" : "Erro ao cadastrar rota");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl"
            onClick={() => navigate("/rotas")}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="font-display text-2xl font-semibold">
              {isEditing ? "Editar Rota" : "Nova Rota"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isEditing
                ? "Atualize as informações da rota selecionada"
                : "Preencha os dados para cadastrar uma nova rota"}
            </p>
          </div>
        </div>
      </header>

      {/* Formulário */}
      <form onSubmit={handleSubmit}>
        <SectionCard
          title="Dados da Rota"
          description="Informações principais de identificação"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome da Rota *</label>
              <Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Rota 01 - Centro / Campus"
                className="rounded-xl"
                disabled={submitting}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={status}
                onValueChange={setStatus}
                disabled={submitting}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição</label>
              <Textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o trajeto, pontos de parada ou observações importantes..."
                className="rounded-xl min-h-[100px] resize-none"
                disabled={submitting}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => navigate("/rotas")}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="rounded-xl"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="size-4 mr-2" />
                    {isEditing ? "Salvar Alterações" : "Cadastrar Rota"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </SectionCard>
      </form>
    </div>
  );
}