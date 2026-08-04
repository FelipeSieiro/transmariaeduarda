// src/pages/Responsaveis.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Plus, Search, Users, Download, ArrowUpDown, SlidersHorizontal } from "lucide-react";
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

const PAGE_SIZE = 8;

export default function Responsaveis() {
  const navigate = useNavigate();

  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([]);
  const [busca, setBusca] = useState("");
  const [ordem, setOrdem] = useState<"nome" | "id">("nome");
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await listarResponsaveis();
        setResponsaveis(dados || []);
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

  const filtrados = responsaveis
    .filter((responsavel) => {
      const termo = busca.toLowerCase().trim();

      return (
        !termo ||
        responsavel.nome?.toLowerCase().includes(termo) ||
        responsavel.cpf?.toLowerCase().includes(termo) ||
        responsavel.telefone?.toLowerCase().includes(termo) ||
        responsavel.email?.toLowerCase().includes(termo)
      );
    })
    .sort((a, b) => {
      if (ordem === "nome") {
        return (a.nome || "").localeCompare(b.nome || "");
      }
      return String(a.id).localeCompare(String(b.id));
    });

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / PAGE_SIZE));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const visiveis = filtrados.slice(
    (paginaAtual - 1) * PAGE_SIZE,
    paginaAtual * PAGE_SIZE
  );

  function limpar() {
    setBusca("");
    setPagina(1);
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display flex items-center gap-2.5 text-3xl font-semibold tracking-tight text-foreground">
            <Users className="size-7 text-primary" />
            Responsáveis
          </h1>
          <p className="text-sm text-muted-foreground">
            {filtrados.length} de {responsaveis.length} responsáveis cadastrados
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => toast.success("Exportação iniciada")}
          >
            <Download className="size-4 mr-2" />
            Exportar
          </Button>

          <Button
            className="rounded-xl"
            onClick={() => navigate("/responsaveis/novo")}
          >
            <Plus className="size-4 mr-2" />
            Novo responsável
          </Button>
        </div>
      </header>

      <SectionCard
        title="Filtros"
        description="Pesquisa por nome, CPF, telefone ou e-mail"
        action={
          <Button
            variant="ghost"
            size="sm"
            onClick={limpar}
            className="rounded-lg text-muted-foreground hover:text-foreground"
          >
            Limpar
          </Button>
        }
      >
        <div className="relative">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar responsável..."
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setPagina(1);
            }}
            className="rounded-xl pl-9"
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Responsáveis cadastrados"
        description="Lista de responsáveis financeiros e contatos autorizados"
        bodyClassName="p-0"
        action={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOrdem(ordem === "nome" ? "id" : "nome")}
            className="rounded-lg text-muted-foreground hover:text-foreground"
          >
            <ArrowUpDown className="size-4 mr-2" />
            Ordenar por {ordem === "nome" ? "Nome" : "ID"}
          </Button>
        }
      >
        {visiveis.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Users}
              title="Nenhum responsável encontrado"
              description="Cadastre um responsável ou ajuste os filtros aplicados."
              action={
                <Button variant="outline" onClick={limpar} className="rounded-xl">
                  <SlidersHorizontal className="size-4 mr-2" />
                  Limpar filtros
                </Button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead className="w-16 pr-6 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {visiveis.map((responsavel) => (
                  <TableRow key={responsavel.id}>
                    <TableCell className="pl-6 font-medium text-foreground">
                      {responsavel.nome}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {responsavel.cpf ?? "—"}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {responsavel.telefone ?? "—"}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {responsavel.email ?? "—"}
                    </TableCell>

                    <TableCell className="text-muted-foreground max-w-xs truncate">
                      {responsavel.endereco ?? "—"}
                    </TableCell>

                    <TableCell className="pr-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-lg text-muted-foreground hover:text-foreground"
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuItem
                            onClick={() =>
                              navigate(`/responsaveis/${responsavel.id}`)
                            }
                            className="rounded-lg cursor-pointer"
                          >
                            Visualizar
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() =>
                              navigate(
                                `/responsaveis/${responsavel.id}/editar`
                              )
                            }
                            className="rounded-lg cursor-pointer"
                          >
                            Editar
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="rounded-lg text-destructive focus:text-destructive cursor-pointer"
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