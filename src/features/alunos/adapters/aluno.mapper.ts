import type { Aluno } from "@/features/alunos/types/alunos";
import type { AlunoDetalhe } from "@/features/alunos/types/alunos";

/**
 * Mapper para converter dados de API para UI
 * Focado em transformações simples e previsíveis
 */
export class AlunoMapper {
  /**
   * Converte dados de API para formato de exibição
   */
  static toAlunoDetalhe(aluno: Aluno): AlunoDetalhe {
    return {
      id: aluno.id,
      nome: aluno.nome,
      foto: aluno.foto_url || this.generateAvatar(aluno.nome),
      nascimento: aluno.data_nascimento || "-",
      escola: aluno.escolas?.nome || "-",
      serie: aluno.serie || "-",
      turno: aluno.turno || "-",
      endereco: this.formatEndereco(aluno),
      bairro: aluno.bairro || "-",
      cidade: aluno.cidade || "-",
      responsaveis: [],
      responsavel: "-",
      parentesco: "-",
      telefone: "-",
      email: "-",
      enderecoResponsavel: "-",
      bairroResponsavel: "-",
      cidadeResponsavel: "-",
      motorista: "-",
      veiculo: "-",
      rota: aluno.rotas?.nome || "-",
      mensalidade: Number(aluno.mensalidade || 0),
      status: aluno.status === "inativo" ? "inativo" : "ativo",
      pagamento: "-",
      desde: aluno.data_inicio || aluno.created_at || "-",
      contrato: {
        numero: "-",
        inicio: "-",
        fim: "-",
        vencimentoDia: 5,
        formaPagamento: "-",
        observacoes: "-",
      },
      mensalidades: [],
      ocorrencias: [],
      historico: [],
      documentos: [],
    };
  }

  /**
   * Formata endereço completo
   */
  private static formatEndereco(aluno: Aluno): string {
    const partes = [aluno.endereco, aluno.numero, aluno.complemento]
      .filter(Boolean);
    return partes.length > 0 ? partes.join(", ") : "-";
  }

  /**
   * Gera avatar placeholder
   */
  private static generateAvatar(nome: string): string {
    return `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(nome)}`;
  }

  /**
   * Extrai nome da escola de forma segura
   */
  static getEscolaNome(aluno: Aluno): string {
    return aluno.escolas?.nome || aluno.escola_id || "Não informado";
  }

  /**
   * Extrai nome da rota de forma segura
   */
  static getRotaNome(aluno: Aluno): string {
    return aluno.rotas?.nome || "-";
  }

  /**
   * Formata status para exibição
   */
  static formatStatus(status?: string | null): "ativo" | "inativo" {
    return status === "inativo" ? "inativo" : "ativo";
  }
}