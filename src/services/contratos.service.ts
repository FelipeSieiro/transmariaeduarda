import api from "@/lib/api";



export interface Contrato {


  id:string;


  aluno_id:string;


  numero:string;


  data_inicio:string;


  data_fim?:string | null;


  valor_mensalidade:number;


  dia_vencimento:number;


  forma_pagamento?:string | null;


  observacoes?:string | null;


  status?:string | null;


  alunos?:{


    id:string;


    nome:string;


    matricula:string;


    escolas?:{


      id:string;

      nome:string;


    } | null;



    rotas?:{


      id:string;

      nome:string;


    } | null;


  } | null;


}







export async function listarContratos(){


  const response =
    await api.get("/contratos");



  return response.data.data as Contrato[];


}








export async function buscarContrato(
  id:string
){


  const response =
    await api.get(
      `/contratos/${id}`
    );



  return response.data.data as Contrato;


}








export async function criarContrato(
  contrato:Partial<Contrato>
){


  const response =
    await api.post(
      "/contratos",
      contrato
    );



  return response.data.data as Contrato;


}








export async function atualizarContrato(
  id:string,
  contrato:Partial<Contrato>
){


  const response =
    await api.put(
      `/contratos/${id}`,
      contrato
    );



  return response.data.data as Contrato;


}








export async function removerContrato(
  id:string
){


  const response =
    await api.delete(
      `/contratos/${id}`
    );



  return response.data;


}