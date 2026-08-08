import { useNavigate, useParams } from "react-router-dom";
import { Edit, IdCard, Trash2 } from "lucide-react";

import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { DetailSkeleton } from "@/components/common/detail-skeleton";
import { FieldValue } from "@/components/common/field-value";
import { DetailPageHeader } from "@/components/common/page-header";
import { SectionCard, StatusPill } from "@/components/ui-kit/primitives";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useMotorista } from "@/features/motoristas/hooks/use-motorista";
import { useDisclosure } from "@/hooks/use-disclosure";
import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "@/utils/format-date";
import { formatCPF, formatPhone } from "@/utils/format-text";

export default function MotoristaDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { motorista, loading, remover } = useMotorista(id);
  const exclusao = useDisclosure();

  if (loading) return <DetailSkeleton />;
  if (!motorista) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <DetailPageHeader
        title={motorista.nome}
        subtitle={
          <span className="font-mono text-xs text-muted-foreground">
            ID: {motorista.id}
          </span>
        }
        icon={IdCard}
        backTo={ROUTES.MOTORISTAS}
        actions={
          <>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => navigate(ROUTES.MOTORISTA_EDITAR(motorista.id))}
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
        title="Informações do Motorista"
        description="Visão geral dos dados cadastrais e profissionais"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <FieldValue label="Nome Completo" value={motorista.nome} />

          <div className="space-y-0.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </p>
            <div className="pt-1">
              <StatusPill status={motorista.status ?? "ativo"} />
            </div>
          </div>

          <FieldValue label="CPF" value={formatCPF(motorista.cpf) || "—"} />
          <FieldValue label="Telefone" value={formatPhone(motorista.telefone) || "—"} />
          <FieldValue label="CNH" value={motorista.cnh || "—"} />
          <FieldValue label="Categoria CNH" value={motorista.categoria_cnh || "—"} />
          <FieldValue
            label="Salário"
            value={formatCurrency(motorista.salario)}
          />
          <FieldValue
            label="Data de Cadastro"
            value={formatDate(motorista.created_at)}
          />
        </div>
      </SectionCard>

      <ConfirmDialog
        open={exclusao.isOpen}
        onOpenChange={(aberto) => (aberto ? exclusao.open() : exclusao.close())}
        title="Excluir motorista"
        description="Tem certeza que deseja excluir este motorista? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        destructive
        onConfirm={() => void remover()}
      />
    </div>
  );
}
