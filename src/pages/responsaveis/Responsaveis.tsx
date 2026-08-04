import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Plus, Search, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { EmptyState, SectionCard } from "@/components/ui-kit/primitives";

import {
  listarResponsaveis,
  removerResponsavel,
  type Responsavel,
} from "@/services/responsaveis.service";

export default function Responsaveis() {
  const navigate = useNavigate();

  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await listarResponsaveis();
        setResponsaveis(dados);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar responsáveis");
      }
    }

    carregar();
  }, []);

  async function excluirResponsavel(id: string) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este responsável?"
    );

    if (!confirmar) return;

    try {
      await removerResponsavel(id);
      setResponsaveis((prev) => prev.filter((item) => item.id !== id));
      toast.success("Responsável excluído com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir responsável");
    }
  }

  const filtrados = responsaveis.filter((responsavel) => {
    const termo = busca.toLowerCase().trim();

    return (
      !termo ||
      responsavel.nome?.toLowerCase().includes(termo) ||
      responsavel.cpf?.toLowerCase().includes(termo) ||
      responsavel.telefone?.toLowerCase().includes(termo)
    );
  });

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">Responsáveis</h1>
          <p className="text-sm text-muted-foreground">
            Cadastro de responsáveis financeiros e contatos autorizados
          </p>
        </div>

        <Button
          className="rounded-xl"
          onClick={() => navigate("/responsaveis/novo")}
        >
          <Plus className="size-4 mr-2" />
          Novo responsável
        </Button>
      </header>

      <SectionCard
        title="Responsáveis cadastrados"
        description="Lista de responsáveis cadastrados"
      >
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar responsável..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="rounded-xl pl-9"
          />
        </div>

        {filtrados.length === 0 ? (
          <div className="py-10">
            <EmptyState
              icon={Users}
              title="Nenhum responsável encontrado"
              description="Cadastre responsáveis para vincular aos alunos"
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtrados.map((responsavel) => (
                  <TableRow key={responsavel.id}>
                    <TableCell className="font-medium">
                      {responsavel.nome}
                    </TableCell>

                    <TableCell>{responsavel.cpf ?? "-"}</TableCell>

                    <TableCell>{responsavel.telefone ?? "-"}</TableCell>

                    <TableCell>{responsavel.email ?? "-"}</TableCell>

                    <TableCell>{responsavel.endereco ?? "-"}</TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              navigate(`/responsaveis/${responsavel.id}`)
                            }
                          >
                            Visualizar
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() =>
                              navigate(
                                `/responsaveis/${responsavel.id}/editar`
                              )
                            }
                          >
                            Editar
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => excluirResponsavel(responsavel.id)}
                          >
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}