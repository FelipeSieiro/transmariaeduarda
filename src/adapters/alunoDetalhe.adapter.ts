import type { Aluno as AlunoApi } from "@/services/alunos.service";
import type { Aluno as AlunoMock } from "@/data/mock";

export function adaptarAlunoDetalhe(
    aluno: AlunoApi
): AlunoMock {
    const vinculoResponsavel =
        aluno.aluno_responsavel?.[0] ??
        aluno.alunos_responsaveis?.[0];

    const responsavelId =
        (aluno as any).responsavel_id ??
        vinculoResponsavel?.responsavel_id ??
        null;

    const responsavel =
        aluno.responsavel ??
        vinculoResponsavel?.responsaveis ??
        vinculoResponsavel?.responsavel ??
        null;

    console.log("RESPONSÁVEL:", responsavel);

    // ===============================
    // ENDEREÇO DO ALUNO
    // ===============================

    const enderecoAluno = [
        aluno.endereco,
        aluno.numero,
        aluno.complemento,
    ]
        .filter(Boolean)
        .join(", ");

    // ===============================
    // ENDEREÇO DO RESPONSÁVEL
    // (será utilizado quando a API passar
    // a retornar esses campos)
    // ===============================

    const enderecoResponsavel = [
        responsavel?.endereco,
        responsavel?.numero,
        responsavel?.complemento,
    ]
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

        nascimento:
            aluno.data_nascimento ??
            "-",

        escola:
            (aluno as any).escola ??
            aluno.escolas?.nome ??
            aluno.escola_id ??
            "Não informado",

        serie:
            aluno.serie ??
            "-",

        turno:
            aluno.turno ??
            "-",

        // ===============================
        // ENDEREÇO DO ALUNO
        // ===============================

        endereco:
            enderecoAluno || "-",

        bairro:
            aluno.bairro ??
            "-",

        cidade:
            aluno.cidade ??
            "-",

        // ===============================
        // ENDEREÇO DO RESPONSÁVEL
        // (adicione estes campos ao type
        // Aluno do mock)
        // ===============================

        enderecoResponsavel:
            enderecoResponsavel || "-",

        bairroResponsavel:
            responsavel?.bairro ??
            "-",

        cidadeResponsavel:
            responsavel?.cidade ??
            "-",

        // ===============================
        // RESPONSÁVEL
        // ===============================

        responsavel:
            responsavel?.nome ??
            responsavelId ??
            "Responsável não vinculado",

        parentesco:
            vinculoResponsavel?.parentesco ??
            "-",

        telefone:
            responsavel?.telefone ??
            "-",

        email:
            responsavel?.email ??
            "-",

        // ===============================
        // TRANSPORTE
        // ===============================

        motorista: "-",

        veiculo: "-",

        rota:
            aluno.rotas?.nome ??
            "-",

        // ===============================
        // FINANCEIRO
        // ===============================

        mensalidade:
            Number(aluno.mensalidade ?? 0),

        status:
            aluno.status === "inativo"
                ? "inativo"
                : "ativo",

        pagamento:
            "pendente",

        desde:
            aluno.data_inicio ??
            aluno.created_at ??
            "-",

        // ===============================
        // CONTRATO
        // ===============================

        contrato: {
            numero: `API-${aluno.id.substring(0, 8)}`,

            inicio:
                aluno.data_inicio ??
                "-",

            fim: "-",

            vencimentoDia: 5,

            formaPagamento: "-",

            observacoes:
                "Contrato carregado pela API",
        },

        mensalidades: [],

        ocorrencias: [],

        historico: [
            {
                data:
                    aluno.created_at ??
                    "-",

                evento:
                    "Aluno cadastrado via sistema",
            },

            ...(vinculoResponsavel
                ? [
                    {
                        data:
                            aluno.created_at ??
                            "-",

                        evento:
                            "Responsável vinculado ao aluno",
                    },
                ]
                : []),
        ],

        documentos: [],
    } as AlunoMock;
}