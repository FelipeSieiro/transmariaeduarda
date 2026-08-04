// src/pages/Alunos.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowUpDown,
  Download,
  Filter,
  GraduationCap,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
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

import { listarAlunos, removerAluno } from "@/services/alunos.service";
import type { Aluno } from "@/types";

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
      const matriculaStr = aluno.matricula || `ALU-${aluno.id.slice(0, 8)}`;
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
    <div className="mx-auto max-w-[1600px] space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
            Alunos
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filtrados.length} de {alunos.length} alunos cadastrados no sistema
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="rounded-xl gap-2"
            onClick={() => toast.success("Exportação iniciada")}
          >
            <Download className="size-4" />
            <span>Exportar</span>
          </Button>

          <Button
            className="rounded-xl gap-2"
            onClick={() => navigate("/alunos/novo")}
          >
            <Plus className="size-4" />
            <span>Novo aluno</span>
          </Button>
        </div>
      </header>

      <SectionCard
        title="Filtros"
        description="Pesquisa por nome ou matrícula"
        action={
          <Button variant="ghost" size="sm" onClick={limpar} className="gap-1.5">
            <Filter className="size-3.5" />
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
              placeholder="Buscar aluno por nome ou matrícula..."
              className="pl-9 rounded-xl"
            />
          </div>

          <Select value={status} onValueChange={(val) => { setStatus(val); setPagina(1); }}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TODOS}>Todos os status</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SectionCard>

      <SectionCard
        title="Lista de alunos"
        description="Registros sincronizados com a API"
        bodyClassName="p-0"
        action={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOrdem(ordem === "nome" ? "id" : "nome")}
            className="gap-1.5"
          >
            <ArrowUpDown className="size-3.5" />
            <span>Ordenar por {ordem === "nome" ? "Nome" : "ID"}</span>
          </Button>
        }
      >
        {loading ? (
          <div className="py-12 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2">
            <Clock className="size-5 animate-spin text-primary" />
            <span>Carregando alunos...</span>
          </div>
        ) : visiveis.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={GraduationCap}
              title="Nenhum aluno encontrado"
              description="Cadastre um aluno ou ajuste os filtros para visualizar resultados."
              action={
                <Button variant="outline" onClick={limpar} className="rounded-xl gap-2">
                  <SlidersHorizontal className="size-4" />
                  Limpar Filtros
                </Button>
              }
            />
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Matrícula</TableHead>
                    <TableHead>Série</TableHead>
                    <TableHead>Turno</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {visiveis.map((aluno) => {
                    const escolaNome = obterNomeEscola(aluno);
                    const fotoUrl = aluno.foto || aluno.foto_url || aluno.avatar_url;
                    const matriculaExibicao = aluno.matricula || `ALU-${aluno.id.slice(0, 8).toUpperCase()}`;
                    const statusNormalizado = aluno.status?.toLowerCase() === "ativo" ? "ativo" : "inativo";

                    return (
                      <TableRow key={aluno.id} className="transition-colors hover:bg-muted/30">
                        <TableCell>
                          <Link
                            to={`/alunos/${aluno.id}`}
                            className="flex items-center gap-3 group w-fit"
                          >
                            <Avatar className="size-10 shrink-0 border border-border">
                              <AvatarImage src={fotoUrl ?? undefined} alt={aluno.nome} />
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                                {getIniciais(aluno.nome)}
                              </AvatarFallback>
                            </Avatar>

                            <div className="min-w-0">
                              <p className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                                {aluno.nome}
                              </p>
                              {escolaNome ? (
                                <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                                  <MapPin className="size-3 shrink-0 text-muted-foreground/70" />
                                  <span>{escolaNome}</span>
                                </p>
                              ) : (
                                <p className="text-xs text-muted-foreground">
                                  {aluno.cidade ?? "Sem escola informada"}
                                </p>
                              )}
                            </div>
                          </Link>
                        </TableCell>

                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {matriculaExibicao}
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {aluno.serie ?? "-"}
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {aluno.turno ?? "-"}
                        </TableCell>

                        <TableCell>
                          <StatusPill status={statusNormalizado} />
                        </TableCell>

                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="rounded-xl">
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="rounded-xl">
                              <DropdownMenuItem
                                onClick={() => navigate(`/alunos/${aluno.id}`)}
                              >
                                Visualizar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => navigate(`/alunos/${aluno.id}/editar`)}
                              >
                                Editar
                              </DropdownMenuItem>
                              {statusNormalizado === "ativo" && (
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
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

            {/* Paginação */}
            {totalPaginas > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Mostrando página <span className="font-medium text-foreground">{paginaAtual}</span> de{" "}
                  <span className="font-medium text-foreground">{totalPaginas}</span>
                </p>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl h-8 px-2.5 text-xs"
                    onClick={() => setPagina((p) => Math.max(1, p - 1))}
                    disabled={paginaAtual === 1}
                  >
                    <ChevronLeft className="size-3.5 mr-1" /> Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl h-8 px-2.5 text-xs"
                    onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                    disabled={paginaAtual === totalPaginas}
                  >
                    Próxima <ChevronRight className="size-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </SectionCard>
    </div>
  );
}