import { FormField } from "@/components/common/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EnderecoFields } from "@/features/responsaveis/components/EnderecoFields";
import type {
  EnderecoFormValues,
  ResponsavelFormValues,
} from "@/features/responsaveis/adapters/responsavel.mapper";

interface ResponsavelFormFieldsProps {
  values: ResponsavelFormValues;
  setField: <K extends keyof ResponsavelFormValues>(
    campo: K,
    valor: ResponsavelFormValues[K],
  ) => void;
  setEnderecoField: <K extends keyof EnderecoFormValues>(
    campo: K,
    valor: EnderecoFormValues[K],
  ) => void;
  disabled: boolean;
}

export function ResponsavelFormFields({
  values,
  setField,
  setEnderecoField,
  disabled,
}: ResponsavelFormFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Nome Completo" required>
          <Input
            placeholder="Ex: Ana Maria Souza"
            value={values.nome}
            onChange={(event) => setField("nome", event.target.value)}
            className="h-10 rounded-xl"
            disabled={disabled}
          />
        </FormField>

        <FormField label="CPF" required>
          <Input
            placeholder="000.000.000-00"
            value={values.cpf}
            onChange={(event) => setField("cpf", event.target.value)}
            className="h-10 rounded-xl"
            disabled={disabled}
          />
        </FormField>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Telefone">
          <Input
            placeholder="(11) 99999-9999"
            value={values.telefone}
            onChange={(event) => setField("telefone", event.target.value)}
            className="h-10 rounded-xl"
            disabled={disabled}
          />
        </FormField>

        <FormField label="E-mail">
          <Input
            type="email"
            placeholder="exemplo@email.com"
            value={values.email}
            onChange={(event) => setField("email", event.target.value)}
            className="h-10 rounded-xl"
            disabled={disabled}
          />
        </FormField>
      </div>

      <EnderecoFields
        values={values.endereco}
        setField={setEnderecoField}
        disabled={disabled}
      />

      <div className="pt-2">
        <FormField label="Observações">
          <Textarea
            placeholder="Informações adicionais sobre o responsável..."
            value={values.observacoes}
            onChange={(event) => setField("observacoes", event.target.value)}
            className="min-h-[90px] rounded-xl"
            disabled={disabled}
          />
        </FormField>
      </div>
    </div>
  );
}
