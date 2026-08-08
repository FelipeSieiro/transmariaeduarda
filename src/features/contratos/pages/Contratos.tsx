// src/pages/Contratos.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Plus, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { listarContratos } from "@/features/contratos/services/contratos.service";
import type { Contrato } from "@/features/contratos/types/contrato";

function moeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function Contratos() {
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await listarContratos();
        setContratos(dados || []);
      } catch (error) {
        console.error("Erro ao carregar contratos:", error);
        toast.error("Erro ao carregar lista de contratos");
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, []);

  const filtrados = contratos.filter((c) => {
    const q = busca.toLowerCase().trim();
    if (!q) return true;
    return (
      c.numero?.toLowerCase().includes(q) ||
      c.alunos?.nome?.toLowerCase().includes(q) ||
      c.alunos?.escolas?.nome?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="mx-auto max-w-6xl space-y-8 py-2">
      {/* Header Minimalista */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Contratos
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {filtrados.length} {filtrados.length === 1 ? "contrato cadastrado" : "contratos cadastrados"}
          </p>
        </div>

        <Button asChild size="sm" className="h-9 rounded-lg text-xs">
          <Link to="/contratos/novo">
            <Plus className="size-3.5 mr-1.5" />
            Novo contrato
          </Link>
        </Button>
      </div>

      {/* Filtro de Busca */}
      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground/70" />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por número ou aluno..."
            className="pl-9 h-9 text-xs rounded-lg bg-background/50 border-border/60"
          />
        </div>
      </div>

      {/* Tabela Minimalista */}
      <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden shadow-2xs">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/20">
          <span className="text-xs font-medium text-muted-foreground">
            Listagem principal
          </span>
        </div>

        {carregando ? (
          <div className="p-12 text-center text-xs text-muted-foreground animate-pulse">
            Carregando contratos...
          </div>
        ) : filtrados.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            Nenhum contrato encontrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/40 hover:bg-transparent">
                  <TableHead className="pl-4 text-xs font-medium text-muted-foreground">Número</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Aluno</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Escola</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Mensalidade</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Vencimento</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                  <TableHead className="w-12 pr-4 text-right"></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtrados.map((contrato) => {
                  const isAtivo = contrato.status?.toUpperCase() === "ATIVO";

                  return (
                    <TableRow key={contrato.id} className="border-border/40 transition-colors group">
                      <TableCell className="pl-4 py-3 font-medium text-xs text-foreground">
                        {contrato.numero}
                      </TableCell>

                      <TableCell className="py-3 text-xs text-foreground">
                        {contrato.alunos?.nome ?? "—"}
                      </TableCell>

                      <TableCell className="py-3 text-xs text-muted-foreground/80">
                        {contrato.alunos?.escolas?.nome ?? "—"}
                      </TableCell>

                      <TableCell className="py-3 text-xs font-medium text-foreground">
                        {moeda(Number(contrato.valor_mensalidade))}
                      </TableCell>

                      <TableCell className="py-3 text-xs text-muted-foreground/80">
                        Dia {contrato.dia_vencimento}
                      </TableCell>

                      <TableCell className="py-3">
                        <Badge
                          variant={isAtivo ? "default" : "secondary"}
                          className={`text-[10px] px-2 py-0.5 font-medium rounded-md shadow-none ${
                            isAtivo
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {contrato.status ?? "INATIVO"}
                        </Badge>
                      </TableCell>

                      <TableCell className="pr-4 py-3 text-right">
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="size-7 rounded-md text-muted-foreground hover:text-foreground"
                        >
                          <Link to={`/contratos/${contrato.id}`}>
                            <Eye className="size-3.5" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}