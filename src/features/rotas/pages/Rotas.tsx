// src/pages/RotasPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowUpDown,
  Bus,
  Download,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react";

import { toast } from "sonner";

import { EmptyState, StatusPill } from "@/components/ui-kit/primitives";
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
  listarRotas,
  removerRota,
} from "@/features/rotas/services/rotas.service";
import type { Rota } from "@/features/rotas/types/rota";

const PAGE_SIZE = 8;
const TODOS = "__todos__";

export default function RotasPage() {
  const [rotas, setRotas] = useState<Rota[]>([]);
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState(TODOS);
  const [ordem, setOrdem] = useState<"nome" | "id">("nome");
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await listarRotas();
        setRotas(dados || []);
      } catch (error) {
        console.error("Erro ao buscar rotas", error);
        toast.error("Erro ao carregar rotas");
      }
    }

    carregar();
  }, []);

  async function excluirRota(id: string) {
    if (!window.confirm("Tem certeza que deseja excluir esta rota?")) {
      return;
    }

    try {
      await removerRota(id);
      setRotas((prev) => prev.filter((rota) => rota.id !== id));
      toast.success("Rota excluída com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir rota");
    }
  }

  const filtrados = useMemo(() => {
    const q = busca.toLowerCase().trim();

    const resultado = rotas.filter((rota) => {
      const pesquisa =
        !q ||
        rota.nome?.toLowerCase().includes(q) ||
        rota.descricao?.toLowerCase().includes(q) ||
        rota.bairro?.toLowerCase().includes(q);

      return pesquisa && (status === TODOS || rota.status?.toLowerCase() === status.toLowerCase());
    });

    return resultado.sort((a, b) => {
      if (ordem === "nome") {
        return (a.nome || "").localeCompare(b.nome || "");
      }
      return String(a.id).localeCompare(String(b.id));
    });
  }, [rotas, busca, status, ordem]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / PAGE_SIZE));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const visiveis = filtrados.slice(
    (paginaAtual - 1) * PAGE_SIZE,
    paginaAtual * PAGE_SIZE
  );

  function limpar() {
    setBusca("");
    setStatus(TODOS);
    setPagina(1);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 py-2">
      {/* Header Minimalista */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Rotas
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {filtrados.length} {filtrados.length === 1 ? "rota cadastrada" : "rotas cadastradas"}
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
            <Link to="/rotas/nova">
              <Plus className="size-3.5 mr-1.5" />
              Nova rota
            </Link>
          </Button>
        </div>
      </div>

      {/* Filtros Limpos */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground/70" />
          <Input
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setPagina(1);
            }}
            placeholder="Buscar por nome ou bairro..."
            className="pl-9 h-9 text-xs rounded-lg bg-background/50 border-border/60"
          />
        </div>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-[150px] h-9 text-xs rounded-lg bg-background/50 border-border/60">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl text-xs">
            <SelectItem value={TODOS}>Todos os status</SelectItem>
            <SelectItem value="ativa">Ativa</SelectItem>
            <SelectItem value="inativa">Inativa</SelectItem>
          </SelectContent>
        </Select>

        {(busca || status !== TODOS) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={limpar}
            className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground ml-auto"
          >
            <Filter className="size-3.5 mr-1.5" />
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Tabela Minimalista */}
      <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden shadow-2xs">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/20">
          <span className="text-xs font-medium text-muted-foreground">
            Listagem principal
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOrdem(ordem === "nome" ? "id" : "nome")}
            className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground"
          >
            <ArrowUpDown className="size-3 mr-1.5 opacity-70" />
            Ordenar por: <span className="font-medium text-foreground ml-1">{ordem === "nome" ? "Nome" : "ID"}</span>
          </Button>
        </div>

        {visiveis.length === 0 ? (
          <div className="p-12">
            <EmptyState
              icon={Bus}
              title="Nenhuma rota encontrada"
              description="Ajuste os filtros ou cadastre uma nova rota."
              action={
                <Button variant="outline" size="sm" onClick={limpar} className="rounded-lg text-xs h-8">
                  Limpar filtros
                </Button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/40 hover:bg-transparent">
                  <TableHead className="pl-4 text-xs font-medium text-muted-foreground">Nome</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Descrição</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                  <TableHead className="w-12 pr-4 text-right"></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {visiveis.map((rota) => (
                  <TableRow key={rota.id} className="border-border/40 transition-colors group">
                    <TableCell className="pl-4 py-3">
                      <Link
                        to={`/rotas/${rota.id}`}
                        className="font-medium text-xs text-foreground hover:underline inline-block"
                      >
                        {rota.nome}
                      </Link>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground/80 max-w-sm truncate py-3">
                      {rota.descricao || "—"}
                    </TableCell>

                    <TableCell className="py-3">
                      <StatusPill status={rota.status ? rota.status.toLowerCase() : "ativa"} />
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
                          <DropdownMenuItem asChild className="rounded-md cursor-pointer">
                            <Link to={`/rotas/${rota.id}`}>Visualizar</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="rounded-md cursor-pointer">
                            <Link to={`/rotas/${rota.id}/editar`}>Editar</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="rounded-md text-destructive focus:text-destructive cursor-pointer"
                            onClick={() => excluirRota(rota.id)}
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
      </div>
    </div>
  );
}