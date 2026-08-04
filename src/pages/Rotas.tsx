import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowUpDown,
  Bus,
  Download,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { toast } from "sonner";

import { EmptyState, SectionCard, StatusPill } from "@/components/ui-kit/primitives";
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
  type Rota,
} from "@/services/rotas.service";

const PAGE_SIZE = 8;
const TODOS = "__todos__";

export default function RotasPage() {
  const [rotas, setRotas] = useState<Rota[]>([]);
  const navigate = useNavigate();
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
        rota.descricao?.toLowerCase().includes(q);

      return pesquisa && (status === TODOS || rota.status === status);
    });

    return resultado.sort((a, b) => {
      if (ordem === "nome") {
        return (a.nome || "").localeCompare(b.nome || "");
      }
      return String(a.id).localeCompare(String(a.id));
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
    <div className="mx-auto max-w-[1600px] space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">Gestão de Rotas</h1>
          <p className="text-sm text-muted-foreground">
            {filtrados.length} de {rotas.length} rotas cadastradas
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

          <Button asChild className="rounded-xl">
            <Link to="/rotas/nova">
              <Plus className="size-4 mr-2" />
              Nova rota
            </Link>
          </Button>
        </div>
      </header>

      <SectionCard
        title="Filtros"
        description="Pesquisa por nome ou descrição"
        action={
          <Button variant="ghost" size="sm" onClick={limpar}>
            <Filter className="size-4 mr-2" />
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
              placeholder="Buscar rota..."
              className="pl-9 rounded-xl"
            />
          </div>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TODOS}>Todos</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SectionCard>

      <SectionCard
        title="Lista de rotas"
        description="Dados vindos da API"
        bodyClassName="p-0"
        action={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOrdem(ordem === "nome" ? "id" : "nome")}
          >
            <ArrowUpDown className="size-4 mr-2" />
            Ordenar
          </Button>
        }
      >
        {visiveis.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={Bus}
              title="Nenhuma rota encontrada"
              description="Cadastre uma rota para visualizar aqui."
              action={
                <Button variant="outline" onClick={limpar}>
                  <SlidersHorizontal className="size-4 mr-2" />
                  Limpar
                </Button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>

              <TableBody>
                {visiveis.map((rota) => (
                  <TableRow key={rota.id}>
                    <TableCell>
                      <Link
                        to={`/rotas/${rota.id}`}
                        className="flex items-center gap-3 group"
                      >
                        <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <Bus className="size-4" />
                        </div>
                        <div>
                          <p className="font-medium group-hover:underline">{rota.nome}</p>
                        </div>
                      </Link>
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {rota.descricao || "-"}
                    </TableCell>

                    <TableCell>
                      <StatusPill status={rota.status ?? "ativo"} />
                    </TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/rotas/${rota.id}`}>Visualizar</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/rotas/${rota.id}/editar`}>Editar</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive cursor-pointer"
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
      </SectionCard>
    </div>
  );
}