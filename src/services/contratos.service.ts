import api from "@/lib/api";



export interface Contrato {


  id: string;


  aluno_id: string;


  numero: string;


  data_inicio: string;


  data_fim: string | null;


  valor_mensalidade: number;


  dia_vencimento: number;


  forma_pagamento: string;


  observacoes: string;


  status: string;


  created_at?: string;


  updated_at?: string;




  alunos?: {


    id: string;


    nome: string;


    matricula: string;


    serie: string;


    turno: string;


    status: string;



    escolas?: {


      id: string;


      nome: string;


    };



    rotas?: {


      id: string;


      nome: string;


    };



  };


}









export interface CriarContratoPayload {


  aluno_id: string;


  numero: string;


  data_inicio: string;


  data_fim?: string | null;


  valor_mensalidade: number;


  dia_vencimento: number;


  forma_pagamento: string;


  observacoes?: string;


  status: string;


}









/**
 * Lista todos os contratos
 */
export async function listarContratos(): Promise<Contrato[]> {


  const response =
    await api.get("/contratos");



  return response.data.data;


}









/**
 * Busca contrato pelo ID
 */
export async function buscarContrato(
  id: string
): Promise<Contrato | null> {


  const response =
    await api.get(
      `/contratos/${id}`
    );



  return response.data.data ?? null;


}









/**
 * Busca contrato pelo aluno
 */
export async function buscarContratoPorAluno(
  alunoId: string
): Promise<Contrato | null> {


  const response =
    await api.get(
      "/contratos",
      {
        params: {
          aluno_id: alunoId,
        },
      }
    );



  const contratos =
    response.data.data;



  if (
    !contratos ||
    contratos.length === 0
  ) {

    return null;

  }



  return contratos[0];


}









/**
 * Cria novo contrato
 */
export async function criarContrato(
  payload: CriarContratoPayload
): Promise<Contrato> {


  const response =
    await api.post(
      "/contratos",
      payload
    );



  return response.data.data;


}