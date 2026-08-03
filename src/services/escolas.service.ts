import api from "@/lib/api";



export interface Escola {

  id: string;

  nome: string;

  endereco?: string;

  telefone?: string;

}



export async function listarEscolas(): Promise<Escola[]> {


  const response = await api.get("/escolas");


  console.log(
    "ESCOLAS API:",
    response.data
  );


  return Array.isArray(response.data)

    ? response.data

    : response.data.data || [];


}