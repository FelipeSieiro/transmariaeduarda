import { FormField } from "@/components/common/form-field";
import { SelectField } from "@/components/common/select-field";
import { Input } from "@/components/ui/input";
import { STATUS_VEICULO } from "@/features/veiculos/constants/veiculo.constants";
import type { VeiculoFormValues } from "@/features/veiculos/hooks/use-veiculo-form";

interface VeiculoFormFieldsProps {
  values: VeiculoFormValues;
  setField: <K extends keyof VeiculoFormValues>(
    campo: K,
    valor: VeiculoFormValues[K],
  ) => void;
  disabled: boolean;
}

export function VeiculoFormFields({
  values,
  setField,
  disabled,
}: VeiculoFormFieldsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField label="Placa" required>
        <Input
          placeholder="ABC-1234"
          value={values.placa}
          onChange={(event) => setField("placa", event.target.value)}
          className="h-10 rounded-xl font-mono uppercase"
          disabled={disabled}
          required
        />
      </FormField>

      <FormField label="Modelo" required>
        <Input
          placeholder="Ex: Mercedes Sprinter"
          value={values.modelo}
          onChange={(event) => setField("modelo", event.target.value)}
          className="h-10 rounded-xl"
          disabled={disabled}
          required
        />
      </FormField>

      <FormField label="Marca">
        <Input
          placeholder="Ex: Mercedes-Benz"
          value={values.marca}
          onChange={(event) => setField("marca", event.target.value)}
          className="h-10 rounded-xl"
          disabled={disabled}
        />
      </FormField>

      <FormField label="Capacidade (Passageiros)">
        <Input
          type="number"
          placeholder="Ex: 15"
          value={values.capacidade}
          onChange={(event) => setField("capacidade", event.target.value)}
          className="h-10 rounded-xl"
          disabled={disabled}
        />
      </FormField>

      <FormField label="Ano Fabricação">
        <Input
          type="number"
          placeholder="Ex: 2022"
          value={values.ano}
          onChange={(event) => setField("ano", event.target.value)}
          className="h-10 rounded-xl"
          disabled={disabled}
        />
      </FormField>

      <FormField label="Status">
        <SelectField
          value={values.status}
          onChange={(valor) => setField("status", valor)}
          options={STATUS_VEICULO}
          placeholder="Selecione..."
          disabled={disabled}
        />
      </FormField>
    </div>
  );
}
