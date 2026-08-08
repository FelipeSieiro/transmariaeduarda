import type { Aluno, AlunoDetalhe } from "@/features/alunos/types/alunos";
import type {
  AlunoResponsavelVinculo,
  ResponsavelDetalhe,
} from "@/features/responsaveis/types/responsavel";
import type { HistoricoItemDetalhe } from "@/features/contratos/types/contrato";

// --- Funções Auxiliares ---

function formatarEndereco(
  logradouro?: string | null,
  numero?: string | null,
  complemento?: string | null
): string {
  const partes = [logradouro, numero, complemento].filter(Boolean);
  return partes.length > 0 ? partes.join(", ") : "-";
}

function mapearResponsavel(
  vinculo: AlunoResponsavelVinculo,
  index: number,
  alunoId: string
): ResponsavelDetalhe {
  const respObj = vinculo.responsaveis ?? vinculo.responsavel;

  return {
    id: respObj?.id ?? `${alunoId}-resp-${index}`,
    nome: respObj?.nome ?? "Responsável sem nome",
    email: respObj?.email ?? "-",
    telefone: respObj?.telefone ?? "-",
    parentesco: vinculo.parentesco ?? "Responsável",
    responsavel_financeiro: Boolean(vinculo.responsavel_financeiro),
    responsavel_emergencia: Boolean(vinculo.responsavel_emergencia),
    endereco: respObj?.endereco ?? "-",
    bairro: "-",
    cidade: "-",
  };
}

function gerarHistorico(
  aluno: Aluno,
  totalResponsaveis: number
): HistoricoItemDetalhe[] {
  const dataCriacao = aluno.created_at ?? "-";
  const historico: HistoricoItemDetalhe[] = [
    {
      data: dataCriacao,
      evento: "Aluno cadastrado via sistema",
    },
  ];

  if (totalResponsaveis > 0) {
    historico.push({
      data: dataCriacao,
      evento: `${totalResponsaveis} responsável(eis) vinculado(s) ao aluno`,
    });
  }

  return historico;
}

// --- Função Principal ---

export function adaptarAlunoDetalhe(aluno: Aluno): AlunoDetalhe {
  const vinculosResponsaveis =
    aluno.aluno_responsavel ?? aluno.alunos_responsaveis ?? [];

  const responsaveisMapeados = vinculosResponsaveis.map((vinculo, index) =>
    mapearResponsavel(vinculo, index, aluno.id)
  );

  const primeiroResponsavel = responsaveisMapeados[0];
  const escolaNome = aluno.escolas?.nome ?? aluno.escola_id ?? "Não informado";

  // Buscar contrato ativo dos dados do aluno
  const contratos = aluno.contratos ?? [];
  const contratoAtivo = contratos.find((c: any) => c.status?.toLowerCase() === "ativo") || contratos[0] || null;

  // Processar dados do contrato se existir
  let contratoData: any = {
    numero: "-",
    inicio: "-",
    fim: "-",
    vencimentoDia: 5,
    formaPagamento: "-",
    observacoes: "Nenhum contrato cadastrado",
  };

  let mensalidadesData: any[] = [];

  if (contratoAtivo) {
    contratoData = {
      numero: contratoAtivo.numero || "-",
      inicio: contratoAtivo.data_inicio?.split("T")[0] || "-",
      fim: contratoAtivo.data_fim?.split("T")[0] || "-",
      vencimentoDia: contratoAtivo.dia_vencimento || 5,
      formaPagamento: contratoAtivo.forma_pagamento || "-",
      observacoes: contratoAtivo.observacoes || "Sem observações",
      id: contratoAtivo.id,
      valor_mensalidade: contratoAtivo.valor_mensalidade,
    };

    // Processar mensalidades se existirem
    if (contratoAtivo.mensalidades && Array.isArray(contratoAtivo.mensalidades)) {
      mensalidadesData = contratoAtivo.mensalidades.map((mensalidade: any) => ({
        id: mensalidade.id,
        valor: mensalidade.valor,
        status: mensalidade.status,
        competencia: mensalidade.competencia,
        data_vencimento: mensalidade.data_vencimento?.split("T")[0],
        data_pagamento: mensalidade.data_pagamento?.split("T")[0],
        forma_pagamento: mensalidade.forma_pagamento,
        observacoes: mensalidade.observacoes,
      }));
    }
  }

  return {
    id: aluno.id,
    nome: aluno.nome,
    foto:
      aluno.foto_url ??
      `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(aluno.nome)}`,
    nascimento: aluno.data_nascimento ?? "-",
    escola: escolaNome,
    serie: aluno.serie ?? "-",
    turno: aluno.turno ?? "-",

    endereco: formatarEndereco(aluno.endereco, aluno.numero, aluno.complemento),
    bairro: aluno.bairro ?? "-",
    cidade: aluno.cidade ?? "-",

    responsaveis: responsaveisMapeados,

    // Dados do responsável principal (fallback plano para compatibilidade com a UI)
    responsavel: primeiroResponsavel?.nome ?? "Responsável não vinculado",
    parentesco: primeiroResponsavel?.parentesco ?? "-",
    telefone: primeiroResponsavel?.telefone ?? "-",
    email: primeiroResponsavel?.email ?? "-",
    enderecoResponsavel: primeiroResponsavel?.endereco ?? "-",
    bairroResponsavel: primeiroResponsavel?.bairro ?? "-",
    cidadeResponsavel: primeiroResponsavel?.cidade ?? "-",

    motorista: "-",
    veiculo: "-",
    rota: aluno.rotas?.nome ?? "-",

    mensalidade: contratoAtivo?.valor_mensalidade || Number(aluno.mensalidade ?? 0),
    status: aluno.status === "inativo" ? "inativo" : "ativo",
    pagamento: "pendente",
    desde: aluno.data_inicio ?? aluno.created_at ?? "-",

    contrato: contratoData,

    mensalidades: mensalidadesData,
    ocorrencias: [],
    historico: gerarHistorico(aluno, vinculosResponsaveis.length),
    documentos: [],
  };
}