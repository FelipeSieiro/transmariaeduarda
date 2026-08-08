// src/pages/Alunos.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowUpDown,
  Download,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

import { toast } from "sonner";

import { StatusPill } from "@/components/ui-kit/primitives";
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

import { listarAlunos, removerAluno } from "@/features/alunos/services/alunos.service";
import type { Aluno } from "@/features/alunos/types/alunos";

const PAGE_SIZE = 8;
const TODOS = "__todos__";

function getIniciais(nome?: string): string {
  if (!nome) return "AL";
  const partes = nome.trim().split(" ").filter(Boolean);
  if (partes.length === 0) return "AL";
  if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

function obterNomeEscola(aluno: Aluno): string {
  if (typeof aluno.escolas === "string") return aluno.escolas;
  if (typeof aluno.escola === "string") return aluno.escola;
  return aluno.escola?.nome ?? aluno.escolas?.nome ?? aluno.escola_nome ?? "";
}

function formatarMatricula(aluno: Aluno | any): string {
  const matricula = aluno?.id
    ? `ALU-${String(aluno.id).slice(0, 8).toUpperCase()}`
    : "-";
  return matricula;
}

export default function Alunos() {
  const [alunos, setAlunos] = useState<readonly Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState(TODOS);
  const [ordem, setOrdem] = useState<"nome" | "id">("nome");
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    async function carregar() {
      try {
        setLoading(true);
        const dados = await listarAlunos();
        setAlunos(dados || []);
      } catch (error) {
        console.error("Erro ao buscar alunos", error);
        toast.error("Erro ao carregar alunos");
      } finally {
        setLoading(false);
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
    const q = busca.toLowerCase().trim();

    const resultado = [...alunos].filter((aluno) => {
      const matriculaStr = formatarMatricula(aluno);
      const pesquisa =
        !q ||
        aluno.nome.toLowerCase().includes(q) ||
        matriculaStr.toLowerCase().includes(q);

      const statusNormalizado = aluno.status?.toLowerCase() === "ativo" ? "ativo" : "inativo";
      const statusFiltro = status === TODOS || statusNormalizado === status;

      return pesquisa && statusFiltro;
    });

    return resultado.sort((a, b) => {
      if (ordem === "nome") {
        return a.nome.localeCompare(b.nome);
      }
      return a.id.localeCompare(b.id);
    });
  }, [alunos, busca, status, ordem]);

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
    <div className="mx-auto max-w-6xl space-y-6 py-2">
      {/* Header Minimalista */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Alunos
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {filtrados.length} {filtrados.length === 1 ? "aluno cadastrado" : "alunos cadastrados"} no sistema
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
            <button onClick={() => navigate("/alunos/novo")}>
              <Plus className="size-3.5 mr-1.5" />
              Novo aluno
            </button>
          </Button>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground/70" />
          <Input
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setPagina(1);
            }}
            placeholder="Buscar por nome ou matrícula..."
            className="pl-9 h-9 text-xs rounded-lg bg-background/50 border-border/60"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Select value={status} onValueChange={(val) => { setStatus(val); setPagina(1); }}>
            <SelectTrigger className="w-full sm:w-[150px] h-9 text-xs rounded-lg bg-background/50 border-border/60">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl text-xs">
              <SelectItem value={TODOS}>Todos os status</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOrdem(ordem === "nome" ? "id" : "nome")}
            className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowUpDown className="size-3.5 mr-1.5 opacity-70" />
            Ordenar por {ordem === "nome" ? "Nome" : "ID"}
          </Button>

          {(busca || status !== TODOS || pagina > 1) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={limpar}
              className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <Filter className="size-3.5 mr-1.5 opacity-70" />
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

        {loading ? (
          <div className="p-12 text-center text-xs text-muted-foreground animate-pulse">
            Carregando alunos...
          </div>
        ) : visiveis.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            Nenhum aluno encontrado.
          </div>
        ) : (
          <div>
            {/* VISÃO MOBILE: CARDS */}
            <div className="grid grid-cols-1 gap-3 p-4 sm:hidden">
              {visiveis.map((aluno) => {
                const escolaNome = obterNomeEscola(aluno);
                const fotoUrl = aluno.foto || aluno.foto_url || aluno.avatar_url;
                const matriculaExibicao = formatarMatricula(aluno);
                const statusNormalizado = aluno.status?.toLowerCase() === "ativo" ? "ativo" : "inativo";

                return (
                  <div
                    key={aluno.id}
                    className="rounded-xl border border-border/60 bg-card p-4 space-y-3 shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/alunos/${aluno.id}`}
                        className="flex items-center gap-2.5 group min-w-0"
                      >
                        <Avatar className="size-8 shrink-0 border border-border/60">
                          <AvatarImage src={fotoUrl ?? undefined} alt={aluno.nome} />
                          <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-medium">
                            {getIniciais(aluno.nome)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                          <p className="text-xs font-medium text-foreground group-hover:underline truncate">
                            {aluno.nome}
                          </p>
                          {escolaNome ? (
                            <p className="text-[10px] text-muted-foreground/80 flex items-center gap-1 truncate">
                              <MapPin className="size-3 shrink-0 text-muted-foreground/60" />
                              <span className="truncate">{escolaNome}</span>
                            </p>
                          ) : (
                            <p className="text-[10px] text-muted-foreground/80 truncate">
                              {aluno.cidade ?? "Sem escola informada"}
                            </p>
                          )}
                        </div>
                      </Link>

                      <StatusPill status={statusNormalizado} />
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40 text-[11px]">
                      <div>
                        <span className="text-[10px] text-muted-foreground/70 block">Matrícula</span>
                        <span className="font-mono font-medium text-foreground truncate block">
                          {matriculaExibicao}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground/70 block">Série</span>
                        <span className="font-medium text-foreground truncate block">
                          {aluno.serie ?? "—"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground/70 block">Turno</span>
                        <span className="font-medium text-foreground truncate block">
                          {aluno.turno ?? "—"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-border/40">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs px-2 rounded-md"
                        onClick={() => navigate(`/alunos/${aluno.id}`)}
                      >
                        <Eye className="size-3.5 mr-1 text-primary" /> Visualizar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs px-2 rounded-md"
                        onClick={() => navigate(`/alunos/${aluno.id}/editar`)}
                      >
                        <Edit className="size-3.5 mr-1 text-muted-foreground" /> Editar
                      </Button>
                      {statusNormalizado === "ativo" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs px-2 rounded-md text-destructive hover:text-destructive"
                          onClick={() => excluirAluno(aluno.id)}
                        >
                          <Trash2 className="size-3.5 mr-1" /> Excluir
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* VISÃO DESKTOP: TABELA TRADICIONAL */}
            <div className="hidden sm:block overflow-x-auto">
              <Table className="w-full table-fixed">
                <TableHeader>
                  <TableRow className="border-border/40 hover:bg-transparent">
                    <TableHead className="pl-4 text-xs font-medium text-muted-foreground w-[32%]">Aluno</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground w-[28%]">Matrícula</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground w-[18%]">Série</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground w-[12%]">Turno</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground w-[10%]">Status</TableHead>
                    <TableHead className="w-[10%] pr-4 text-right"></TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {visiveis.map((aluno) => {
                    const escolaNome = obterNomeEscola(aluno);
                    const fotoUrl = aluno.foto || aluno.foto_url || aluno.avatar_url;
                    const matriculaExibicao = formatarMatricula(aluno);
                    const statusNormalizado = aluno.status?.toLowerCase() === "ativo" ? "ativo" : "inativo";

                    return (
                      <TableRow key={aluno.id} className="border-border/40 transition-colors group">
                        <TableCell className="pl-4 py-3 truncate">
                          <Link
                            to={`/alunos/${aluno.id}`}
                            className="flex items-center gap-2.5 w-full min-w-0"
                          >
                            <Avatar className="size-6 shrink-0 border border-border/60">
                              <AvatarImage src={fotoUrl ?? undefined} alt={aluno.nome} />
                              <AvatarFallback className="text-[9px] bg-primary/10 text-primary font-medium">
                                {getIniciais(aluno.nome)}
                              </AvatarFallback>
                            </Avatar>

                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium text-foreground group-hover:underline truncate">
                                {aluno.nome}
                              </p>
                              {escolaNome ? (
                                <p className="text-[10px] text-muted-foreground/80 flex items-center gap-1 truncate">
                                  <MapPin className="size-3 shrink-0 text-muted-foreground/60" />
                                  <span className="truncate">{escolaNome}</span>
                                </p>
                              ) : (
                                <p className="text-[10px] text-muted-foreground/80 truncate">
                                  {aluno.cidade ?? "Sem escola informada"}
                                </p>
                              )}
                            </div>
                          </Link>
                        </TableCell>

                        <TableCell className="py-3 font-mono text-xs text-muted-foreground/80 truncate">
                          <span className="block truncate" title={matriculaExibicao}>
                            {matriculaExibicao}
                          </span>
                        </TableCell>

                        <TableCell className="py-3 text-xs text-muted-foreground/80 truncate">
                          <span className="block truncate" title={aluno.serie ?? "—"}>
                            {aluno.serie ?? "—"}
                          </span>
                        </TableCell>

                        <TableCell className="py-3 text-xs text-muted-foreground/80 truncate">
                          <span className="block truncate" title={aluno.turno ?? "—"}>
                            {aluno.turno ?? "—"}
                          </span>
                        </TableCell>

                        <TableCell className="py-3 truncate">
                          <StatusPill status={statusNormalizado} />
                        </TableCell>

                        <TableCell className="pr-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="size-7 rounded-md text-muted-foreground hover:text-foreground">
                                <MoreHorizontal className="size-3.5" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="rounded-xl text-xs">
                              <DropdownMenuItem
                                onClick={() => navigate(`/alunos/${aluno.id}`)}
                                className="rounded-md cursor-pointer"
                              >
                                Visualizar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => navigate(`/alunos/${aluno.id}/editar`)}
                                className="rounded-md cursor-pointer"
                              >
                                Editar
                              </DropdownMenuItem>
                              {statusNormalizado === "ativo" && (
                                <DropdownMenuItem
                                  className="rounded-md text-destructive focus:text-destructive cursor-pointer"
                                  onClick={() => excluirAluno(aluno.id)}
                                >
                                  Excluir
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
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
              <ChevronLeft className="size-3.5 mr-1" /> Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-lg text-xs"
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              disabled={paginaAtual === totalPaginas}
            >
              Próxima <ChevronRight className="size-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}