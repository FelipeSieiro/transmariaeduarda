import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { ROUTES } from "@/constants/routes";
import { useFormState } from "@/hooks/use-form-state";
import { motoristasService } from "@/features/motoristas/services/motoristas.service";
import type { CreateMotoristaDTO } from "@/features/motoristas/types/motorista";

export interface MotoristaFormValues {
  nome: string;
  cpf: string;
  telefone: string;
  cnh: string;
  categoriaCnh: string;
  salario: string;
  status: string;
}

const VALORES_INICIAIS: MotoristaFormValues = {
  nome: "",
  cpf: "",
  telefone: "",
  cnh: "",
  categoriaCnh: "",
  salario: "",
  status: "ativo",
};

function toPayload(values: MotoristaFormValues): CreateMotoristaDTO {
  return {
    nome: values.nome.trim(),
    cpf: values.cpf.trim() || null,
    telefone: values.telefone.trim() || null,
    cnh: values.cnh.trim() || null,
    categoria_cnh: values.categoriaCnh.trim() || null,
    salario: values.salario ? Number(values.salario) : null,
    status: values.status,
  };
}

// Estado, carregamento (edição) e submissão do formulário de motorista.
export function useMotoristaForm(id: string | undefined) {
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
        const motorista = await motoristasService.getById(id as string);

        setValues({
          nome: motorista.nome || "",
          cpf: motorista.cpf || "",
          telefone: motorista.telefone || "",
          cnh: motorista.cnh || "",
          categoriaCnh: motorista.categoria_cnh || "",
          salario: motorista.salario !== null ? String(motorista.salario) : "",
          status: motorista.status || "ativo",
        });
      } catch (error) {
        console.error("Erro ao carregar motorista", error);
        toast.error("Erro ao carregar dados do motorista");
        navigate(ROUTES.MOTORISTAS);
      } finally {
        setLoading(false);
      }
    }

    void carregar();
  }, [id, navigate, setValues]);

  async function submit() {
    if (!values.nome.trim()) {
      toast.error("Informe o nome completo do motorista");
      return;
    }

    try {
      setSubmitting(true);
      const payload = toPayload(values);

      if (isEditing && id) {
        await motoristasService.update(id, payload);
        toast.success("Motorista atualizado com sucesso");
      } else {
        await motoristasService.create(payload);
        toast.success("Motorista cadastrado com sucesso");
      }

      navigate(ROUTES.MOTORISTAS);
    } catch (error) {
      console.error("Erro ao salvar motorista", error);
      toast.error(
        isEditing
          ? "Erro ao atualizar motorista"
          : "Erro ao cadastrar motorista",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return { values, setField, loading, submitting, isEditing, submit };
}
