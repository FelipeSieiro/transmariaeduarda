// src/components/alunos/TabelaMensalidades.tsx
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Clock, AlertCircle, DollarSign } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  buscarMensalidadesPorContrato,
  registrarPagamento,
  type Mensalidade,
} from "@/services/mensalidades.service";
import { FORMAS_PAGAMENTO } from "@/constants";

interface Props {
  contratoId: string;
}

export function TabelaMensalidades({ contratoId }: Props) {
  const [mensalidades, setMensalidades] = useState<Mensalidade[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Controle de Modal de Pagamento
  const [mensalidadeSelecionada, setMensalidadeSelecionada] = useState<Mensalidade | null>(null);
  const [formaPagamento, setFormaPagamento] = useState("PIX");
  const [processando, setProcessando] = useState(false);

  useEffect(() => {
    if (contratoId) {
      carregarMensalidades();
    }
  }, [contratoId]);

  async function carregarMensalidades() {
    try {
      setCarregando(true);
      const dados = await buscarMensalidadesPorContrato(contratoId);
      setMensalidades(dados);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar mensalidades");
    } finally {
      setCarregando(false);
    }
  }

  async function handleBaixarPagamento() {
    if (!mensalidadeSelecionada) return;

    try {
      setProcessando(true);
      await registrarPagamento(mensalidadeSelecionada.id, {
        forma_pagamento: formaPagamento,
        data_pagamento: new Date().toISOString().split("T")[0],
      });

      toast.success("Pagamento registrado com sucesso!");
      setMensalidadeSelecionada(null);
      carregarMensalidades();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao registrar pagamento");
    } finally {
      setProcessando(false);
    }
  }

  const renderStatus = (status: string) => {
    switch (status) {
      case "pago":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 gap-1 border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Pago
          </Badge>
        );
      case "atrasado":
        return (
          <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 gap-1 border-rose-200">
            <AlertCircle className="w-3 h-3" /> Atrasado
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 gap-1 border-amber-200">
            <Clock className="w-3 h-3" /> Pendente
          </Badge>
        );
    }
  };

  if (carregando) {
    return <p className="text-sm text-muted-foreground py-4 text-center">Carregando parcelas...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Competência</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mensalidades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  Nenhuma mensalidade cadastrada para este contrato.
                </TableCell>
              </TableRow>
            ) : (
              mensalidades.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.competencia}</TableCell>
                  <TableCell>
                    {new Date(item.data_vencimento).toLocaleDateString("pt-BR", {
                      timeZone: "UTC",
                    })}
                  </TableCell>
                  <TableCell>
                    {Number(item.valor).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell>{renderStatus(item.status)}</TableCell>
                  <TableCell className="text-right">
                    {item.status !== "pago" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 text-xs"
                        onClick={() => setMensalidadeSelecionada(item)}
                      >
                        <DollarSign className="w-3.5 h-3.5" /> Dar Baixa
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* MODAL DE BAIXA DE PAGAMENTO */}
      <Dialog
        open={!!mensalidadeSelecionada}
        onOpenChange={(open) => !open && setMensalidadeSelecionada(null)}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Registrar Pagamento</DialogTitle>
          </DialogHeader>

          {mensalidadeSelecionada && (
            <div className="space-y-4 py-2">
              <div className="rounded-lg bg-muted p-3 text-sm space-y-1">
                <p>
                  <strong>Competência:</strong> {mensalidadeSelecionada.competencia}
                </p>
                <p>
                  <strong>Valor:</strong>{" "}
                  {Number(mensalidadeSelecionada.valor).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                  Forma de Pagamento
                </label>
                <Select value={formaPagamento} onValueChange={setFormaPagamento}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {FORMAS_PAGAMENTO.map((forma) => (
                      <SelectItem key={forma} value={forma}>
                        {forma}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setMensalidadeSelecionada(null)}
              disabled={processando}
            >
              Cancelar
            </Button>
            <Button onClick={handleBaixarPagamento} disabled={processando}>
              {processando ? "Confirmando..." : "Confirmar Baixa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}