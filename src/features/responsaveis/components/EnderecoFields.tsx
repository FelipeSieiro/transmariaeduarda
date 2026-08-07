import { Input } from "@/components/ui/input";
import type { EnderecoFormValues } from "@/features/responsaveis/mappers/responsavel.mapper";

interface EnderecoFieldsProps {
  values: EnderecoFormValues;
  setField: <K extends keyof EnderecoFormValues>(
    campo: K,
    valor: EnderecoFormValues[K],
  ) => void;
  disabled: boolean;
}

export function EnderecoFields({
  values,
  setField,
  disabled,
}: EnderecoFieldsProps) {
  return (
    <div className="border-t border-border/60 pt-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Endereço
      </h3>

      <div className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            placeholder="Cidade"
            value={values.cidade}
            onChange={(event) => setField("cidade", event.target.value)}
            className="h-10 rounded-xl"
            disabled={disabled}
          />
          <Input
            placeholder="Bairro"
            value={values.bairro}
            onChange={(event) => setField("bairro", event.target.value)}
            className="h-10 rounded-xl"
            disabled={disabled}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Input
            placeholder="Rua / Logradouro"
            value={values.logradouro}
            onChange={(event) => setField("logradouro", event.target.value)}
            className="h-10 rounded-xl"
            disabled={disabled}
          />
          <Input
            placeholder="Número"
            value={values.numero}
            onChange={(event) => setField("numero", event.target.value)}
            className="h-10 rounded-xl"
            disabled={disabled}
          />
          <Input
            placeholder="CEP"
            value={values.cep}
            onChange={(event) => setField("cep", event.target.value)}
            className="h-10 rounded-xl"
            disabled={disabled}
          />
        </div>

        <Input
          placeholder="Complemento (opcional)"
          value={values.complemento}
          onChange={(event) => setField("complemento", event.target.value)}
          className="h-10 rounded-xl"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
