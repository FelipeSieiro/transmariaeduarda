import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { ROUTES } from "@/constants/routes";
import { useFormState } from "@/hooks/use-form-state";
import { ResponsavelMapper } from "@/features/responsaveis/adapters/responsavel.mapper";
import { responsaveisService } from "@/features/responsaveis/services/responsaveis.service";

const VALORES_INICIAIS = {
  nome: "",
  cpf: "",
  telefone: "",
  email: "",
  observacoes: "",
  endereco: {
    cidade: "",
    bairro: "",
    logradouro: "",
    numero: "",
    complemento: "",
    cep: "",
  },
};

type ResponsavelFormValues = typeof VALORES_INICIAIS;
type EnderecoFormValues = ResponsavelFormValues["endereco"];

// Estado e submissão do cadastro de responsável.
export function useResponsavelForm() {
  const navigate = useNavigate();
  const { values, setField, setValues } = useFormState(VALORES_INICIAIS);
  const [submitting, setSubmitting] = useState(false);

  function setEnderecoField<K extends keyof EnderecoFormValues>(
    campo: K,
    valor: EnderecoFormValues[K],
  ) {
    setValues((atual) => ({
      ...atual,
      endereco: { ...atual.endereco, [campo]: valor },
    }));
  }

  async function submit() {
    if (!values.nome.trim()) {
      toast.error("Informe o nome completo do responsável");
      return;
    }

    if (!values.cpf.trim()) {
      toast.error("Informe o CPF do responsável");
      return;
    }

    try {
      setSubmitting(true);
      await responsaveisService.create(ResponsavelMapper.toResponsavelPayload(values));
      toast.success("Responsável cadastrado com sucesso");
      navigate(ROUTES.RESPONSAVEIS);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao cadastrar responsável");
    } finally {
      setSubmitting(false);
    }
  }

  return { values, setField, setEnderecoField, submitting, submit };
}
