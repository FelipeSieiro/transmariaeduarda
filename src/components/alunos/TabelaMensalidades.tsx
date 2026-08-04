// src/components/financeiro/TabelaMensalidades.tsx
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Clock, AlertCircle, DollarSign, Calendar, CreditCard } from "lucide-react";

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
  DialogDescription,
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
} from "@/services/mensalidades.service";
import { FORMAS_PAGAMENTO } from "@/constants";
import type { Mensalidade } from "@/types";

interface Props {
  readonly contratoId: string;
}

// Função auxiliar para formatar "2026-08" ou "08/2026" para "Agosto / 2026"
function formatarMesReferencia(valor?: string): string {
  if (!valor) return "-";

  if (valor.includes("-")) {
    const [ano, mes] = valor.split("-");
    const dataObj = new Date(Number(ano), Number(mes) - 1, 1);
    if (!isNaN(dataObj.getTime())) {
      const mesExtenso = dataObj.toLocaleDateString("pt-BR", { month: "long" });
      return `${mesExtenso.charAt(0).toUpperCase() + mesExtenso.slice(1)} / ${ano}`;
    }
  }

  if (valor.includes("/")) {
    const [mes, ano] = valor.split("/");
    const dataObj = new Date(Number(ano), Number(mes) - 1, 1);
    if (!isNaN(dataObj.getTime())) {
      const mesExtenso = dataObj.toLocaleDateString("pt-BR", { month: "long" });
      return `${mesExtenso.charAt(0).toUpperCase() + mesExtenso.slice(1)} / ${ano}`;
    }
  }

  return valor;
}

export function TabelaMensalidades({ contratoId }: Props) {
  const [mensalidades, setMensalidades] = useState<readonly Mensalidade[]>([]);
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
      setMensalidades(dados || []);
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

  const renderStatus = (status?: string | null) => {
    switch (status?.toLowerCase()) {
      case "pago":
        return (
          <Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 gap-1 border-emerald-500/30">
            <CheckCircle2 className="size-3" /> Pago
          </Badge>
        );
      case "atrasado":
        return (
          <Badge variant="outline" className="bg-rose-500/15 text-rose-700 dark:text-rose-400 gap-1 border-rose-500/30">
            <AlertCircle className="size-3" /> Atrasado
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-amber-500/15 text-amber-700 dark:text-amber-400 gap-1 border-amber-500/30">
            <Clock className="size-3" /> Pendente
          </Badge>
        );
    }
  };

  if (carregando) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-muted-foreground gap-2">
        <Clock className="size-4 animate-spin text-primary" />
        <span>Carregando parcelas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mês / Referência</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mensalidades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Nenhuma mensalidade cadastrada para este contrato.
                </TableCell>
              </TableRow>
            ) : (
              mensalidades.map((item) => (
                <TableRow key={item.id} className="transition-colors hover:bg-muted/30">
                  <TableCell className="font-medium capitalize text-foreground">
                    {formatarMesReferencia(item.competencia)}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {item.data_vencimento
                      ? new Date(item.data_vencimento).toLocaleDateString("pt-BR", { timeZone: "UTC" })
                      : "-"}
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    {Number(item.valor || 0).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell>{renderStatus(item.status)}</TableCell>
                  <TableCell className="text-right">
                    {item.status?.toLowerCase() !== "pago" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 text-xs rounded-lg"
                        onClick={() => setMensalidadeSelecionada(item)}
                      >
                        <DollarSign className="size-3.5 text-primary" /> Dar Baixa
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
        <DialogContent className="sm:max-w-[400px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="size-5 text-primary" />
              <span>Registrar Pagamento</span>
            </DialogTitle>
            <DialogDescription>
              Confirme os dados da parcela para dar baixa no sistema.
            </DialogDescription>
          </DialogHeader>

          {mensalidadeSelecionada && (
            <div className="space-y-4 py-2">
              <div className="rounded-xl bg-muted/60 p-3.5 text-sm space-y-1.5 border border-border/50">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mês Referência:</span>
                  <span className="font-medium text-foreground capitalize">
                    {formatarMesReferencia(mensalidadeSelecionada.competencia)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valor da Parcela:</span>
                  <span className="font-semibold text-foreground">
                    {Number(mensalidadeSelecionada.valor || 0).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground block">
                  Forma de Pagamento
                </label>
                <Select value={formaPagamento} onValueChange={setFormaPagamento}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Selecione a forma..." />
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

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setMensalidadeSelecionada(null)}
              disabled={processando}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button onClick={handleBaixarPagamento} disabled={processando} className="rounded-xl gap-1.5">
              <CheckCircle2 className="size-4" />
              {processando ? "Confirmando..." : "Confirmar Baixa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}