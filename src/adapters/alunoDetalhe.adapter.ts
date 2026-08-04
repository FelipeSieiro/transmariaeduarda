import type { Aluno as AlunoApi } from "@/services/alunos.service";
import type { Aluno as AlunoMock } from "@/data/mock";

export function adaptarAlunoDetalhe(aluno: AlunoApi): AlunoMock {
  const vinculosResponsaveis =
    aluno.aluno_responsavel ?? aluno.alunos_responsaveis ?? [];

  const responsaveisMapeados = vinculosResponsaveis.map((vinculo: any) => {
    const respObj = vinculo.responsaveis ?? vinculo.responsavel ?? {};

    const enderecoFormatado = [
      respObj.endereco,
      respObj.numero,
      respObj.complemento,
    ]
      .filter(Boolean)
      .join(", ");

    return {
      id: respObj.id ?? String(Math.random()),
      nome: respObj.nome ?? "Responsável sem nome",
      email: respObj.email ?? "-",
      telefone: respObj.telefone ?? "-",
      parentesco: vinculo.parentesco ?? "Responsável",
      responsavel_financeiro: Boolean(vinculo.responsavel_financeiro),
      responsavel_emergencia: Boolean(vinculo.responsavel_emergencia),
      endereco: enderecoFormatado || "-",
      bairro: respObj.bairro ?? "-",
      cidade: respObj.cidade ?? "-",
    };
  });

  const primeiroResponsavel = responsaveisMapeados[0];

  const enderecoAluno = [aluno.endereco, aluno.numero, aluno.complemento]
    .filter(Boolean)
    .join(", ");

  return {
    id: aluno.id,
    nome: aluno.nome,

    foto:
      aluno.foto_url ??
      `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(
        aluno.nome
      )}`,

    nascimento: aluno.data_nascimento ?? "-",

    escola:
      (aluno as any).escola ??
      aluno.escolas?.nome ??
      aluno.escola_id ??
      "Não informado",

    serie: aluno.serie ?? "-",
    turno: aluno.turno ?? "-",

    endereco: enderecoAluno || "-",
    bairro: aluno.bairro ?? "-",
    cidade: aluno.cidade ?? "-",

    responsaveis: responsaveisMapeados,

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

    mensalidade: Number(aluno.mensalidade ?? 0),
    status: aluno.status === "inativo" ? "inativo" : "ativo",
    pagamento: "pendente",
    desde: aluno.data_inicio ?? aluno.created_at ?? "-",

    contrato: {
      numero: `API-${aluno.id.substring(0, 8)}`,
      inicio: aluno.data_inicio ?? "-",
      fim: "-",
      vencimentoDia: 5,
      formaPagamento: "-",
      observacoes: "Contrato carregado pela API",
    },

    mensalidades: [],
    ocorrencias: [],

    historico: [
      {
        data: aluno.created_at ?? "-",
        evento: "Aluno cadastrado via sistema",
      },
      ...(vinculosResponsaveis.length > 0
        ? [
            {
              data: aluno.created_at ?? "-",
              evento: `${vinculosResponsaveis.length} responsável(eis) vinculado(s) ao aluno`,
            },
          ]
        : []),
    ],

    documentos: [],
  } as AlunoMock;
}