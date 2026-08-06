// src/pages/VeiculoDetalhes.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Bus, Calendar, Edit, Users, UserCheck } from "lucide-react";
import { toast } from "sonner";

import { SectionCard, StatusPill } from "@/components/ui-kit/primitives";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { veiculosService } from "@/features/veiculos/services/veiculos.service";
import type { Veiculo } from "@/types";
import { motoristasService } from "@/features/motoristas/services/motoristas.service";

export default function VeiculoDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
  const [nomeMotorista, setNomeMotorista] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        if (id) {
          setLoading(true);
          const dados = await veiculosService.getById(id);
          setVeiculo(dados);

          if (dados?.motorista_id) {
            motoristasService
              .getById(dados.motorista_id)
              .then((m: any) => setNomeMotorista(m?.nome || m?.data?.nome || null))
              .catch(() => setNomeMotorista(null));
          }
        }
      } catch (error) {
        console.error("Erro ao carregar detalhes", error);
        toast.error("Não foi possível carregar os dados do veículo");
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!veiculo) {
    return (
      <div className="mx-auto max-w-md p-8 text-center space-y-4">
        <p className="text-muted-foreground">Veículo não encontrado.</p>
        <Button variant="outline" onClick={() => navigate("/veiculos")} className="rounded-xl">
          Voltar para Lista
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
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
              <div className="flex items-center gap-2.5">
                <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                  {veiculo.modelo}
                </h1>
                <StatusPill status={veiculo.status ? veiculo.status.toLowerCase() : "ativo"} />
              </div>
              <p className="text-xs font-mono text-muted-foreground">
                Placa: {veiculo.placa}
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          className="rounded-xl"
          onClick={() => navigate(`/veiculos/${veiculo.id}/editar`)}
        >
          <Edit className="size-4 mr-2" />
          Editar Veículo
        </Button>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <SectionCard
          title="Informações do Veículo"
          description="Dados principais de identificação e especificações"
          className="md:col-span-2"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Modelo
              </span>
              <p className="text-base font-medium text-foreground">{veiculo.modelo}</p>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Placa
              </span>
              <p className="font-medium font-mono text-foreground">{veiculo.placa}</p>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Marca
              </span>
              <p className="font-medium text-foreground">{veiculo.marca || "—"}</p>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Ano de Fabricação
              </span>
              <p className="font-medium text-foreground">{veiculo.ano || "—"}</p>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Capacidade
              </span>
              <p className="font-medium text-foreground">
                {veiculo.capacidade ? `${veiculo.capacidade} passageiros` : "—"}
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Motorista Vinculado
              </span>
              <p className="font-medium text-foreground">
                {nomeMotorista || (veiculo.motorista_id ? "Carregando..." : "Não vinculado")}
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Resumo"
          description="Informações adicionais"
        >
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="inline-flex p-2 rounded-xl bg-muted/60 text-muted-foreground mt-0.5">
                <Users className="size-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Lotação Máxima
                </p>
                <p className="font-medium text-foreground">{veiculo.capacidade ?? 0} Lugares</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="inline-flex p-2 rounded-xl bg-muted/60 text-muted-foreground mt-0.5">
                <Calendar className="size-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Cadastrado em
                </p>
                <p className="font-medium text-foreground">
                  {veiculo.created_at
                    ? new Date(veiculo.created_at).toLocaleDateString("pt-BR")
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}