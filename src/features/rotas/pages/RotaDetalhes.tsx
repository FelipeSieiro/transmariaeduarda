import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit, Route, Trash2, Clock, MapPin, UserCheck, Bus } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { DetailSkeleton } from "@/components/common/detail-skeleton";
import { FieldValue } from "@/components/common/field-value";
import { DetailPageHeader } from "@/components/common/page-header";
import { SectionCard, StatusPill } from "@/components/ui-kit/primitives";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { rotasService } from "@/features/rotas/services/rotas.service";
import { motoristasService } from "@/features/motoristas/services/motoristas.service";
import { veiculosService } from "@/features/veiculos/services/veiculos.service";
import type { Rota } from "@/features/rotas/types/rota";
import { useDisclosure } from "@/hooks/use-disclosure";

export default function RotaDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [rota, setRota] = useState<Rota | null>(null);
  const [nomeMotorista, setNomeMotorista] = useState<string | null>(null);
  const [nomeVeiculo, setNomeVeiculo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const exclusao = useDisclosure();

  useEffect(() => {
    if (!id) return;

    async function carregar() {
      try {
        setLoading(true);
        const dadosRota = await rotasService.getById(id!);

        if (!dadosRota) {
          toast.error("Rota não encontrada");
          navigate(ROUTES.ROTAS);
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
    if (!id) return;

    try {
      await rotasService.delete(id);
      toast.success("Rota excluída com sucesso");
      navigate(ROUTES.ROTAS);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir rota");
    }
  }

  if (loading) return <DetailSkeleton />;
  if (!rota) return null;

  const formatarHorario = (horario?: string | null) => {
    if (!horario) return "—";
    return horario.slice(0, 5);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <DetailPageHeader
        title={rota.nome}
        subtitle={
          <span className="font-mono text-xs text-muted-foreground">
            ID: {rota.id}
          </span>
        }
        icon={Route}
        backTo={ROUTES.ROTAS}
        actions={
          <>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => navigate(ROUTES.ROTA_EDITAR(rota.id))}
            >
              <Edit className="mr-2 size-4" />
              Editar
            </Button>
            <Button
              variant="destructive"
              className="rounded-xl shadow-none"
              onClick={exclusao.open}
            >
              <Trash2 className="mr-2 size-4" />
              Excluir
            </Button>
          </>
        }
      />

      <SectionCard
        title="Informações da Rota"
        description="Visão geral e horários do trajeto"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-0.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </p>
            <div className="pt-1">
              <StatusPill active={rota.status?.toLowerCase() === "ativa"} />
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex rounded-xl bg-muted/60 p-2 text-muted-foreground">
              <MapPin className="size-4" />
            </span>
            <FieldValue label="Bairro/Região" value={rota.bairro || "Não informado"} />
          </div>
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex rounded-xl bg-muted/60 p-2 text-muted-foreground">
              <Clock className="size-4" />
            </span>
            <FieldValue
              label="Horário de Saída"
              value={formatarHorario(rota.horario_saida)}
            />
          </div>
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex rounded-xl bg-muted/60 p-2 text-muted-foreground">
              <Clock className="size-4" />
            </span>
            <FieldValue
              label="Horário de Retorno"
              value={formatarHorario(rota.horario_retorno)}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Alocações" description="Equipe e veículo">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex rounded-xl bg-muted/60 p-2 text-muted-foreground">
              <UserCheck className="size-4" />
            </span>
            <FieldValue
              label="Motorista"
              value={nomeMotorista || "Não vinculado"}
            />
          </div>
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex rounded-xl bg-muted/60 p-2 text-muted-foreground">
              <Bus className="size-4" />
            </span>
            <FieldValue
              label="Veículo"
              value={nomeVeiculo || "Não vinculado"}
            />
          </div>
        </div>
      </SectionCard>

      {rota.descricao && (
        <SectionCard title="Descrição" description="Observações sobre a rota">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {rota.descricao}
          </p>
        </SectionCard>
      )}

      <ConfirmDialog
        open={exclusao.isOpen}
        onOpenChange={(aberto) => (aberto ? exclusao.open() : exclusao.close())}
        title="Excluir rota"
        description="Tem certeza que deseja excluir esta rota? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        destructive
        onConfirm={handleExcluir}
      />
    </div>
  );
}
