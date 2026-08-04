// src/pages/Motoristas.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowUpDown,
  Download,
  Filter,
  IdCard,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
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

import { motoristasService, type Motorista } from "@/services/motoristas.service";

const PAGE_SIZE = 8;
const TODOS = "__todos__";

export default function Motoristas() {
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState(TODOS);
  const [ordem, setOrdem] = useState<"nome" | "id">("nome");
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await motoristasService.getAll();
        setMotoristas(dados || []);
      } catch (error) {
        console.error("Erro ao buscar motoristas", error);
        toast.error("Erro ao carregar motoristas");
      }
    }

    carregar();
  }, []);

  async function excluirMotorista(id: string) {
    if (!window.confirm("Tem certeza que deseja excluir este motorista?")) {
      return;
    }

    try {
      await motoristasService.delete(id);
      setMotoristas((prev) => prev.filter((motorista) => motorista.id !== id));
      toast.success("Motorista excluído com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir motorista");
    }
  }

  const filtrados = useMemo(() => {
    const q = busca.toLowerCase().trim();

    const resultado = motoristas.filter((motorista) => {
      const pesquisa =
        !q ||
        motorista.nome?.toLowerCase().includes(q) ||
        motorista.cpf?.toLowerCase().includes(q) ||
        motorista.cnh?.toLowerCase().includes(q) ||
        motorista.telefone?.toLowerCase().includes(q);

      return pesquisa && (status === TODOS || motorista.status === status);
    });

    return resultado.sort((a, b) => {
      if (ordem === "nome") {
        return (a.nome || "").localeCompare(b.nome || "");
      }
      return String(a.id).localeCompare(String(b.id));
    });
  }, [motoristas, busca, status, ordem]);

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
        <div className="space-y-1">
          <h1 className="font-display flex items-center gap-2.5 text-3xl font-semibold tracking-tight text-foreground">
            <IdCard className="size-7 text-primary" />
            Motoristas
          </h1>
          <p className="text-sm text-muted-foreground">
            {filtrados.length} de {motoristas.length} motoristas cadastrados
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
            onClick={() => navigate("/motoristas/novo")}
          >
            <Plus className="size-4 mr-2" />
            Novo motorista
          </Button>
        </div>
      </header>

      <SectionCard
        title="Filtros"
        description="Pesquisa por nome, CPF, CNH ou telefone"
        action={
          <Button variant="ghost" size="sm" onClick={limpar} className="rounded-lg text-muted-foreground hover:text-foreground">
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
              placeholder="Buscar motorista..."
              className="pl-9 rounded-xl"
            />
          </div>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value={TODOS}>Todos os status</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SectionCard>

      <SectionCard
        title="Lista de motoristas"
        description="Dados cadastrais e profissionais"
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
              icon={IdCard}
              title="Nenhum motorista encontrado"
              description="Cadastre um motorista ou ajuste os filtros aplicados."
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
                  <TableHead className="pl-6">Motorista</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>CNH / Cat.</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-16 pr-6 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {visiveis.map((motorista) => (
                  <TableRow key={motorista.id}>
                    <TableCell className="pl-6">
                      <Link
                        to={`/motoristas/${motorista.id}`}
                        className="flex items-center gap-3 group"
                      >
                        <Avatar className="rounded-xl">
                          <AvatarImage src={motorista.foto_url ?? undefined} />
                          <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-medium text-xs">
                            {(motorista.nome || "MO").slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {motorista.nome}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {motorista.cidade ?? "—"}
                          </p>
                        </div>
                      </Link>
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {motorista.cpf || "—"}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {motorista.telefone || "—"}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {motorista.cnh
                        ? `${motorista.cnh} ${
                            motorista.categoria_cnh
                              ? `(${motorista.categoria_cnh})`
                              : ""
                          }`
                        : "—"}
                    </TableCell>

                    <TableCell>
                      <StatusPill status={motorista.status ?? "ativo"} />
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
                            onClick={() => navigate(`/motoristas/${motorista.id}`)}
                            className="rounded-lg cursor-pointer"
                          >
                            Visualizar detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              navigate(`/motoristas/${motorista.id}/editar`)
                            }
                            className="rounded-lg cursor-pointer"
                          >
                            Editar cadastro
                          </DropdownMenuItem>
                          {motorista.status === "ativo" && (
                            <DropdownMenuItem
                              onClick={() => excluirMotorista(motorista.id)}
                              className="rounded-lg text-destructive focus:text-destructive cursor-pointer"
                            >
                              Excluir motorista
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