import { useState } from "react";
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
  criarResponsavel
} from "@/services/responsaveis.service";





const PARENTESCOS = [

  "Pai",

  "Mãe",

  "Avô",

  "Avó",

  "Tio",

  "Tia",

  "Irmão",

  "Irmã",

  "Responsável legal",

  "Outro"

];







export default function NovoResponsavel(){


  const navigate = useNavigate();



  const [form,setForm] = useState({

    nome:"",

    cpf:"",

    telefone:"",

    email:"",

    parentesco:""


  });







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
          "Informe o nome do responsável"
        );


        return;


      }





      await criarResponsavel(form);





      toast.success(
        "Responsável cadastrado com sucesso"
      );





      navigate("/responsaveis");




    }catch(error){



      console.error(error);



      toast.error(
        "Erro ao cadastrar responsável"
      );



    }


  }









return (

<div className="mx-auto max-w-4xl space-y-6">


<h1 className="text-3xl font-semibold">

Novo responsável

</h1>






<SectionCard

title="Dados do responsável"

description="Cadastro de responsável financeiro e contato autorizado"

>




<div className="grid gap-4">





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







<Input

placeholder="CPF"

value={form.cpf}

onChange={
e=>alterar(
"cpf",
e.target.value
)
}

/>







<Input

placeholder="Telefone"

value={form.telefone}

onChange={
e=>alterar(
"telefone",
e.target.value
)
}

/>







<Input

placeholder="Email"

type="email"

value={form.email}

onChange={
e=>alterar(
"email",
e.target.value
)
}

/>









<Select

value={form.parentesco}

onValueChange={
valor=>alterar(
"parentesco",
valor
)
}

>


<SelectTrigger className="rounded-xl">

<SelectValue placeholder="Selecione o parentesco"/>

</SelectTrigger>





<SelectContent>


{
PARENTESCOS.map(item=>(


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

Salvar responsável

</Button>





</div>





</SectionCard>





</div>


);


}