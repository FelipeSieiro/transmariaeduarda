import { useNavigate, useParams } from "react-router-dom";
import { Bus, Calendar, Edit, Trash2, Users } from "lucide-react";

import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { DetailSkeleton } from "@/components/common/detail-skeleton";
import { FieldValue } from "@/components/common/field-value";
import { DetailPageHeader } from "@/components/common/page-header";
import { SectionCard, StatusPill } from "@/components/ui-kit/primitives";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useVeiculo } from "@/features/veiculos/hooks/use-veiculo";
import { useDisclosure } from "@/hooks/use-disclosure";
import { formatDate } from "@/utils/format-date";

export default function VeiculoDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { veiculo, nomeMotorista, loading, remover } = useVeiculo(id);
  const exclusao = useDisclosure();

  if (loading) return <DetailSkeleton bodyHeight="h-64" />;

  if (!veiculo) {
    return (
      <div className="mx-auto max-w-md space-y-4 p-8 text-center">
        <p className="text-muted-foreground">Veículo não encontrado.</p>
        <Button
          variant="outline"
          className="rounded-xl"
          onClick={() => navigate(ROUTES.VEICULOS)}
        >
          Voltar para Lista
        </Button>
      </div>
    );
  }

  async function handleExcluir() {
    try {
      await remover();
      navigate(ROUTES.VEICULOS);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <DetailPageHeader
        title={veiculo.modelo}
        subtitle={
          <span className="flex items-center gap-2.5 font-mono text-xs">
            Placa: {veiculo.placa}
            <StatusPill
              status={veiculo.status ? veiculo.status.toLowerCase() : "ativo"}
            />
          </span>
        }
        icon={Bus}
        backTo={ROUTES.VEICULOS}
        actions={
          <>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => navigate(ROUTES.VEICULO_EDITAR(veiculo.id))}
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
        title="Informações do Veículo"
        description="Dados principais de identificação e especificações"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <FieldValue label="Modelo" value={veiculo.modelo} />
          <FieldValue
            label="Placa"
            value={<span className="font-mono">{veiculo.placa}</span>}
          />
          <FieldValue label="Marca" value={veiculo.marca} />
          <FieldValue label="Ano de Fabricação" value={veiculo.ano} />
          <div className="space-y-0.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </p>
            <div className="pt-1">
              <StatusPill
                status={veiculo.status ? veiculo.status.toLowerCase() : "ativo"}
              />
            </div>
          </div>
          <FieldValue
            label="Motorista Vinculado"
            value={
              nomeMotorista ??
              (veiculo.motorista_id ? "Carregando..." : "Não vinculado")
            }
          />
        </div>
      </SectionCard>

      <SectionCard title="Resumo" description="Informações adicionais">
        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex rounded-xl bg-muted/60 p-2 text-muted-foreground">
              <Users className="size-4" />
            </span>
            <FieldValue
              label="Lotação Máxima"
              value={`${veiculo.capacidade ?? 0} Lugares`}
            />
          </div>

          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex rounded-xl bg-muted/60 p-2 text-muted-foreground">
              <Calendar className="size-4" />
            </span>
            <FieldValue
              label="Cadastrado em"
              value={formatDate(veiculo.created_at)}
            />
          </div>
        </div>
      </SectionCard>

      <ConfirmDialog
        open={exclusao.isOpen}
        onOpenChange={(aberto) => (aberto ? exclusao.open() : exclusao.close())}
        title="Excluir veículo"
        description="Tem certeza que deseja excluir este veículo? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        destructive
        onConfirm={handleExcluir}
      />
    </div>
  );
}
