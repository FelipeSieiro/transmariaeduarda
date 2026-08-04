// src/pages/RotaDetalhes.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bus,
  Clock,
  Edit,
  MapPin,
  Trash2,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";

import { SectionCard, StatusPill } from "@/components/ui-kit/primitives";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { rotasService } from "@/services/rotas.service";
import { motoristasService } from "@/services/motoristas.service";
import { veiculosService } from "@/services/veiculos.service";
import type { Rota } from "@/types/rota";

export default function RotaDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [rota, setRota] = useState<Rota | null>(null);
  const [nomeMotorista, setNomeMotorista] = useState<string | null>(null);
  const [nomeVeiculo, setNomeVeiculo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function carregar() {
      try {
        setLoading(true);
        const dadosRota = await rotasService.getById(id!);

        if (!dadosRota) {
          toast.error("Rota não encontrada");
          navigate("/rotas");
          return;
        }

        setRota(dadosRota);

        if (dadosRota.motorista_id) {
          motoristasService
            .getById(dadosRota.motorista_id)
            .then((m: any) => setNomeMotorista(m?.nome || m?.data?.nome || null))
            .catch(() => setNomeMotorista(null));
        }

        if (dadosRota.veiculo_id) {
          veiculosService
            .getById(dadosRota.veiculo_id)
            .then((v: any) => {
              const veículo = v?.data || v;
              if (veículo) {
                setNomeVeiculo(`${veículo.modelo || "Veículo"} (${veículo.placa || ""})`);
              }
            })
            .catch(() => setNomeVeiculo(null));
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes da rota", error);
        toast.error("Erro ao carregar dados da rota");
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
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!rota) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/rotas")}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="inline-flex p-2 rounded-xl bg-primary/10 text-primary">
              <Bus className="size-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2.5">
                <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                  {rota.nome}
                </h1>
                <StatusPill status={rota.status ? rota.status.toLowerCase() : "ativa"} />
              </div>
              <p className="text-xs font-mono text-muted-foreground">
                ID: {rota.id}
              </p>
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

      <div className="grid gap-6 md:grid-cols-3">
        <SectionCard
          title="Informações da Rota"
          description="Visão geral e horários do trajeto"
          className="md:col-span-2"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Nome da Rota
              </span>
              <p className="text-base font-medium text-foreground">{rota.nome}</p>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Bairro / Região
              </span>
              <div className="flex items-center gap-2 font-medium text-foreground">
                <MapPin className="size-4 text-muted-foreground" />
                {rota.bairro || "Não informado"}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Horário de Saída
              </span>
              <div className="flex items-center gap-2 font-medium text-foreground">
                <Clock className="size-4 text-muted-foreground" />
                {rota.horario_saida ? rota.horario_saida.slice(0, 5) : "—"}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Horário de Retorno
              </span>
              <div className="flex items-center gap-2 font-medium text-foreground">
                <Clock className="size-4 text-muted-foreground" />
                {rota.horario_retorno ? rota.horario_retorno.slice(0, 5) : "—"}
              </div>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Descrição / Observações
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {rota.descricao || "Nenhuma descrição informada."}
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Alocações"
          description="Motorista e veículo designados"
        >
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="inline-flex p-2 rounded-xl bg-muted/60 text-muted-foreground mt-0.5">
                <UserCheck className="size-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Motorista
                </p>
                <p className="font-medium text-foreground">
                  {nomeMotorista || (rota.motorista_id ? "Carregando..." : "Sem motorista")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="inline-flex p-2 rounded-xl bg-muted/60 text-muted-foreground mt-0.5">
                <Bus className="size-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Veículo
                </p>
                <p className="font-medium text-foreground">
                  {nomeVeiculo || (rota.veiculo_id ? "Carregando..." : "Sem veículo")}
                </p>
              </div>
            </div>

            {rota.created_at && (
              <div className="pt-4 border-t border-border/60">
                <p className="text-[11px] text-muted-foreground">
                  Cadastrado em:{" "}
                  {new Date(rota.created_at).toLocaleDateString("pt-BR")}
                </p>
              </div>
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}