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

  function initialize(dados: Partial<ResponsavelFormValues>) {
    setValues((atual) => ({ ...atual, ...dados }));
  }

  async function submit(id?: string) {
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
      const payload = ResponsavelMapper.toResponsavelPayload(values);

      if (id) {
        await responsaveisService.update(id, payload);
        toast.success("Responsável atualizado com sucesso");
      } else {
        await responsaveisService.create(payload);
        toast.success("Responsável cadastrado com sucesso");
      }
      navigate(ROUTES.RESPONSAVEIS);
    } catch (error) {
      console.error(error);
      toast.error(id ? "Erro ao atualizar responsável" : "Erro ao cadastrar responsável");
    } finally {
      setSubmitting(false);
    }
  }

  return { values, setField, setEnderecoField, submitting, submit, initialize };
}
