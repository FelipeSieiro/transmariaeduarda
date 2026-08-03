import api from "@/lib/api";



export interface Responsavel {


  id:string;


  nome:string;


  cpf?:string;


  telefone?:string;


  email?:string;


  parentesco?:string;


}







export interface Aluno {



  id:string;



  matricula:string;



  nome:string;



  foto_url?:string;



  data_nascimento?:string;



  data_inicio?:string;



  created_at?:string;





  escola_id?:string;



  escolas?: {

    id:string;

    nome:string;

  } | null;





  serie?:string;



  turno?:string;





  endereco?:string;



  numero?:string;



  complemento?:string;



  bairro?:string;



  cidade?:string;



  cep?:string;





  rota_id?:string;



  rotas?: {

    id:string;

    nome:string;

  } | null;





  status?:string;







  // =====================
  // RESPONSÁVEIS
  // =====================



  responsavel_id?:string;



  responsavel?:Responsavel | null;



  aluno_responsavel?: Array<{

    responsavel: Responsavel;

  }>;







  // =====================
  // CAMPOS FINANCEIROS
  // =====================



  mensalidade?:number;





}









export async function listarAlunos(){


  const response =
    await api.get("/alunos");



  return response.data.data as Aluno[];


}









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



  return response.data.data as Aluno;


}









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









export async function removerAluno(
  id:string
){


  const response =
    await api.delete(
      `/alunos/${id}`
    );



  return response.data;


}