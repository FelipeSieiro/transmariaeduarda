import { useParams } from "react-router-dom";
import { IdCard } from "lucide-react";

import { DetailSkeleton } from "@/components/common/detail-skeleton";
import { FormActions } from "@/components/common/form-actions";
import { DetailPageHeader } from "@/components/common/page-header";
import { MotoristaFormFields } from "@/features/motoristas/components/MotoristaFormFields";
import { useMotoristaForm } from "@/features/motoristas/hooks/use-motorista-form";
import { SectionCard } from "@/components/ui-kit/primitives";
import { ROUTES } from "@/constants/routes";

export default function EditarMotorista() {
  const { id } = useParams<{ id: string }>();
  const { values, setField, loading, submitting, isEditing, submit } =
    useMotoristaForm(id);

  if (loading) {
    return <DetailSkeleton className="mx-auto max-w-3xl" bodyHeight="h-64" />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <DetailPageHeader
        title="Editar Motorista"
        subtitle="Atualize as informações cadastrais e profissionais"
        icon={IdCard}
        backTo={ROUTES.MOTORISTAS}
      />

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
        className="space-y-6"
      >
        <SectionCard
          title="Dados Pessoais e Profissionais"
          description="Informações cadastrais e de habilitação"
        >
          <MotoristaFormFields
            values={values}
            setField={setField}
            disabled={submitting}
          />
        </SectionCard>

        <FormActions
          submitting={submitting}
          submitLabel="Salvar alterações"
          cancelTo={ROUTES.MOTORISTAS}
        />
      </form>
    </div>
  );
}
