import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  Download,
  Filter,
  GraduationCap,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
} from "lucide-react";

import { toast } from "sonner";

import { EmptyState, SectionCard, StatusPill } from "@/components/ui-kit/primitives";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


import {
  listarAlunos,
  removerAluno,
  type Aluno
} from "@/services/alunos.service";



const PAGE_SIZE = 8;

const TODOS = "__todos__";



export default function Alunos() {


  const [alunos, setAlunos] = useState<Aluno[]>([]);

  const navigate = useNavigate();

  const [busca, setBusca] = useState("");

  const [status, setStatus] = useState(TODOS);

  const [ordem, setOrdem] = useState<"nome" | "id">("nome");

  const [pagina, setPagina] = useState(1);



  useEffect(() => {


    async function carregar() {

      try {

        const dados = await listarAlunos();

        setAlunos(dados);


      } catch (error) {

        console.error(
          "Erro ao buscar alunos",
          error
        );

        toast.error(
          "Erro ao carregar alunos"
        );

      }


    }


    carregar();


  }, []);


  async function excluirAluno(id: string) {
    if (!window.confirm("Tem certeza que deseja excluir este aluno?")) {
      return;
    }

    try {
      await removerAluno(id);
      setAlunos((prev) => prev.filter((aluno) => aluno.id !== id));
      toast.success("Aluno excluído com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir aluno");
    }
  }





  const filtrados = useMemo(() => {


    const q = busca
      .toLowerCase()
      .trim();



    const resultado = alunos.filter((aluno) => {


      const pesquisa =
        !q ||
        aluno.nome
          .toLowerCase()
          .includes(q)
        ||
        aluno.matricula
          .toLowerCase()
          .includes(q);



      return (
        pesquisa &&
        (
          status === TODOS ||
          aluno.status === status
        )
      );


    });



    return resultado.sort((a, b) => {


      if (ordem === "nome") {

        return a.nome.localeCompare(
          b.nome
        );

      }


      return a.id.localeCompare(
        b.id
      );


    });



  }, [
    alunos,
    busca,
    status,
    ordem
  ]);






  const totalPaginas =
    Math.max(
      1,
      Math.ceil(
        filtrados.length / PAGE_SIZE
      )
    );



  const paginaAtual =
    Math.min(
      pagina,
      totalPaginas
    );



  const visiveis =
    filtrados.slice(
      (paginaAtual - 1) * PAGE_SIZE,
      paginaAtual * PAGE_SIZE
    );





  function limpar() {


    setBusca("");

    setStatus(TODOS);

    setPagina(1);


  }





  return (

    <div className="mx-auto max-w-[1600px] space-y-6">



      <header className="flex flex-wrap items-center justify-between gap-4">


        <div>


          <h1 className="font-display text-3xl font-semibold">
            Alunos
          </h1>


          <p className="text-sm text-muted-foreground">

            {filtrados.length} de {alunos.length} alunos cadastrados

          </p>


        </div>




        <div className="flex gap-2">


          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => toast.success("Exportação iniciada")}
          >

            <Download className="size-4" />

            Exportar

          </Button>




          <Button
            className="rounded-xl"
            onClick={() => navigate("/alunos/novo")}
          >

            <Plus className="size-4" />

            Novo aluno

          </Button>


        </div>


      </header>






      <SectionCard
        title="Filtros"
        description="Pesquisa por nome ou matrícula"
        action={

          <Button
            variant="ghost"
            size="sm"
            onClick={limpar}
          >

            <Filter className="size-4" />

            Limpar

          </Button>

        }
      >



        <div className="grid gap-3 md:grid-cols-2">



          <div className="relative">


            <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />


            <Input

              value={busca}

              onChange={(e) => {

                setBusca(e.target.value);

                setPagina(1);

              }}

              placeholder="Buscar aluno..."

              className="pl-9 rounded-xl"

            />


          </div>





          <Select
            value={status}
            onValueChange={setStatus}
          >


            <SelectTrigger className="rounded-xl">

              <SelectValue placeholder="Status" />

            </SelectTrigger>



            <SelectContent>


              <SelectItem value={TODOS}>
                Todos
              </SelectItem>


              <SelectItem value="ativo">
                Ativo
              </SelectItem>


              <SelectItem value="inativo">
                Inativo
              </SelectItem>


            </SelectContent>


          </Select>



        </div>



      </SectionCard>







      <SectionCard

        title="Lista de alunos"

        description="Dados vindos da API"

        bodyClassName="p-0"

        action={


          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOrdem(
              ordem === "nome"
                ?
                "id"
                :
                "nome"
            )}
          >


            <ArrowUpDown className="size-4" />


            Ordenar

          </Button>


        }

      >




        {
          visiveis.length === 0 ?


            <div className="p-5">


              <EmptyState

                icon={GraduationCap}

                title="Nenhum aluno encontrado"

                description="Cadastre um aluno para visualizar aqui."

                action={

                  <Button
                    variant="outline"
                    onClick={limpar}
                  >

                    <SlidersHorizontal className="size-4" />

                    Limpar

                  </Button>

                }

              />


            </div>



            :



            <div className="overflow-x-auto">


              <Table>


                <TableHeader>

                  <TableRow>


                    <TableHead>
                      Aluno
                    </TableHead>


                    <TableHead>
                      Matrícula
                    </TableHead>


                    <TableHead>
                      Série
                    </TableHead>


                    <TableHead>
                      Turno
                    </TableHead>


                    <TableHead>
                      Status
                    </TableHead>


                    <TableHead />

                  </TableRow>


                </TableHeader>




                <TableBody>


                  {
                    visiveis.map((aluno) => (



                      <TableRow key={aluno.id}>


                        <TableCell>


                          <Link
                            to={`/alunos/${aluno.id}`}
                            className="flex items-center gap-3"
                          >


                            <Avatar>


                              <AvatarImage src={aluno.foto_url} />


                              <AvatarFallback>

                                {aluno.nome.slice(0, 2)}

                              </AvatarFallback>


                            </Avatar>



                            <div>


                              <p className="font-medium">

                                {aluno.nome}

                              </p>


                              <p className="text-xs text-muted-foreground">

                                {aluno.cidade ?? ""}

                              </p>


                            </div>


                          </Link>


                        </TableCell>




                        <TableCell>
                          ALU-{aluno.id.slice(0, 8).toUpperCase()}
                        </TableCell>



                        <TableCell>

                          {aluno.serie ?? "-"}

                        </TableCell>



                        <TableCell>

                          {aluno.turno ?? "-"}

                        </TableCell>



                        <TableCell>

                          <StatusPill status={aluno.status ?? "ativo"} />

                        </TableCell>




                        <TableCell>


                          <DropdownMenu>


                            <DropdownMenuTrigger asChild>


                              <Button
                                variant="ghost"
                                size="icon"
                              >


                                <MoreHorizontal className="size-4" />


                              </Button>


                            </DropdownMenuTrigger>



                            <DropdownMenuContent>


                              <DropdownMenuItem>
                                Visualizar
                              </DropdownMenuItem>


                              <DropdownMenuItem>
                                Editar
                              </DropdownMenuItem>


                              {aluno.status === "ativo" && (
                                <DropdownMenuItem
                                  onClick={() => excluirAluno(aluno.id)}
                                >
                                  Excluir
                                </DropdownMenuItem>
                              )}

                            </DropdownMenuContent>

                          </DropdownMenu>

                        </TableCell>


                      </TableRow>


                    ))

                  }


                </TableBody>


              </Table>


            </div>



        }


      </SectionCard>



    </div>

  );


}
