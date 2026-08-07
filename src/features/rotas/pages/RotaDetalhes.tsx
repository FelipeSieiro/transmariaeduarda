// src/pages/RotaDetalhes.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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

import { StatusPill } from "@/components/ui-kit/primitives";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { rotasService } from "@/features/rotas/services/rotas.service";
import { motoristasService } from "@/features/motoristas/services/motoristas.service";
import { veiculosService } from "@/features/veiculos/services/veiculos.service";
import type { Rota } from "@/features/rotas/types/rota";

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
      <div className="mx-auto max-w-4xl space-y-6 py-2">
        <Skeleton className="h-9 w-32 rounded-lg" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  if (!rota) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-2">
      {/* Header Minimalista */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/rotas")}
          >
            <ArrowLeft className="size-4" />
          </Button>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                {rota.nome}
              </h1>
              <StatusPill status={rota.status ? rota.status.toLowerCase() : "ativa"} />
            </div>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              ID: {rota.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-lg text-xs"
            asChild
          >
            <Link to={`/rotas/${rota.id}/editar`}>
              <Edit className="size-3.5 mr-1.5 opacity-70" />
              Editar
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-9 rounded-lg text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleExcluir}
          >
            <Trash2 className="size-3.5 mr-1.5" />
            Excluir
          </Button>
        </div>
      </div>

      {/* Grid Minimalista de Conteúdo */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Informações Principais */}
        <div className="md:col-span-2 rounded-xl border border-border/60 bg-card/50 p-6 space-y-6">
          <div>
            <h2 className="text-sm font-medium text-foreground">Informações da Rota</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Visão geral e horários do trajeto</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 pt-2 border-t border-border/40">
            <div className="space-y-1">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                Nome da Rota
              </span>
              <p className="text-xs font-medium text-foreground">{rota.nome}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                Bairro / Região
              </span>
              <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                <MapPin className="size-3.5 text-muted-foreground/70" />
                {rota.bairro || "Não informado"}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                Horário de Saída
              </span>
              <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                <Clock className="size-3.5 text-muted-foreground/70" />
                {rota.horario_saida ? rota.horario_saida.slice(0, 5) : "—"}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                Horário de Retorno
              </span>
              <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                <Clock className="size-3.5 text-muted-foreground/70" />
                {rota.horario_retorno ? rota.horario_retorno.slice(0, 5) : "—"}
              </div>
            </div>

            <div className="sm:col-span-2 space-y-1 pt-2">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                Descrição / Observações
              </span>
              <p className="text-xs text-muted-foreground/90 leading-relaxed">
                {rota.descricao || "Nenhuma descrição informada."}
              </p>
            </div>
          </div>
        </div>

        {/* Alocações */}
        <div className="rounded-xl border border-border/60 bg-card/50 p-6 space-y-6">
          <div>
            <h2 className="text-sm font-medium text-foreground">Alocações</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Equipe e veículo</p>
          </div>

          <div className="space-y-4 pt-2 border-t border-border/40">
            <div className="flex items-start gap-3">
              <div className="grid size-7 shrink-0 place-items-center rounded-md bg-muted/50 text-muted-foreground mt-0.5">
                <UserCheck className="size-3.5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70 block">
                  Motorista
                </span>
                <p className="text-xs font-medium text-foreground">
                  {nomeMotorista || (rota.motorista_id ? "Carregando..." : "Sem motorista")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="grid size-7 shrink-0 place-items-center rounded-md bg-muted/50 text-muted-foreground mt-0.5">
                <Bus className="size-3.5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70 block">
                  Veículo
                </span>
                <p className="text-xs font-medium text-foreground">
                  {nomeVeiculo || (rota.veiculo_id ? "Carregando..." : "Sem veículo")}
                </p>
              </div>
            </div>

            {rota.created_at && (
              <div className="pt-4 border-t border-border/40">
                <span className="text-[10px] text-muted-foreground/70 block">
                  Cadastrado em {new Date(rota.created_at).toLocaleDateString("pt-BR")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}