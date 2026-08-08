import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit, FileText, Trash2, Calendar, DollarSign, User, School, Bus } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { DetailSkeleton } from "@/components/common/detail-skeleton";
import { FieldValue } from "@/components/common/field-value";
import { DetailPageHeader } from "@/components/common/page-header";
import { SectionCard, StatusPill } from "@/components/ui-kit/primitives";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { contratosService } from "@/features/contratos/services/contratos.service";
import type { Contrato } from "@/features/contratos/types/contrato";
import { useDisclosure } from "@/hooks/use-disclosure";
import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "@/utils/format-date";

export default function ContratoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contrato, setContrato] = useState<Contrato | null>(null);
  const [loading, setLoading] = useState(true);
  const exclusao = useDisclosure();

  useEffect(() => {
    async function carregar() {
      if (!id) return;

      try {
        setLoading(true);
        const dados = await contratosService.getById(id);
        setContrato(dados);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar detalhes do contrato");
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, [id]);

  async function handleExcluir() {
    if (!id) return;

    try {
      await contratosService.remove(id);
      toast.success("Contrato excluído com sucesso");
      navigate(ROUTES.CONTRATOS);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir contrato");
    }
  }

  if (loading) return <DetailSkeleton />;
  if (!contrato) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <DetailPageHeader
        title={`Contrato ${contrato.numero}`}
        subtitle={
          <span className="font-mono text-xs text-muted-foreground">
            ID: {contrato.id}
          </span>
        }
        icon={FileText}
        backTo={ROUTES.CONTRATOS}
        actions={
          <>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => navigate(ROUTES.CONTRATO_EDITAR(contrato.id!))}
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
        title="Informações do Contrato"
        description="Dados financeiros e comerciais"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <FieldValue label="Número" value={contrato.numero} />
          <div className="space-y-0.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </p>
            <div className="pt-1">
              <StatusPill active={contrato.status?.toLowerCase() === "ativo"} />
            </div>
          </div>
          <FieldValue
            label="Valor Mensalidade"
            value={formatCurrency(contrato.valor_mensalidade || 0)}
          />
          <FieldValue
            label="Dia de Vencimento"
            value={contrato.dia_vencimento ? `Dia ${contrato.dia_vencimento}` : "—"}
          />
          <FieldValue label="Forma de Pagamento" value={contrato.forma_pagamento || "—"} />
          <FieldValue
            label="Data de Cadastro"
            value={formatDate(contrato.created_at)}
          />
        </div>
      </SectionCard>

      <SectionCard title="Vigência" description="Período do contrato">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex rounded-xl bg-muted/60 p-2 text-muted-foreground">
              <Calendar className="size-4" />
            </span>
            <FieldValue
              label="Data de Início"
              value={formatDate(contrato.data_inicio)}
            />
          </div>
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex rounded-xl bg-muted/60 p-2 text-muted-foreground">
              <Calendar className="size-4" />
            </span>
            <FieldValue
              label="Data de Fim"
              value={contrato.data_fim ? formatDate(contrato.data_fim) : "Indeterminado"}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Aluno Vinculado" description="Informações do aluno associado">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex rounded-xl bg-muted/60 p-2 text-muted-foreground">
              <User className="size-4" />
            </span>
            <FieldValue label="Nome" value={contrato.alunos?.nome || "—"} />
          </div>
          <FieldValue label="Matrícula" value={contrato.alunos?.matricula || "—"} />
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex rounded-xl bg-muted/60 p-2 text-muted-foreground">
              <School className="size-4" />
            </span>
            <FieldValue label="Escola" value={contrato.alunos?.escolas?.nome || "—"} />
          </div>
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex rounded-xl bg-muted/60 p-2 text-muted-foreground">
              <Bus className="size-4" />
            </span>
            <FieldValue label="Rota" value={contrato.alunos?.rotas?.nome || "—"} />
          </div>
        </div>
      </SectionCard>

      {contrato.observacoes && (
        <SectionCard title="Observações" description="Notas adicionais">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {contrato.observacoes}
          </p>
        </SectionCard>
      )}

      <ConfirmDialog
        open={exclusao.isOpen}
        onOpenChange={(aberto) => (aberto ? exclusao.open() : exclusao.close())}
        title="Excluir contrato"
        description="Tem certeza que deseja excluir este contrato? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        destructive
        onConfirm={handleExcluir}
      />
    </div>
  );
}
