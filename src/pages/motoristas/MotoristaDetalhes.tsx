import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit, IdCard, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { SectionCard, StatusPill } from "@/components/ui-kit/primitives";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { motoristasService, type Motorista } from "@/services/motoristas.service";

export default function MotoristaDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [motorista, setMotorista] = useState<Motorista | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function carregar() {
      try {
        setLoading(true);
        const dados = await motoristasService.getById(id!);
        setMotorista(dados);
      } catch (error) {
        console.error("Erro ao buscar detalhes do motorista", error);
        toast.error("Motorista não encontrado ou erro ao carregar");
        navigate("/motoristas");
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, [id, navigate]);

  async function handleExcluir() {
    if (!id || !window.confirm("Tem certeza que deseja excluir este motorista?")) {
      return;
    }

    try {
      await motoristasService.delete(id);
      toast.success("Motorista excluído com sucesso");
      navigate("/motoristas");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir motorista");
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

  if (!motorista) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl"
            onClick={() => navigate("/motoristas")}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <IdCard className="size-5" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-semibold">{motorista.nome}</h1>
              <p className="text-sm text-muted-foreground">ID: {motorista.id}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => navigate(`/motoristas/${motorista.id}/editar`)}
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

      {/* Card de Informações */}
      <SectionCard
        title="Informações do Motorista"
        description="Visão geral dos dados cadastrais e profissionais"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-1">
            <span className="text-xs font-medium uppercase text-muted-foreground">
              Nome Completo
            </span>
            <p className="text-base font-medium">{motorista.nome}</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium uppercase text-muted-foreground">
              Status
            </span>
            <div>
              <StatusPill status={motorista.status ?? "ativo"} />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium uppercase text-muted-foreground">
              CPF
            </span>
            <p className="text-sm text-muted-foreground">{motorista.cpf || "-"}</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium uppercase text-muted-foreground">
              Telefone
            </span>
            <p className="text-sm text-muted-foreground">{motorista.telefone || "-"}</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium uppercase text-muted-foreground">
              CNH
            </span>
            <p className="text-sm text-muted-foreground">{motorista.cnh || "-"}</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium uppercase text-muted-foreground">
              Categoria CNH
            </span>
            <p className="text-sm text-muted-foreground">
              {motorista.categoria_cnh || "-"}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium uppercase text-muted-foreground">
              Salário
            </span>
            <p className="text-sm text-muted-foreground">
              {motorista.salario !== null && motorista.salario !== undefined
                ? new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(motorista.salario))
                : "-"}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium uppercase text-muted-foreground">
              Data de Cadastro
            </span>
            <p className="text-sm text-muted-foreground">
              {motorista.created_at
                ? new Date(motorista.created_at).toLocaleDateString("pt-BR")
                : "-"}
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}