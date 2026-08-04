import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, FileSignature, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
        setContratos(dados);
      } catch (error) {
        console.error("Erro ao carregar contratos:", error);
        toast.error("Erro ao carregar contratos");
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-semibold">
            <FileSignature className="size-7" />
            Contratos
          </h1>
          <p className="text-sm text-muted-foreground">
            Gestão de contratos dos alunos
          </p>
        </div>

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
          <div className="p-6 text-center">Carregando contratos...</div>
        ) : contratos.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            Nenhum contrato encontrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Escola</TableHead>
                  <TableHead>Mensalidade</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {contratos.map((contrato) => (
                  <TableRow key={contrato.id}>
                    <TableCell className="font-medium">
                      {contrato.numero}
                    </TableCell>

                    <TableCell>{contrato.alunos?.nome ?? "-"}</TableCell>

                    <TableCell>
                      {contrato.alunos?.escolas?.nome ?? "-"}
                    </TableCell>

                    <TableCell>
                      {moeda(Number(contrato.valor_mensalidade))}
                    </TableCell>

                    <TableCell>Dia {contrato.dia_vencimento}</TableCell>

                    <TableCell>{contrato.status ?? "-"}</TableCell>

                    <TableCell>
                      <Button asChild variant="ghost" size="icon">
                        <Link to={`/contratos/${contrato.id}`}>
                          <Eye className="size-4" />
                        </Link>
                      </Button>
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