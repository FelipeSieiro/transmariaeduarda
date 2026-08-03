import type { Aluno as AlunoApi } from "@/services/alunos.service";
import type { Aluno as AlunoMock } from "@/data/mock";



export function adaptarAlunoDetalhe(
  aluno: AlunoApi
): AlunoMock {



  const vinculoResponsavel =
    aluno.aluno_responsavel?.[0] ??
    aluno.alunos_responsaveis?.[0];



  const responsavelId =
    aluno.responsavel_id ??
    vinculoResponsavel?.responsavel_id ??
    null;



  /**
   * API retorna:
   *
   * aluno_responsavel:[
   *   {
   *     parentesco:"Pai",
   *     responsaveis:{
   *       nome:"Jonas"
   *     }
   *   }
   * ]
   *
   * então precisa acessar responsaveis
   */
  const responsavel =
    aluno.responsavel ??
    vinculoResponsavel?.responsaveis ??
    null;







  return {



    id:
      aluno.id,



    nome:
      aluno.nome,



    foto:

      aluno.foto_url ??

      `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(aluno.nome)}`,





    nascimento:

      aluno.data_nascimento ??

      "-",





    escola:

      aluno.escola ??
      aluno.escolas?.nome ??
      aluno.escola_id ??
      "Não informado",





    serie:

      aluno.serie ??

      "-",





    turno:

      aluno.turno ??

      "-",





    bairro:

      aluno.bairro ??

      "-",






    endereco:

      [
        aluno.endereco,
        aluno.numero,
        aluno.complemento
      ]
      .filter(Boolean)
      .join(", "),






    cidade:

      aluno.cidade ??

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


    motorista:

      "-",





    veiculo:

      "-",





    rota:

      aluno.rotas?.nome ??

      "-",







    // ===============================
    // FINANCEIRO
    // ===============================


    mensalidade:

      Number(
        aluno.mensalidade ?? 0
      ),






    status:

      aluno.status === "inativo"

      ?

      "inativo"

      :

      "ativo",






    pagamento:

      "pendente",






    desde:

      aluno.data_inicio ??

      aluno.created_at ??

      "-",







    // ===============================
    // CONTRATO
    // ===============================


    contrato:{



      numero:

        `API-${aluno.id.substring(0,8)}`,




      inicio:

        aluno.data_inicio ??

        "-",




      fim:

        "-",




      vencimentoDia:

        5,




      formaPagamento:

        "-",




      observacoes:

        "Contrato carregado pela API"


    },







    mensalidades:

      [],






    ocorrencias:

      [],






    historico:



      [

        {

          data:

            aluno.created_at ??

            "-",



          evento:

            "Aluno cadastrado via sistema"


        },


        ...(vinculoResponsavel

          ?

            [

              {

                data:

                  aluno.created_at ??

                  "-",


                evento:

                  "Responsável vinculado ao aluno"


              }

            ]

          :

            []

        )


      ],






    documentos:

      []



  };



}