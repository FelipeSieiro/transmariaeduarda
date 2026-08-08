import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Users } from "lucide-react";

import { FormActions } from "@/components/common/form-actions";
import { DetailPageHeader } from "@/components/common/page-header";
import { SectionCard } from "@/components/ui-kit/primitives";
import { ROUTES } from "@/constants/routes";
import { ResponsavelFormFields } from "@/features/responsaveis/components/ResponsavelFormFields";
import { useResponsavelForm } from "@/features/responsaveis/hooks/use-responsavel-form";
import { responsaveisService } from "@/features/responsaveis/services/responsaveis.service";

export default function EditarResponsavel() {
  const { id } = useParams<{ id: string }>();
  const { values, setField, setEnderecoField, submitting, submit, initialize } =
    useResponsavelForm();

  useEffect(() => {
    async function carregarDados() {
      if (!id) return;

      try {
        const responsavel = await responsaveisService.getById(id);
        if (responsavel) {
          initialize({
            nome: responsavel.nome || "",
            cpf: responsavel.cpf || "",
            telefone: responsavel.telefone || "",
            email: responsavel.email || "",
            observacoes: responsavel.observacoes || "",
            endereco: {
              cidade: "",
              bairro: "",
              logradouro: "",
              numero: "",
              complemento: "",
              cep: "",
            },
          });
        }
      } catch (error) {
        console.error(error);
      }
    }

    carregarDados();
  }, [id, initialize]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <DetailPageHeader
        title="Editar responsável"
        subtitle="Atualize as informações do responsável"
        icon={Users}
        backTo={ROUTES.RESPONSAVEIS}
      />

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void submit(id);
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
          submitLabel="Salvar alterações"
          cancelTo={ROUTES.RESPONSAVEIS}
        />
      </form>
    </div>
  );
}
