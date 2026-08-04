import api from "@/lib/api";



// ======================================================
// RESPONSÁVEL
// ======================================================


export interface Responsavel {


  id: string;


  nome: string;


  cpf?: string;


  telefone?: string;


  email?: string;


  endereco?: string;


  observacoes?: string;


}









// ======================================================
// MENSALIDADE
// ======================================================


export interface Mensalidade {


  id:string;


  contrato_id:string;


  competencia:string;


  valor:number;


  data_vencimento:string;


  status?:

    | "pendente"

    | "pago"

    | "atrasado"

    | "cancelado"

    | string

    | null;



  data_pagamento?:string | null;


  forma_pagamento?:string | null;


  observacoes?:string | null;


  created_at?:string;


  updated_at?:string;


}









// ======================================================
// CONTRATO
// ======================================================


export interface Contrato {


  id?:string;


  aluno_id?:string;


  numero?:string;


  data_inicio?:string;


  data_fim?:string | null;


  valor_mensalidade?:number;


  dia_vencimento?:number;


  forma_pagamento?:string;


  observacoes?:string;


  status?:string;



  mensalidades?:Mensalidade[];


}









// ======================================================
// ALUNO
// ======================================================


export interface Aluno {


  id:string;


  matricula:string;


  nome:string;


  foto_url?:string | null;


  data_nascimento?:string | null;


  data_inicio?:string | null;


  created_at?:string;


  updated_at?:string;



  escola_id?:string | null;


  escolas?:{


    id:string;


    nome:string;


  } | null;





  serie?:string | null;


  turno?:string | null;





  endereco?:string | null;


  numero?:string | null;


  complemento?:string | null;


  bairro?:string | null;


  cidade?:string | null;


  cep?:string | null;





  rota_id?:string | null;


  rotas?:{


    id:string;


    nome:string;


  } | null;





  status?:string | null;









  // =====================
  // RESPONSÁVEIS
  // =====================


  responsavel?:Responsavel | null;





  aluno_responsavel?:Array<{

    id?:string;


    responsavel_id?:string;


    responsavel?:Responsavel;


    parentesco?:string;


    responsavel_financeiro?:boolean;


    responsavel_emergencia?:boolean;


  }>;









  alunos_responsaveis?:Array<{

    responsavel_id?:string;


    responsavel?:Responsavel;


    parentesco?:string;


  }>;









  // =====================
  // CONTRATOS
  // retorno do backend:
  //
  // contratos:[
  //   {
  //     id,
  //     mensalidades:[]
  //   }
  // ]
  // =====================


  contratos?:Array<Contrato>;





  // Compatibilidade
  // com telas antigas


  contrato?:Contrato;





  // Compatibilidade
  // com mocks antigos


  mensalidades?:Mensalidade[];





}









// ======================================================
// CADASTRO NORMAL
// ======================================================


export async function criarAluno(

  aluno:Partial<Aluno>

){


  const response =

    await api.post(

      "/alunos",

      aluno

    );



  return response.data.data as Aluno;


}









// ======================================================
// CADASTRO COMPLETO
// ALUNO + RESPONSÁVEIS + CONTRATO
// ======================================================


export interface CadastroAlunoCompleto {


  aluno:

    Partial<Aluno>;





  responsaveis:Array<{

    responsavel_id:string;


    parentesco?:string;


    responsavel_financeiro?:boolean;


    responsavel_emergencia?:boolean;


  }>;






  contrato?:Contrato;



}









export async function criarAlunoCompleto(

  payload:CadastroAlunoCompleto

){


  const response =

    await api.post(

      "/alunos/completo",

      payload

    );



  return response.data.data as Aluno;


}









// ======================================================
// LISTAR ALUNOS
// ======================================================


export async function listarAlunos(){


  const response =

    await api.get(

      "/alunos"

    );



  return response.data.data as Aluno[];


}









// ======================================================
// BUSCAR ALUNO
// ======================================================


export async function buscarAluno(

  id:string

){


  const response =

    await api.get(

      `/alunos/${id}`

    );





  console.log(

    "ALUNO API:",

    response.data.data

  );





  const aluno =

    response.data.data as Aluno;





  // Compatibilidade

  // transforma contratos[0]

  // em contrato


  if(

    aluno.contratos &&

    aluno.contratos.length

  ){


    aluno.contrato =

      aluno.contratos[0];


    aluno.mensalidades =

      aluno.contratos[0]

      .mensalidades ?? [];


  }






  return aluno;


}









// ======================================================
// ATUALIZAR ALUNO
// ======================================================


export async function atualizarAluno(

  id:string,

  aluno:Partial<Aluno>

){


  const response =

    await api.put(

      `/alunos/${id}`,

      aluno

    );



  return response.data.data as Aluno;


}









// ======================================================
// REMOVER ALUNO
// ======================================================


export async function removerAluno(

  id:string

){


  const response =

    await api.delete(

      `/alunos/${id}`

    );



  return response.data;


}