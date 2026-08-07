import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { ROUTES } from "@/constants/routes";
import { useFormState } from "@/hooks/use-form-state";
import { veiculosService } from "@/features/veiculos/services/veiculos.service";
import type { CreateVeiculoDTO } from "@/features/veiculos/types/veiculos";
import { getApiErrorMessage } from "@/utils/api-error";

export interface VeiculoFormValues {
  placa: string;
  modelo: string;
  marca: string;
  ano: string;
  capacidade: string;
  status: string;
}

const VALORES_INICIAIS: VeiculoFormValues = {
  placa: "",
  modelo: "",
  marca: "",
  ano: "",
  capacidade: "",
  status: "ativo",
};

function toPayload(values: VeiculoFormValues): CreateVeiculoDTO {
  return {
    placa: values.placa.toUpperCase().trim(),
    modelo: values.modelo,
    marca: values.marca,
    status: values.status,
    capacidade: values.capacidade ? Number(values.capacidade) : null,
    ano: values.ano ? Number(values.ano) : null,
  };
}

// Estado, carregamento (edição) e submissão do formulário de veículo.
export function useVeiculoForm(id: string | undefined) {
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const { values, setField, setValues } = useFormState(VALORES_INICIAIS);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function carregar() {
      try {
        setLoading(true);
        const veiculo = await veiculosService.getById(id as string);

        setValues({
          placa: veiculo.placa || "",
          modelo: veiculo.modelo || "",
          marca: veiculo.marca || "",
          ano: veiculo.ano != null ? String(veiculo.ano) : "",
          capacidade:
            veiculo.capacidade != null ? String(veiculo.capacidade) : "",
          status: veiculo.status || "ativo",
        });
      } catch (error) {
        console.error("Erro ao carregar veículo", error);
        toast.error("Erro ao carregar dados do veículo");
        navigate(ROUTES.VEICULOS);
      } finally {
        setLoading(false);
      }
    }

    void carregar();
  }, [id, navigate, setValues]);

  async function submit() {
    if (!values.placa || !values.modelo) {
      toast.error("Placa e Modelo são campos obrigatórios");
      return;
    }

    setSubmitting(true);

    try {
      const payload = toPayload(values);

      if (isEditing && id) {
        await veiculosService.update(id, payload);
        toast.success("Veículo atualizado com sucesso!");
      } else {
        await veiculosService.create(payload);
        toast.success("Veículo cadastrado com sucesso!");
      }

      navigate(ROUTES.VEICULOS);
    } catch (error) {
      console.error("Erro ao salvar veículo:", error);
      toast.error(getApiErrorMessage(error, "Erro ao salvar veículo"));
    } finally {
      setSubmitting(false);
    }
  }

  return { values, setField, loading, submitting, isEditing, submit };
}
