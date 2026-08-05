// src/pages/Veiculos.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Plus, Search, Download, ArrowUpDown, Bus, CheckCircle2, Wrench, Users2 } from "lucide-react";
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

import { veiculosService, type Veiculo } from "@/services/veiculos.service";

const PAGE_SIZE = 8;

export default function Veiculos() {
  const navigate = useNavigate();

  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [busca, setBusca] = useState("");
  const [ordem, setOrdem] = useState<"modelo" | "placa">("modelo");
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await veiculosService.getAll();
        setVeiculos(dados || []);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar veículos");
      }
    }

    carregar();
  }, []);

  async function excluirVeiculo(id: string) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este veículo?"
    );

    if (!confirmar) return;

    try {
      await veiculosService.delete(id);
      setVeiculos((prev) => prev.filter((item) => item.id !== id));
      toast.success("Veículo excluído com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir veículo");
    }
  }

  // Métricas rápidas da frota
  const metricas = useMemo(() => {
    const total = veiculos.length;
    const ativos = veiculos.filter((v) => (v.status || "").toLowerCase() === "ativo").length;
    const manutencao = veiculos.filter((v) => (v.status || "").toLowerCase() === "manutencao" || (v.status || "").toLowerCase() === "em manutenção").length;
    const capacidadeTotal = veiculos.reduce((acc, v) => acc + (Number(v.capacidade) || 0), 0);

    return { total, ativos, manutencao, capacidadeTotal };
  }, [veiculos]);

  const filtrados = veiculos
    .filter((veiculo) => {
      const termo = busca.toLowerCase().trim();

      return (
        !termo ||
        veiculo.modelo?.toLowerCase().includes(termo) ||
        veiculo.placa?.toLowerCase().includes(termo) ||
        veiculo.marca?.toLowerCase().includes(termo)
      );
    })
    .sort((a, b) => {
      if (ordem === "modelo") {
        return (a.modelo || "").localeCompare(b.modelo || "");
      }
      return (a.placa || "").localeCompare(b.placa || "");
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
            Veículos & Frota
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {filtrados.length} {filtrados.length === 1 ? "veículo cadastrado" : "veículos cadastrados"}
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
            <button onClick={() => navigate("/veiculos/novo")}>
              <Plus className="size-3.5 mr-1.5" />
              Novo veículo
            </button>
          </Button>
        </div>
      </div>

      {/* Cards de Resumo da Frota */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card/50 border border-border/60 rounded-xl p-3.5 flex items-center gap-3 shadow-2xs">
          <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Bus className="size-4" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Total na Frota</p>
            <p className="text-lg font-bold text-foreground leading-tight">{metricas.total}</p>
          </div>
        </div>

        <div className="bg-card/50 border border-border/60 rounded-xl p-3.5 flex items-center gap-3 shadow-2xs">
          <div className="size-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle2 className="size-4" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Veículos Ativos</p>
            <p className="text-lg font-bold text-foreground leading-tight">{metricas.ativos}</p>
          </div>
        </div>

        <div className="bg-card/50 border border-border/60 rounded-xl p-3.5 flex items-center gap-3 shadow-2xs">
          <div className="size-9 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <Wrench className="size-4" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Em Manutenção</p>
            <p className="text-lg font-bold text-foreground leading-tight">{metricas.manutencao}</p>
          </div>
        </div>

        <div className="bg-card/50 border border-border/60 rounded-xl p-3.5 flex items-center gap-3 shadow-2xs">
          <div className="size-9 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
            <Users2 className="size-4" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Capacidade Total</p>
            <p className="text-lg font-bold text-foreground leading-tight">{metricas.capacidadeTotal} <span className="text-[10px] font-normal text-muted-foreground">lugares</span></p>
          </div>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground/70" />
          <Input
            placeholder="Buscar por modelo, placa..."
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
            onClick={() => setOrdem(ordem === "modelo" ? "placa" : "modelo")}
            className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowUpDown className="size-3.5 mr-1.5 opacity-70" />
            Ordenar por {ordem === "modelo" ? "Placa" : "Modelo"}
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
            Nenhum veículo encontrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/40 hover:bg-transparent">
                  <TableHead className="pl-4 text-xs font-medium text-muted-foreground">Veículo / Modelo</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Placa</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Capacidade</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Ano</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                  <TableHead className="w-12 pr-4 text-right"></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {visiveis.map((veiculo) => (
                  <TableRow key={veiculo.id} className="border-border/40 transition-colors group">
                    <TableCell className="pl-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                          <Bus className="size-3.5" />
                        </div>
                        <div>
                          <p className="font-medium text-xs text-foreground">
                            {veiculo.modelo}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {veiculo.marca ?? "Marca não informada"}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-3 text-xs text-foreground font-mono font-medium">
                      {veiculo.placa}
                    </TableCell>

                    <TableCell className="py-3 text-xs text-muted-foreground/80">
                      {veiculo.capacidade ? `${veiculo.capacidade} lugares` : "—"}
                    </TableCell>

                    <TableCell className="py-3 text-xs text-muted-foreground/80">
                      {veiculo.ano ?? "—"}
                    </TableCell>

                    <TableCell className="py-3">
                      <StatusPill status={veiculo.status ? veiculo.status.toLowerCase() : "ativo"} />
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
                              navigate(`/veiculos/${veiculo.id}`)
                            }
                            className="rounded-md cursor-pointer"
                          >
                            Visualizar
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() =>
                              navigate(
                                `/veiculos/${veiculo.id}/editar`
                              )
                            }
                            className="rounded-md cursor-pointer"
                          >
                            Editar
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="rounded-md text-destructive focus:text-destructive cursor-pointer"
                            onClick={() => excluirVeiculo(veiculo.id)}
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