import { Users } from "lucide-react";

import { FormActions } from "@/components/common/form-actions";
import { DetailPageHeader } from "@/components/common/page-header";
import { SectionCard } from "@/components/ui-kit/primitives";
import { ROUTES } from "@/constants/routes";
import { ResponsavelFormFields } from "@/features/responsaveis/components/ResponsavelFormFields";
import { useResponsavelForm } from "@/features/responsaveis/hooks/use-responsavel-form";

export default function NovoResponsavel() {
  const { values, setField, setEnderecoField, submitting, submit } =
    useResponsavelForm();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <DetailPageHeader
        title="Novo responsável"
        subtitle="Cadastro de responsável financeiro e contato autorizado"
        icon={Users}
        backTo={ROUTES.RESPONSAVEIS}
      />

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
        className="space-y-6"
      >
        <SectionCard
          title="Dados do responsável"
          description="Informações pessoais e de contato"
        >
          <ResponsavelFormFields
            values={values}
            setField={setField}
            setEnderecoField={setEnderecoField}
            disabled={submitting}
          />
        </SectionCard>

        <FormActions
          submitting={submitting}
          submitLabel="Salvar responsável"
          cancelTo={ROUTES.RESPONSAVEIS}
        />
      </form>
    </div>
  );
}
