import type { Responsavel } from "@/features/responsaveis/types/responsavel";

export interface EnderecoFormValues {
  cidade: string;
  bairro: string;
  logradouro: string;
  numero: string;
  complemento: string;
  cep: string;
}

export interface ResponsavelFormValues {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  observacoes: string;
  endereco: EnderecoFormValues;
}

// Junta os campos de endereço em uma única string, no formato aceito pela API.
export function formatEndereco(endereco: EnderecoFormValues): string {
  const partes: string[] = [];
  const logradouro = endereco.logradouro.trim();
  const numero = endereco.numero.trim();

  if (logradouro) {
    partes.push(numero ? `${logradouro}, ${numero}` : logradouro);
  }

  for (const campo of [
    endereco.complemento,
    endereco.bairro,
    endereco.cidade,
  ]) {
    if (campo.trim()) partes.push(campo.trim());
  }

  if (endereco.cep.trim()) {
    partes.push(`CEP: ${endereco.cep.trim()}`);
  }

  return partes.join(" - ");
}

export function toResponsavelPayload(
  values: ResponsavelFormValues,
): Partial<Responsavel> {
  const endereco = formatEndereco(values.endereco);

  return {
    nome: values.nome,
    cpf: values.cpf,
    telefone: values.telefone,
    email: values.email,
    ...(endereco ? { endereco } : {}),
    ...(values.observacoes ? { observacoes: values.observacoes } : {}),
  };
}
