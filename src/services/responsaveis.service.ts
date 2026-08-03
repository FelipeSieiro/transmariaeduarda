import api from "@/lib/api";


export interface Responsavel {

  id: string;

  nome: string;

  cpf?: string;

  telefone?: string;

  email?: string;

  endereco?: string;

  observacoes?: string;

}



export async function listarResponsaveis(){

  const response = await api.get("/responsaveis");

  return response.data.data as Responsavel[];

}



export async function buscarResponsavel(id:string){

  const response = await api.get(
    `/responsaveis/${id}`
  );

  return response.data.data as Responsavel;

}



export async function criarResponsavel(
  responsavel:Partial<Responsavel>
){

  const response = await api.post(
    "/responsaveis",
    responsavel
  );

  const data = response.data.data;

  return (Array.isArray(data) ? data[0] : data) as Responsavel;

}



export async function atualizarResponsavel(
  id:string,
  responsavel:Partial<Responsavel>
){

  const response = await api.put(
    `/responsaveis/${id}`,
    responsavel
  );


  return response.data.data as Responsavel;

}



export async function removerResponsavel(id:string){

  const response = await api.delete(
    `/responsaveis/${id}`
  );


  return response.data;

}