import { FormField } from "@/components/common/form-field";
import { SelectField } from "@/components/common/select-field";
import { Input } from "@/components/ui/input";
import {
  CATEGORIAS_CNH,
  STATUS_MOTORISTA,
} from "@/features/motoristas/constants/motorista.constants";
import type { MotoristaFormValues } from "@/features/motoristas/hooks/use-motorista-form";

interface MotoristaFormFieldsProps {
  values: MotoristaFormValues;
  setField: <K extends keyof MotoristaFormValues>(
    campo: K,
    valor: MotoristaFormValues[K],
  ) => void;
  disabled: boolean;
}

export function MotoristaFormFields({
  values,
  setField,
  disabled,
}: MotoristaFormFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField label="Nome Completo" required>
        <Input
          value={values.nome}
          onChange={(event) => setField("nome", event.target.value)}
          placeholder="Ex: Carlos Silva"
          className="h-10 rounded-xl"
          disabled={disabled}
        />
      </FormField>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="CPF">
          <Input
            value={values.cpf}
            onChange={(event) => setField("cpf", event.target.value)}
            placeholder="000.000.000-00"
            className="h-10 rounded-xl"
            disabled={disabled}
          />
        </FormField>

        <FormField label="Telefone">
          <Input
            value={values.telefone}
            onChange={(event) => setField("telefone", event.target.value)}
            placeholder="(11) 99999-9999"
            className="h-10 rounded-xl"
            disabled={disabled}
          />
        </FormField>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Número da CNH">
          <Input
            value={values.cnh}
            onChange={(event) => setField("cnh", event.target.value)}
            placeholder="Ex: 12345678900"
            className="h-10 rounded-xl"
            disabled={disabled}
          />
        </FormField>

        <FormField label="Categoria CNH">
          <SelectField
            value={values.categoriaCnh}
            onChange={(valor) => setField("categoriaCnh", valor)}
            options={CATEGORIAS_CNH}
            placeholder="Selecione a categoria"
            disabled={disabled}
          />
        </FormField>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Salário">
          <Input
            type="number"
            step="0.01"
            value={values.salario}
            onChange={(event) => setField("salario", event.target.value)}
            placeholder="Ex: 2500.00"
            className="h-10 rounded-xl"
            disabled={disabled}
          />
        </FormField>

        <FormField label="Status">
          <SelectField
            value={values.status}
            onChange={(valor) => setField("status", valor)}
            options={STATUS_MOTORISTA}
            disabled={disabled}
          />
        </FormField>
      </div>
    </div>
  );
}
