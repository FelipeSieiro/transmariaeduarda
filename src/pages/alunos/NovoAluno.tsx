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
  criarAlunoCompleto,
} from "@/services/alunos.service";


import {
  listarResponsaveis,
  type Responsavel,
} from "@/services/responsaveis.service";


import {
  listarEscolas,
  type Escola,
} from "@/services/escolas.service";


import {
  Serie,
  StatusAluno,
  Turma,
  Turno,
} from "@/constants/aluno";





const SERIES = Object.values(Serie);

const TURMAS = Object.values(Turma);

const TURNOS = Object.values(Turno);

const STATUS = Object.values(StatusAluno);





const FORMAS_PAGAMENTO = [

  "PIX",

  "Dinheiro",

  "Cartão",

  "Boleto",

];







type ResponsavelAluno = {


  responsavel_id: string;


  parentesco: string;


  responsavel_financeiro: boolean;


  responsavel_emergencia: boolean;


};









export default function NovoAluno() {



  const navigate = useNavigate();







  const [serie, setSerie] = useState("");

  const [turma, setTurma] = useState("");







  const [responsaveis, setResponsaveis] =

    useState<Responsavel[]>([]);







  const [escolas, setEscolas] =

    useState<Escola[]>([]);







  const [
    responsaveisSelecionados,
    setResponsaveisSelecionados
  ] = useState<ResponsavelAluno[]>([]);








  const [responsavelAtual, setResponsavelAtual] =

    useState<ResponsavelAluno>({

      responsavel_id: "",

      parentesco: "",

      responsavel_financeiro: false,

      responsavel_emergencia: false,

    });









  const [form, setForm] = useState({


    matricula: "",


    nome: "",


    foto_url: "",


    data_nascimento: "",


    data_inicio: "",


    escola_id: "",


    rota_id: "",


    turno: "",


    cidade: "",


    bairro: "",


    endereco: "",


    numero: "",


    complemento: "",


    cep: "",


    status: "ativo",


  });









  const [contrato, setContrato] = useState({


    numero: "",


    data_inicio: "",


    data_fim: "",


    valor_mensalidade: "",


    dia_vencimento: "",


    forma_pagamento: "",


    observacoes: "",


    status: "ativo",


  });









  useEffect(() => {


    Promise.all([


      listarResponsaveis(),


      listarEscolas(),


    ])


      .then(([resp, esc]) => {


        setResponsaveis(resp);


        setEscolas(esc);


      })


      .catch(() => {


        toast.error(

          "Erro ao carregar dados"

        );


      });


  }, []);









  function alterar(

    campo: string,

    valor: string

  ) {


    setForm((prev) => ({

      ...prev,

      [campo]: valor,

    }));


  }









  function alterarContrato(

    campo: string,

    valor: string

  ) {


    setContrato((prev) => ({

      ...prev,

      [campo]: valor,

    }));


  }









  function alterarResponsavel(

    campo: keyof ResponsavelAluno,

    valor: any

  ) {


    setResponsavelAtual((prev) => ({

      ...prev,

      [campo]: valor,

    }));


  }









  function adicionarResponsavel() {


    if (

      !responsavelAtual.responsavel_id

    ) {


      toast.error(

        "Selecione um responsável"

      );


      return;


    }








    const existe =

      responsaveisSelecionados.some(

        (item) =>

          item.responsavel_id ===

          responsavelAtual.responsavel_id

      );





    if (existe) {


      toast.error(

        "Responsável já adicionado"

      );


      return;


    }








    setResponsaveisSelecionados(

      (prev) => [


        ...prev,


        responsavelAtual,


      ]

    );








    setResponsavelAtual({


      responsavel_id: "",


      parentesco: "",


      responsavel_financeiro: false,


      responsavel_emergencia: false,


    });


  }









  function removerResponsavel(

    id:string

  ){


    setResponsaveisSelecionados(

      (prev) =>


        prev.filter(

          (item) =>

            item.responsavel_id !== id

        )

    );


  }









  async function salvar(){



    if(!form.matricula){


      toast.error(

        "Informe a matrícula"

      );


      return;


    }






    if(!form.nome){


      toast.error(

        "Informe o nome"

      );


      return;


    }






    if(!serie || !turma){


      toast.error(

        "Selecione série e turma"

      );


      return;


    }






    if(!form.escola_id){


      toast.error(

        "Selecione a escola"

      );


      return;


    }






    if(

      !responsaveisSelecionados.length

    ){


      toast.error(

        "Adicione um responsável"

      );


      return;


    }








    try {





      const payload = {



        aluno:{



          ...form,



          foto_url:

            form.foto_url ||

            undefined,



          data_nascimento:

            form.data_nascimento ||

            undefined,



          data_inicio:

            form.data_inicio ||

            undefined,



          serie:

            `${serie} - Turma ${turma}`,



        },







        responsaveis:

          responsaveisSelecionados,








        contrato:{



          numero:

            contrato.numero,



          data_inicio:

            contrato.data_inicio,



          data_fim:

            contrato.data_fim ||

            null,



          valor_mensalidade:

            Number(

              contrato.valor_mensalidade

            ),



          dia_vencimento:

            Number(

              contrato.dia_vencimento

            ),



          forma_pagamento:

            contrato.forma_pagamento,



          observacoes:

            contrato.observacoes,



          status:

            contrato.status,



        },



      };







      console.log(

        "PAYLOAD ALUNO COMPLETO",

        payload

      );







      await criarAlunoCompleto(

        payload

      );







      toast.success(

        "Aluno cadastrado com sucesso"

      );







      navigate(

        "/alunos"

      );





    } catch(error){



      console.error(error);



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

        title="Dados pessoais"

        description="Informações básicas do aluno"

      >


        <div className="grid gap-4">



          <div className="grid gap-4 md:grid-cols-3">


            <Input

              placeholder="Matrícula"

              value={form.matricula}

              onChange={(e)=>

                alterar(

                  "matricula",

                  e.target.value

                )

              }

            />






            <Input

              placeholder="Nome completo"

              value={form.nome}

              onChange={(e)=>

                alterar(

                  "nome",

                  e.target.value

                )

              }

            />






            <Input

              placeholder="URL da foto"

              value={form.foto_url}

              onChange={(e)=>

                alterar(

                  "foto_url",

                  e.target.value

                )

              }

            />


          </div>







          <div className="grid gap-4 md:grid-cols-2">


            <Input

              type="date"

              value={form.data_nascimento}

              onChange={(e)=>

                alterar(

                  "data_nascimento",

                  e.target.value

                )

              }

            />






            <Input

              type="date"

              value={form.data_inicio}

              onChange={(e)=>

                alterar(

                  "data_inicio",

                  e.target.value

                )

              }

            />


          </div>


        </div>


      </SectionCard>









      <SectionCard

        title="Dados escolares"

        description="Escola, série, turma e turno"

      >


        <div className="grid gap-4">





          <div className="grid gap-4 md:grid-cols-2">


            <Select

              value={serie}

              onValueChange={setSerie}

            >


              <SelectTrigger>

                <SelectValue

                  placeholder="Selecione a série"

                />

              </SelectTrigger>





              <SelectContent>


                {SERIES.map((item)=>(


                  <SelectItem

                    key={item}

                    value={item}

                  >

                    {item}

                  </SelectItem>


                ))}


              </SelectContent>


            </Select>









            <Select

              value={turma}

              onValueChange={setTurma}

            >


              <SelectTrigger>


                <SelectValue

                  placeholder="Selecione a turma"

                />


              </SelectTrigger>





              <SelectContent>


                {TURMAS.map((item)=>(


                  <SelectItem

                    key={item}

                    value={item}

                  >

                    Turma {item}

                  </SelectItem>


                ))}


              </SelectContent>


            </Select>



          </div>









          <Select

            value={form.turno}

            onValueChange={(v)=>

              alterar(

                "turno",

                v

              )

            }

          >


            <SelectTrigger>


              <SelectValue

                placeholder="Selecione o turno"

              />


            </SelectTrigger>





            <SelectContent>


              {TURNOS.map((item)=>(


                <SelectItem

                  key={item}

                  value={item}

                >

                  {item}

                </SelectItem>


              ))}


            </SelectContent>


          </Select>









          <Select

            value={form.escola_id}

            onValueChange={(v)=>

              alterar(

                "escola_id",

                v

              )

            }

          >


            <SelectTrigger>


              <SelectValue

                placeholder="Selecione a escola"

              />


            </SelectTrigger>





            <SelectContent>


              {escolas.map((item)=>(


                <SelectItem

                  key={item.id}

                  value={item.id}

                >

                  {item.nome}

                </SelectItem>


              ))}


            </SelectContent>


          </Select>







          <Input

            placeholder="UUID da rota"

            value={form.rota_id}

            onChange={(e)=>

              alterar(

                "rota_id",

                e.target.value

              )

            }

          />


        </div>


      </SectionCard>









      <SectionCard

        title="Responsáveis"

        description="Adicione um ou mais responsáveis"

      >


        <div className="grid gap-4">





          <Select

            value={responsavelAtual.responsavel_id}

            onValueChange={(v)=>

              alterarResponsavel(

                "responsavel_id",

                v

              )

            }

          >


            <SelectTrigger>


              <SelectValue

                placeholder="Selecione o responsável"

              />


            </SelectTrigger>





            <SelectContent>


              {responsaveis.map((item)=>(


                <SelectItem

                  key={item.id}

                  value={item.id}

                >

                  {item.nome}

                </SelectItem>


              ))}


            </SelectContent>


          </Select>








          <Input

            placeholder="Parentesco"

            value={responsavelAtual.parentesco}

            onChange={(e)=>

              alterarResponsavel(

                "parentesco",

                e.target.value

              )

            }

          />









          <div className="flex gap-4">



            <label className="flex items-center gap-2">


              <input

                type="checkbox"

                checked={

                  responsavelAtual.responsavel_financeiro

                }

                onChange={(e)=>

                  alterarResponsavel(

                    "responsavel_financeiro",

                    e.target.checked

                  )

                }

              />


              Financeiro


            </label>









            <label className="flex items-center gap-2">


              <input

                type="checkbox"

                checked={

                  responsavelAtual.responsavel_emergencia

                }

                onChange={(e)=>

                  alterarResponsavel(

                    "responsavel_emergencia",

                    e.target.checked

                  )

                }

              />


              Emergência


            </label>


          </div>








          <Button

            type="button"

            onClick={adicionarResponsavel}

          >

            Adicionar responsável

          </Button>









          {

            responsaveisSelecionados.map((item)=>(


              <div

                key={item.responsavel_id}

                className="flex items-center justify-between rounded-lg border p-3"

              >


                <span>


                  {

                    responsaveis.find(

                      (r)=>

                        r.id ===

                        item.responsavel_id

                    )?.nome

                  }


                  {" - "}


                  {item.parentesco}


                </span>





                <Button

                  type="button"

                  variant="destructive"

                  onClick={()=>

                    removerResponsavel(

                      item.responsavel_id

                    )

                  }

                >

                  Remover

                </Button>


              </div>


            ))


          }





        </div>


      </SectionCard>









      <SectionCard

        title="Endereço"

        description="Localização do aluno"

      >


        <div className="grid gap-4">



          <div className="grid gap-4 md:grid-cols-2">


            <Input

              placeholder="Cidade"

              value={form.cidade}

              onChange={(e)=>

                alterar(

                  "cidade",

                  e.target.value

                )

              }

            />






            <Input

              placeholder="Bairro"

              value={form.bairro}

              onChange={(e)=>

                alterar(

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

              onChange={(e)=>

                alterar(

                  "endereco",

                  e.target.value

                )

              }

            />






            <Input

              placeholder="Número"

              value={form.numero}

              onChange={(e)=>

                alterar(

                  "numero",

                  e.target.value

                )

              }

            />






            <Input

              placeholder="CEP"

              value={form.cep}

              onChange={(e)=>

                alterar(

                  "cep",

                  e.target.value

                )

              }

            />


          </div>








          <Input

            placeholder="Complemento"

            value={form.complemento}

            onChange={(e)=>

              alterar(

                "complemento",

                e.target.value

              )

            }

          />


        </div>


      </SectionCard>
            <SectionCard

        title="Contrato"

        description="Dados comerciais do aluno"

      >


        <div className="grid gap-4">





          <Input

            placeholder="Número do contrato"

            value={contrato.numero}

            onChange={(e)=>

              alterarContrato(

                "numero",

                e.target.value

              )

            }

          />









          <div className="grid gap-4 md:grid-cols-2">


            <Input

              type="date"

              value={contrato.data_inicio}

              onChange={(e)=>

                alterarContrato(

                  "data_inicio",

                  e.target.value

                )

              }

            />







            <Input

              type="date"

              value={contrato.data_fim}

              onChange={(e)=>

                alterarContrato(

                  "data_fim",

                  e.target.value

                )

              }

            />


          </div>









          <div className="grid gap-4 md:grid-cols-2">


            <Input

              type="number"

              placeholder="Valor mensalidade"

              value={contrato.valor_mensalidade}

              onChange={(e)=>

                alterarContrato(

                  "valor_mensalidade",

                  e.target.value

                )

              }

            />








            <Input

              type="number"

              placeholder="Dia vencimento"

              value={contrato.dia_vencimento}

              onChange={(e)=>

                alterarContrato(

                  "dia_vencimento",

                  e.target.value

                )

              }

            />


          </div>









          <Select

            value={contrato.forma_pagamento}

            onValueChange={(v)=>

              alterarContrato(

                "forma_pagamento",

                v

              )

            }

          >


            <SelectTrigger>


              <SelectValue

                placeholder="Forma de pagamento"

              />


            </SelectTrigger>







            <SelectContent>


              {FORMAS_PAGAMENTO.map((item)=>(


                <SelectItem

                  key={item}

                  value={item}

                >

                  {item}

                </SelectItem>


              ))}


            </SelectContent>


          </Select>









          <Input

            placeholder="Observações"

            value={contrato.observacoes}

            onChange={(e)=>

              alterarContrato(

                "observacoes",

                e.target.value

              )

            }

          />





        </div>


      </SectionCard>












      <SectionCard

        title="Status"

        description="Controle do cadastro"

      >



        <Select

          value={form.status}

          onValueChange={(v)=>

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


            {STATUS.map((item)=>(


              <SelectItem

                key={item}

                value={item}

              >

                {item}

              </SelectItem>


            ))}


          </SelectContent>


        </Select>



      </SectionCard>









      <Button

        onClick={salvar}

        className="w-full rounded-xl"

      >

        Salvar aluno


      </Button>






    </div>


  );


}