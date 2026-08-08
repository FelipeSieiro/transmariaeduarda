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

/**
 * Mapper para conversão de dados de responsáveis entre API e UI
 */
export class ResponsavelMapper {
  /**
   * Formata nome completo
   */
  static formatNome(nome?: string | null): string {
    return nome || "Responsável sem nome";
  }

  /**
   * Formata telefone para exibição
   */
  static formatTelefone(telefone?: string | null): string {
    if (!telefone) return "-";
    
    const numeros = telefone.replace(/\D/g, "");
    
    if (numeros.length === 11) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
    }
    if (numeros.length === 10) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
    }
    
    return telefone;
  }

  /**
   * Formata endereço completo
   */
  static formatEndereco(
    endereco?: string | null,
    numero?: string | null,
    complemento?: string | null,
    bairro?: string | null,
    cidade?: string | null
  ): string {
    const partes = [endereco, numero, complemento]
      .filter(Boolean)
      .join(", ");
    
    const local = [bairro, cidade]
      .filter(Boolean)
      .join(" - ");
    
    return [partes, local].filter(Boolean).join(" - ") || "-";
  }

  /**
   * Junta os campos de endereço em uma única string, no formato aceito pela API.
   */
  static formatEnderecoFromForm(endereco: EnderecoFormValues): string {
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

  /**
   * Formata parentesco para exibição
   */
  static formatParentesco(parentesco?: string | null): string {
    const parentescos: Record<string, string> = {
      pai: "Pai",
      mae: "Mãe",
      avo: "Avô/Avó",
      tutor: "Tutor",
      responsavel: "Responsável Legal",
    };
    
    return parentescos[parentesco || ""] || parentesco || "-";
  }

  /**
   * Gera avatar placeholder
   */
  static generateAvatar(nome: string): string {
    return `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(nome)}`;
  }

  /**
   * Verifica se é responsável financeiro
   */
  static isFinanceiro(responsavelFinanceiro?: boolean | null): boolean {
    return Boolean(responsavelFinanceiro);
  }

  /**
   * Verifica se é responsável de emergência
   */
  static isEmergencia(responsavelEmergencia?: boolean | null): boolean {
    return Boolean(responsavelEmergencia);
  }

  /**
   * Converte valores do formulário para payload da API
   */
  static toResponsavelPayload(
    values: ResponsavelFormValues,
  ): Partial<Responsavel> {
    const endereco = this.formatEnderecoFromForm(values.endereco);

    return {
      nome: values.nome,
      cpf: values.cpf,
      telefone: values.telefone,
      email: values.email,
      ...(endereco ? { endereco } : {}),
      ...(values.observacoes ? { observacoes: values.observacoes } : {}),
    };
  }
}