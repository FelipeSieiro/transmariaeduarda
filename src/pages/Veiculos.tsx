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

import { veiculosService, type Veiculo } from "@/services/veiculos.service";

const PAGE_SIZE = 8;
const TODOS = "__todos__";

export default function Veiculos() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState(TODOS);
  const [ordem, setOrdem] = useState<"modelo" | "placa">("modelo");
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await veiculosService.getAll();
        setVeiculos(dados || []);
      } catch (error) {
        console.error("Erro ao buscar veículos", error);
        toast.error("Erro ao carregar veículos");
      }
    }

    carregar();
  }, []);

  async function excluirVeiculo(id: string) {
    if (!window.confirm("Tem certeza que deseja excluir este veículo?")) {
      return;
    }

    try {
      await veiculosService.delete(id);
      setVeiculos((prev) => prev.filter((v) => v.id !== id));
      toast.success("Veículo excluído com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir veículo");
    }
  }

  const filtrados = useMemo(() => {
    const q = busca.toLowerCase().trim();

    const resultado = veiculos.filter((veiculo) => {
      const pesquisa =
        !q ||
        veiculo.modelo?.toLowerCase().includes(q) ||
        veiculo.placa?.toLowerCase().includes(q) ||
        veiculo.marca?.toLowerCase().includes(q);

      return pesquisa && (status === TODOS || veiculo.status === status);
    });

    return resultado.sort((a, b) => {
      if (ordem === "modelo") {
        return (a.modelo || "").localeCompare(b.modelo || "");
      }
      return (a.placa || "").localeCompare(b.placa || "");
    });
  }, [veiculos, busca, status, ordem]);

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
          <h1 className="font-display text-3xl font-semibold">Veículos</h1>
          <p className="text-sm text-muted-foreground">
            {filtrados.length} de {veiculos.length} veículos cadastrados
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
            onClick={() => navigate("/veiculos/novo")}
          >
            <Plus className="size-4 mr-2" />
            Novo veículo
          </Button>
        </div>
      </header>

      <SectionCard
        title="Filtros"
        description="Pesquisa por modelo, placa ou marca"
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
              placeholder="Buscar veículo..."
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
              <SelectItem value="manutencao">Manutenção</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SectionCard>

      <SectionCard
        title="Lista de veículos"
        description="Dados vindos da API"
        bodyClassName="p-0"
        action={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOrdem(ordem === "modelo" ? "placa" : "modelo")}
          >
            <ArrowUpDown className="size-4 mr-2" />
            Ordenar por {ordem === "modelo" ? "Placa" : "Modelo"}
          </Button>
        }
      >
        {visiveis.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={Bus}
              title="Nenhum veículo encontrado"
              description="Cadastre um veículo para visualizar aqui."
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
                  <TableHead>Veículo / Modelo</TableHead>
                  <TableHead>Placa</TableHead>
                  <TableHead>Capacidade</TableHead>
                  <TableHead>Ano</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>

              <TableBody>
                {visiveis.map((veiculo) => (
                  <TableRow key={veiculo.id}>
                    <TableCell>
                      <Link
                        to={`/veiculos/${veiculo.id}`}
                        className="flex items-center gap-3 group"
                      >
                        <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <Bus className="size-4" />
                        </div>
                        <div>
                          <p className="font-medium group-hover:underline">
                            {veiculo.modelo}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {veiculo.marca ?? "Marca não informada"}
                          </p>
                        </div>
                      </Link>
                    </TableCell>

                    <TableCell className="font-mono font-medium">
                      {veiculo.placa}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {veiculo.capacidade ? `${veiculo.capacidade} lugares` : "-"}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {veiculo.ano ?? "-"}
                    </TableCell>

                    <TableCell>
                      <StatusPill status={veiculo.status ?? "ativo"} />
                    </TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => navigate(`/veiculos/${veiculo.id}`)}
                          >
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate(`/veiculos/${veiculo.id}/editar`)}
                          >
                            Editar
                          </DropdownMenuItem>
                          {veiculo.status === "ativo" && (
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive cursor-pointer"
                              onClick={() => excluirVeiculo(veiculo.id)}
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
      </SectionCard>
    </div>
  );
}