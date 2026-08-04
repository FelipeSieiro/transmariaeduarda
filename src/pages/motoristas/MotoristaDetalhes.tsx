// src/pages/MotoristaDetalhes.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit, IdCard, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { SectionCard, StatusPill } from "@/components/ui-kit/primitives";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { motoristasService, type Motorista } from "@/services/motoristas.service";

function Campo({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-medium text-foreground">{value || "—"}</p>
    </div>
  );
}

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
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  if (!motorista) return null;

  const salarioFormatado =
    motorista.salario !== null && motorista.salario !== undefined
      ? new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(Number(motorista.salario))
      : "—";

  const dataCadastroFormatada = motorista.created_at
    ? new Date(motorista.created_at).toLocaleDateString("pt-BR")
    : "—";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/motoristas")}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="inline-flex p-2 rounded-xl bg-primary/10 text-primary">
              <IdCard className="size-5" />
            </div>
            <div className="space-y-0.5">
              <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                {motorista.nome}
              </h1>
              <p className="text-xs text-muted-foreground font-mono">ID: {motorista.id}</p>
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
            className="rounded-xl shadow-none"
            onClick={handleExcluir}
          >
            <Trash2 className="size-4 mr-2" />
            Excluir
          </Button>
        </div>
      </header>

      <SectionCard
        title="Informações do Motorista"
        description="Visão geral dos dados cadastrais e profissionais"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Campo label="Nome Completo" value={motorista.nome} />

          <div className="space-y-0.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </p>
            <div className="pt-1">
              <StatusPill status={motorista.status ?? "ativo"} />
            </div>
          </div>

          <Campo label="CPF" value={motorista.cpf || "—"} />
          <Campo label="Telefone" value={motorista.telefone || "—"} />
          <Campo label="CNH" value={motorista.cnh || "—"} />
          <Campo label="Categoria CNH" value={motorista.categoria_cnh || "—"} />
          <Campo label="Salário" value={salarioFormatado} />
          <Campo label="Data de Cadastro" value={dataCadastroFormatada} />
        </div>
      </SectionCard>
    </div>
  );
}