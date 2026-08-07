import { useParams } from "react-router-dom";
import { Bus } from "lucide-react";

import { DetailSkeleton } from "@/components/common/detail-skeleton";
import { FormActions } from "@/components/common/form-actions";
import { DetailPageHeader } from "@/components/common/page-header";
import { SectionCard } from "@/components/ui-kit/primitives";
import { ROUTES } from "@/constants/routes";
import { VeiculoFormFields } from "@/features/veiculos/components/VeiculoFormFields";
import { useVeiculoForm } from "@/features/veiculos/hooks/use-veiculo-form";

export default function NovoVeiculo() {
  const { id } = useParams<{ id: string }>();
  const { values, setField, loading, submitting, isEditing, submit } =
    useVeiculoForm(id);

  if (loading) {
    return <DetailSkeleton className="mx-auto max-w-3xl" bodyHeight="h-96" />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <DetailPageHeader
        title={isEditing ? "Editar Veículo" : "Novo Veículo"}
        subtitle={
          isEditing
            ? "Atualize as informações do veículo cadastrado"
            : "Preencha os dados abaixo para cadastrar um novo veículo"
        }
        icon={Bus}
        backTo={ROUTES.VEICULOS}
      />

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
        className="space-y-6"
      >
        <SectionCard
          title="Dados do Veículo"
          description="Informações principais de identificação, marca e capacidade"
        >
          <VeiculoFormFields
            values={values}
            setField={setField}
            disabled={submitting}
          />
        </SectionCard>

        <FormActions
          submitting={submitting}
          submitLabel={isEditing ? "Salvar Alterações" : "Cadastrar Veículo"}
          cancelTo={ROUTES.VEICULOS}
        />
      </form>
    </div>
  );
}
