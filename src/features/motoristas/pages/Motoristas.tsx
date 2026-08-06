// src/pages/Motoristas.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Plus, Search, Download, ArrowUpDown } from "lucide-react";
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
import { StatusPill } from "@/components/ui-kit/primitives";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { motoristasService } from "@/features/motoristas/services/motoristas.service";
import type { Motorista } from "@/types";

const PAGE_SIZE = 8;

export default function Motoristas() {
  const navigate = useNavigate();

  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [busca, setBusca] = useState("");
  const [ordem, setOrdem] = useState<"nome" | "id">("nome");
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await motoristasService.getAll();
        setMotoristas(dados || []);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar motoristas");
      }
    }

    carregar();
  }, []);

  async function excluirMotorista(id: string) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este motorista?"
    );

    if (!confirmar) return;

    try {
      await motoristasService.delete(id);
      setMotoristas((prev) => prev.filter((item) => item.id !== id));
      toast.success("Motorista excluído com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir motorista");
    }
  }

  const filtrados = motoristas
    .filter((motorista) => {
      const termo = busca.toLowerCase().trim();

      return (
        !termo ||
        motorista.nome?.toLowerCase().includes(termo) ||
        motorista.cpf?.toLowerCase().includes(termo) ||
        motorista.telefone?.toLowerCase().includes(termo) ||
        motorista.cnh?.toLowerCase().includes(termo)
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
    <div className="mx-auto max-w-6xl space-y-6 py-2">
      {/* Header Minimalista */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Motoristas
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {filtrados.length} {filtrados.length === 1 ? "motorista cadastrado" : "motoristas cadastrados"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-lg text-xs"
            onClick={() => toast.success("Exportação iniciada")}
          >
            <Download className="size-3.5 mr-1.5 opacity-70" />
            Exportar
          </Button>

          <Button asChild size="sm" className="h-9 rounded-lg text-xs">
            <button onClick={() => navigate("/motoristas/novo")}>
              <Plus className="size-3.5 mr-1.5" />
              Novo motorista
            </button>
          </Button>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground/70" />
          <Input
            placeholder="Buscar por nome, CPF, telefone..."
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setPagina(1);
            }}
            className="pl-9 h-9 text-xs rounded-lg bg-background/50 border-border/60"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOrdem(ordem === "nome" ? "id" : "nome")}
            className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowUpDown className="size-3.5 mr-1.5 opacity-70" />
            Ordenar por {ordem === "nome" ? "Nome" : "ID"}
          </Button>

          {(busca || pagina > 1) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={limpar}
              className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground"
            >
              Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Tabela Minimalista */}
      <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden shadow-2xs">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/20">
          <span className="text-xs font-medium text-muted-foreground">
            Listagem principal
          </span>
        </div>

        {visiveis.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            Nenhum motorista encontrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/40 hover:bg-transparent">
                  <TableHead className="pl-4 text-xs font-medium text-muted-foreground">Motorista</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">CPF</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Telefone</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">CNH / Cat.</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                  <TableHead className="w-12 pr-4 text-right"></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {visiveis.map((motorista) => (
                  <TableRow key={motorista.id} className="border-border/40 transition-colors group">
                    <TableCell className="pl-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8 rounded-lg">
                          <AvatarImage src={motorista.foto_url ?? undefined} />
                          <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-medium text-[10px]">
                            {(motorista.nome || "MO").slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-xs text-foreground">
                            {motorista.nome}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {motorista.cidade ?? "—"}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-3 text-xs text-muted-foreground/80 font-mono">
                      {motorista.cpf ?? "—"}
                    </TableCell>

                    <TableCell className="py-3 text-xs text-muted-foreground/80 font-mono">
                      {motorista.telefone ?? "—"}
                    </TableCell>

                    <TableCell className="py-3 text-xs text-muted-foreground/80">
                      {motorista.cnh
                        ? `${motorista.cnh} ${
                            motorista.categoria_cnh
                              ? `(${motorista.categoria_cnh})`
                              : ""
                          }`
                        : "—"}
                    </TableCell>

                    <TableCell className="py-3">
                      <StatusPill status={motorista.status ?? "ativo"} />
                    </TableCell>

                    <TableCell className="pr-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 rounded-md text-muted-foreground hover:text-foreground"
                          >
                            <MoreHorizontal className="size-3.5" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="rounded-xl text-xs">
                          <DropdownMenuItem
                            onClick={() =>
                              navigate(`/motoristas/${motorista.id}`)
                            }
                            className="rounded-md cursor-pointer"
                          >
                            Visualizar
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() =>
                              navigate(
                                `/motoristas/${motorista.id}/editar`
                              )
                            }
                            className="rounded-md cursor-pointer"
                          >
                            Editar
                          </DropdownMenuItem>

                          {motorista.status === "ativo" && (
                            <DropdownMenuItem
                              className="rounded-md text-destructive focus:text-destructive cursor-pointer"
                              onClick={() => excluirMotorista(motorista.id)}
                            >
                              Excluir
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Paginação Simples */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-between px-2 pt-2 text-xs text-muted-foreground">
          <span>
            Página {paginaAtual} de {totalPaginas}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-lg text-xs"
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              disabled={paginaAtual === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-lg text-xs"
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              disabled={paginaAtual === totalPaginas}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}