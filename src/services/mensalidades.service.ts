import api from "@/lib/api";


export interface Mensalidade {


  id:string;


  contrato_id:string;


  competencia:string;


  valor:number;


  data_vencimento:string;


  status:
    | "pendente"
    | "pago"
    | "atrasado"
    | "cancelado"
    | string
    | null;



  data_pagamento?:string | null;


  forma_pagamento?:string | null;


  observacoes?:string | null;



}




// ======================================================
// LISTAR MENSALIDADES DO CONTRATO
// ======================================================

export async function listarMensalidadesContrato(

  contratoId:string

){


  const response = await api.get(

    `/mensalidades/contrato/${contratoId}`

  );



  return response.data.data as Mensalidade[];


}