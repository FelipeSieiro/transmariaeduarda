import {
  useEffect,
  useState
} from "react";


import {
  useNavigate
} from "react-router-dom";


import {
  toast
} from "sonner";


import {
  Button
} from "@/components/ui/button";


import {
  Input
} from "@/components/ui/input";


import {
  SectionCard
} from "@/components/ui-kit/primitives";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


import {
  listarAlunos,
  type Aluno
} from "@/services/alunos.service";


import {
  criarContrato
} from "@/services/contratos.service";








const STATUS = [

  "ativo",
  "inativo",
  "encerrado"

];





const FORMAS_PAGAMENTO = [

  "PIX",
  "Dinheiro",
  "Cartão",
  "Boleto"

];









export default function NovoContrato(){



  const navigate =
    useNavigate();





  const [
    alunos,
    setAlunos
  ] = useState<Aluno[]>([]);





  const [
    alunoId,
    setAlunoId
  ] = useState("");





  const [
    form,
    setForm
  ] = useState({


    numero:"",


    data_inicio:"",


    data_fim:"",


    valor_mensalidade:"",


    dia_vencimento:"",


    forma_pagamento:"",


    observacoes:"",


    status:"ativo"


  });









  useEffect(()=>{


    async function carregar(){


      try{


        const dados =
          await listarAlunos();



        setAlunos(
          dados
        );


      }catch(error){


        console.error(error);


        toast.error(
          "Erro ao carregar alunos"
        );


      }


    }




    carregar();



  },[]);









  function alterar(
    campo:string,
    valor:string
  ){


    setForm(
      prev => ({

        ...prev,

        [campo]:valor

      })
    );


  }









  async function salvar(){



    try{



      if(!alunoId){


        toast.error(
          "Selecione o aluno"
        );


        return;


      }






      const payload = {


        aluno_id:
          alunoId,



        numero:
          form.numero,



        data_inicio:
          form.data_inicio,



        data_fim:
          form.data_fim || null,



        valor_mensalidade:
          Number(
            form.valor_mensalidade
          ),



        dia_vencimento:
          Number(
            form.dia_vencimento
          ),



        forma_pagamento:
          form.forma_pagamento,



        observacoes:
          form.observacoes,



        status:
          form.status


      };






      console.log(
        "NOVO CONTRATO:",
        payload
      );







      await criarContrato(
        payload
      );





      toast.success(
        "Contrato criado com sucesso"
      );





      navigate(
        "/contratos"
      );




    }catch(error){



      console.error(
        error
      );


      toast.error(
        "Erro ao criar contrato"
      );


    }



  }








  return (

    <div className="mx-auto max-w-5xl space-y-6">


      <h1 className="text-3xl font-semibold">

        Novo contrato

      </h1>






      <SectionCard

        title="Dados do contrato"

        description="Cadastro comercial do aluno"

      >



        <div className="grid gap-4">







          <Select

            value={alunoId}

            onValueChange={
              setAlunoId
            }

          >

            <SelectTrigger>

              <SelectValue
                placeholder="Selecione o aluno"
              />

            </SelectTrigger>


            <SelectContent>


              {
                alunos.map(
                  aluno => (

                    <SelectItem

                      key={aluno.id}

                      value={aluno.id}

                    >

                      {aluno.nome}


                    </SelectItem>

                  )
                )
              }


            </SelectContent>


          </Select>








          <Input

            placeholder="Número do contrato"

            value={
              form.numero
            }

            onChange={
              e =>
                alterar(
                  "numero",
                  e.target.value
                )
            }

          />









          <div className="grid gap-4 md:grid-cols-2">


            <Input

              type="date"

              value={
                form.data_inicio
              }

              onChange={
                e =>
                  alterar(
                    "data_inicio",
                    e.target.value
                  )
              }

            />



            <Input

              type="date"

              value={
                form.data_fim
              }

              onChange={
                e =>
                  alterar(
                    "data_fim",
                    e.target.value
                  )
              }

            />


          </div>









          <div className="grid gap-4 md:grid-cols-3">


            <Input

              placeholder="Valor mensalidade"

              type="number"

              value={
                form.valor_mensalidade
              }

              onChange={
                e =>
                  alterar(
                    "valor_mensalidade",
                    e.target.value
                  )
              }

            />





            <Input

              placeholder="Dia vencimento"

              type="number"

              value={
                form.dia_vencimento
              }

              onChange={
                e =>
                  alterar(
                    "dia_vencimento",
                    e.target.value
                  )
              }

            />




          </div>








          <Select

            value={
              form.forma_pagamento
            }

            onValueChange={
              v =>
                alterar(
                  "forma_pagamento",
                  v
                )
            }

          >

            <SelectTrigger>

              <SelectValue
                placeholder="Forma pagamento"
              />

            </SelectTrigger>



            <SelectContent>


              {
                FORMAS_PAGAMENTO.map(
                  item => (

                    <SelectItem

                      key={item}

                      value={item}

                    >

                      {item}

                    </SelectItem>

                  )
                )
              }


            </SelectContent>


          </Select>








          <Select

            value={
              form.status
            }

            onValueChange={
              v =>
                alterar(
                  "status",
                  v
                )
            }

          >

            <SelectTrigger>

              <SelectValue
                placeholder="Status"
              />

            </SelectTrigger>



            <SelectContent>


              {
                STATUS.map(
                  item => (

                    <SelectItem

                      key={item}

                      value={item}

                    >

                      {item}

                    </SelectItem>

                  )
                )
              }


            </SelectContent>


          </Select>








          <Input

            placeholder="Observações"

            value={
              form.observacoes
            }

            onChange={
              e =>
                alterar(
                  "observacoes",
                  e.target.value
                )
            }

          />








          <Button

            onClick={
              salvar
            }

            className="rounded-xl"

          >

            Salvar contrato

          </Button>





        </div>



      </SectionCard>




    </div>

  );


}