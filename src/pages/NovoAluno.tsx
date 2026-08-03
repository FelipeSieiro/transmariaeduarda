import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionCard } from "@/components/ui-kit/primitives";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  criarAluno
} from "@/services/alunos.service";


import {
  listarResponsaveis,
  type Responsavel
} from "@/services/responsaveis.service";




const SERIES = [

  "1º Fundamental",
  "2º Fundamental",
  "3º Fundamental",
  "4º Fundamental",
  "5º Fundamental",
  "6º Fundamental",
  "7º Fundamental",
  "8º Fundamental",
  "9º Fundamental",
  "1º Médio",
  "2º Médio",
  "3º Médio",

];



const TURMAS = Array.from(
  { length: 26 },
  (_, i) => String.fromCharCode(65 + i)
);



const TURNOS = [

  "Manhã",
  "Tarde",
  "Integral"

];



const STATUS = [

  "ativo",
  "inativo"

];





export default function NovoAluno(){



  const navigate = useNavigate();




  const [serie,setSerie] = useState("");

  const [turma,setTurma] = useState("");




  const [responsaveis,setResponsaveis] =
    useState<Responsavel[]>([]);



  const [responsavelId,setResponsavelId] =
    useState("");







  const [form,setForm] = useState({

    matricula:"",

    nome:"",

    data_nascimento:"",

    escola:"",

    motorista:"",

    turno:"",

    cidade:"",

    bairro:"",

    endereco:"",

    numero:"",

    complemento:"",

    cep:"",

    mensalidade:"",

    status:"ativo"

  });







  useEffect(()=>{


    async function carregarResponsaveis(){


      try{


        const dados =
          await listarResponsaveis();



        setResponsaveis(dados);



      }catch(error){


        console.error(error);



        toast.error(
          "Erro ao carregar responsáveis"
        );


      }


    }




    carregarResponsaveis();



  },[]);







  function alterar(
    campo:string,
    valor:string
  ){


    setForm(prev=>({


      ...prev,


      [campo]:valor


    }));


  }







 async function salvar(){

  try{


    if(!form.nome){

      toast.error(
        "Informe o nome do aluno"
      );

      return;

    }



    if(!serie){

      toast.error(
        "Selecione a série"
      );

      return;

    }




    if(!turma){

      toast.error(
        "Selecione a turma"
      );

      return;

    }





    const aluno = {


      matricula:
        form.matricula,



      nome:
        form.nome,



      data_nascimento:
        form.data_nascimento || null,



      serie:
        `${serie} - Turma ${turma}`,



      turno:
        form.turno,



      endereco:
        form.endereco,



      numero:
        form.numero,



      complemento:
        form.complemento,



      bairro:
        form.bairro,



      cidade:
        form.cidade,



      cep:
        form.cep,



      status:
        form.status,



      mensalidade:
        Number(
          form.mensalidade || 0
        ),



      /*
        relacionamento correto
      */

      aluno_responsavel:

        responsavelId

        ? [

            {

              responsavel_id:
                responsavelId

            }

          ]

        : []



    };





    console.log(
      "NOVO ALUNO PAYLOAD:",
      aluno
    );





    await criarAluno(aluno);





    toast.success(
      "Aluno cadastrado com sucesso"
    );





    navigate("/alunos");



  }catch(error){


    console.error(
      "ERRO CADASTRAR ALUNO:",
      error
    );



    toast.error(
      "Erro ao cadastrar aluno"
    );


  }


}

  return (

<div className="mx-auto max-w-5xl space-y-6">



<h1 className="text-3xl font-semibold">
Novo aluno
</h1>





<SectionCard

title="Dados do aluno"

description="Cadastro completo do aluno"

>



<div className="grid gap-4">





<div className="grid gap-4 md:grid-cols-2">



<Input

placeholder="Matrícula"

value={form.matricula}

onChange={
e=>alterar(
"matricula",
e.target.value
)
}

/>





<Input

type="date"

value={form.data_nascimento}

onChange={
e=>alterar(
"data_nascimento",
e.target.value
)
}

/>



</div>







<Input

placeholder="Nome completo"

value={form.nome}

onChange={
e=>alterar(
"nome",
e.target.value
)
}

/>









<div className="grid gap-4 md:grid-cols-2">



<Select

value={serie}

onValueChange={setSerie}

>


<SelectTrigger>

<SelectValue placeholder="Selecione a série"/>

</SelectTrigger>


<SelectContent>


{
SERIES.map(item=>(

<SelectItem

key={item}

value={item}

>

{item}

</SelectItem>

))

}


</SelectContent>


</Select>







<Select

value={turma}

onValueChange={setTurma}

>


<SelectTrigger>

<SelectValue placeholder="Selecione a turma"/>

</SelectTrigger>


<SelectContent>


{
TURMAS.map(item=>(

<SelectItem

key={item}

value={item}

>

Turma {item}

</SelectItem>

))

}


</SelectContent>


</Select>



</div>









<Select

value={responsavelId}

onValueChange={setResponsavelId}

>


<SelectTrigger>

<SelectValue placeholder="Selecione o responsável"/>

</SelectTrigger>



<SelectContent>



{
responsaveis.map(item=>(


<SelectItem

key={item.id}

value={item.id}

>


{item.nome}


{
item.cpf &&
` - CPF: ${item.cpf}`
}


</SelectItem>


))

}



</SelectContent>



</Select>









<Select

value={form.turno}

onValueChange={
v=>alterar(
"turno",
v
)
}

>


<SelectTrigger>

<SelectValue placeholder="Turno"/>

</SelectTrigger>


<SelectContent>


{
TURNOS.map(item=>(

<SelectItem

key={item}

value={item}

>

{item}

</SelectItem>

))

}


</SelectContent>


</Select>









<Input

placeholder="Escola"

value={form.escola}

onChange={
e=>alterar(
"escola",
e.target.value
)
}

/>








<Input

placeholder="Motorista"

value={form.motorista}

onChange={
e=>alterar(
"motorista",
e.target.value
)
}

/>







<div className="grid gap-4 md:grid-cols-2">



<Input

placeholder="Cidade"

value={form.cidade}

onChange={
e=>alterar(
"cidade",
e.target.value
)
}

/>





<Input

placeholder="Bairro"

value={form.bairro}

onChange={
e=>alterar(
"bairro",
e.target.value
)
}

/>



</div>







<div className="grid gap-4 md:grid-cols-3">


<Input

placeholder="Endereço"

value={form.endereco}

onChange={
e=>alterar(
"endereco",
e.target.value
)
}

/>





<Input

placeholder="Número"

value={form.numero}

onChange={
e=>alterar(
"numero",
e.target.value
)
}

/>





<Input

placeholder="CEP"

value={form.cep}

onChange={
e=>alterar(
"cep",
e.target.value
)
}

/>


</div>









<Input

placeholder="Complemento"

value={form.complemento}

onChange={
e=>alterar(
"complemento",
e.target.value
)
}

/>








<Input

placeholder="Mensalidade"

type="number"

value={form.mensalidade}

onChange={
e=>alterar(
"mensalidade",
e.target.value
)
}

/>









<Select

value={form.status}

onValueChange={
v=>alterar(
"status",
v
)
}

>


<SelectTrigger>

<SelectValue placeholder="Status"/>

</SelectTrigger>



<SelectContent>


{
STATUS.map(item=>(


<SelectItem

key={item}

value={item}

>

{item}

</SelectItem>


))

}


</SelectContent>


</Select>






<Button

onClick={salvar}

className="rounded-xl"

>

Salvar aluno

</Button>





</div>



</SectionCard>



</div>

);


}