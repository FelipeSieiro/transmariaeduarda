import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Bus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { SectionCard, StatusPill } from "@/components/ui-kit/primitives";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { rotasService } from "@/services/rotas.service";
import type { Rota } from "@/types/rota";

export default function RotaDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [rota, setRota] = useState<Rota | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function carregar() {
      try {
        setLoading(true);
        const dados = await rotasService.getById(id!);
        setRota(dados);
      } catch (error) {
        console.error("Erro ao buscar detalhes da rota", error);
        toast.error("Rota não encontrada ou erro ao carregar");
        navigate("/rotas");
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, [id, navigate]);

  async function handleExcluir() {
    if (!id || !window.confirm("Tem certeza que deseja excluir esta rota?")) {
      return;
    }

    try {
      await rotasService.delete(id);
      toast.success("Rota excluída com sucesso");
      navigate("/rotas");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir rota");
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  if (!rota) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl"
            onClick={() => navigate("/rotas")}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Bus className="size-5" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-semibold">{rota.nome}</h1>
              <p className="text-sm text-muted-foreground">ID: {rota.id}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => navigate(`/rotas/${rota.id}/editar`)}
          >
            <Edit className="size-4 mr-2" />
            Editar
          </Button>
          <Button
            variant="destructive"
            className="rounded-xl"
            onClick={handleExcluir}
          >
            <Trash2 className="size-4 mr-2" />
            Excluir
          </Button>
        </div>
      </header>

      {/* Card Principal */}
      <SectionCard title="Informações da Rota" description="Visão geral do cadastro">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-1">
            <span className="text-xs font-medium uppercase text-muted-foreground">
              Nome da Rota
            </span>
            <p className="text-base font-medium">{rota.nome}</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium uppercase text-muted-foreground">
              Status
            </span>
            <div>
              <StatusPill status={rota.status ?? "ativo"} />
            </div>
          </div>

          <div className="md:col-span-2 space-y-1">
            <span className="text-xs font-medium uppercase text-muted-foreground">
              Descrição
            </span>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {rota.descricao || "Nenhuma descrição informada."}
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}