// src/pages/Contratos.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, FileSignature, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionCard } from "@/components/ui-kit/primitives";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { listarContratos, type Contrato } from "@/services/contratos.service";

function moeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function Contratos() {
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [carregando, setCarregando] = useState(true);

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

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <header className="space-y-1">
          <h1 className="font-display flex items-center gap-2.5 text-3xl font-semibold tracking-tight text-foreground">
            <FileSignature className="size-7 text-primary" />
            Contratos
          </h1>
          <p className="text-sm text-muted-foreground">
            Gestão completa de contratos ativos e históricos dos alunos
          </p>
        </header>

        <Button asChild className="rounded-xl">
          <Link to="/contratos/novo">
            <Plus className="size-4 mr-2" />
            Novo contrato
          </Link>
        </Button>
      </div>

      <SectionCard
        title="Contratos cadastrados"
        description="Lista de contratos ativos e históricos"
        bodyClassName="p-0"
      >
        {carregando ? (
          <div className="p-12 text-center text-sm text-muted-foreground animate-pulse">
            Carregando contratos...
          </div>
        ) : contratos.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Nenhum contrato encontrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Número</TableHead>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Escola</TableHead>
                  <TableHead>Mensalidade</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-16 pr-6 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {contratos.map((contrato) => {
                  const isAtivo = contrato.status?.toUpperCase() === "ATIVO";

                  return (
                    <TableRow key={contrato.id}>
                      <TableCell className="pl-6 font-medium text-foreground">
                        {contrato.numero}
                      </TableCell>

                      <TableCell className="text-foreground">
                        {contrato.alunos?.nome ?? "—"}
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {contrato.alunos?.escolas?.nome ?? "—"}
                      </TableCell>

                      <TableCell className="font-medium text-foreground">
                        {moeda(Number(contrato.valor_mensalidade))}
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        Dia {contrato.dia_vencimento}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={isAtivo ? "default" : "secondary"}
                          className={
                            isAtivo
                              ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20 shadow-none"
                              : "bg-muted text-muted-foreground shadow-none"
                          }
                        >
                          {contrato.status ?? "INATIVO"}
                        </Badge>
                      </TableCell>

                      <TableCell className="pr-6 text-right">
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="rounded-lg text-muted-foreground hover:text-foreground"
                        >
                          <Link to={`/contratos/${contrato.id}`}>
                            <Eye className="size-4" />
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
      </SectionCard>
    </div>
  );
}