import type { Contrato } from "@/features/contratos/types/contrato";

/**
 * Mapper para conversão de dados de contratos entre API e UI
 */
export class ContratoMapper {
  /**
   * Formata valor monetário para exibição
   */
  static formatValor(valor: number): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  }

  /**
   * Formata data para exibição
   */
  static formatData(data?: string | null): string {
    if (!data) return "-";
    try {
      return new Date(data).toLocaleDateString("pt-BR");
    } catch {
      return "-";
    }
  }

  /**
   * Extrai status formatado
   */
  static getStatusBadge(status?: string | null): {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  } {
    switch (status) {
      case "ativo":
        return { label: "Ativo", variant: "default" };
      case "inativo":
        return { label: "Inativo", variant: "secondary" };
      case "cancelado":
        return { label: "Cancelado", variant: "destructive" };
      case "pendente":
        return { label: "Pendente", variant: "outline" };
      default:
        return { label: status || "-", variant: "outline" };
    }
  }

  /**
   * Formata período do contrato
   */
  static formatPeriodo(
    dataInicio?: string | null,
    dataFim?: string | null
  ): string {
    const inicio = this.formatData(dataInicio);
    const fim = this.formatData(dataFim);
    return `${inicio} até ${fim}`;
  }

  /**
   * Calcula dias até o vencimento
   */
  static diasAteVencimento(diaVencimento: number): number {
    const hoje = new Date();
    const diaAtual = hoje.getDate();
    
    if (diaVencimento >= diaAtual) {
      return diaVencimento - diaAtual;
    }
    
    // Próximo mês
    const proximoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    return proximoMes.getDate() - diaAtual + diaVencimento;
  }
}