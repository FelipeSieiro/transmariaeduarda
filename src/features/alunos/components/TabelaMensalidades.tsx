// src/components/financeiro/TabelaMensalidades.tsx
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Clock, AlertCircle, DollarSign, CreditCard } from "lucide-react";

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
} from "@/features/alunos/services/mensalidades.service";
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
          <Badge variant="outline" className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 gap-1 border-emerald-500/30 text-xs">
            <CheckCircle2 className="size-3" /> Pago
          </Badge>
        );
      case "atrasado":
        return (
          <Badge variant="outline" className="bg-rose-500/15 text-rose-700 dark:text-rose-400 gap-1 border-rose-500/30 text-xs">
            <AlertCircle className="size-3" /> Atrasado
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-amber-500/15 text-amber-700 dark:text-amber-400 gap-1 border-amber-500/30 text-xs">
            <Clock className="size-3" /> Pendente
          </Badge>
        );
    }
  };

  if (carregando) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-muted-foreground gap-2">
        <Clock className="size-4 animate-spin text-primary" />
        <span>Carregando parcelas...</span>
      </div>
    );
  }

  if (mensalidades.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground shadow-sm">
        Nenhuma mensalidade cadastrada para este contrato.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* VISÃO MOBILE: CARDS (Visível apenas em telas pequenas) */}
      <div className="grid grid-cols-1 gap-3 sm:hidden">
        {mensalidades.map((item) => {
          const isPago = item.status?.toLowerCase() === "pago";
          return (
            <div 
              key={item.id} 
              className="rounded-xl border border-border/70 bg-card p-4 shadow-sm space-y-3 transition-all hover:border-border"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-medium text-muted-foreground block uppercase tracking-wider">Referência</span>
                  <h4 className="font-semibold text-foreground capitalize text-base">
                    {formatarMesReferencia(item.competencia)}
                  </h4>
                </div>
                <div>{renderStatus(item.status)}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40 text-xs">
                <div>
                  <span className="text-muted-foreground block">Vencimento</span>
                  <span className="font-mono font-medium text-foreground">
                    {item.data_vencimento
                      ? new Date(item.data_vencimento).toLocaleDateString("pt-BR", { timeZone: "UTC" })
                      : "-"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Valor</span>
                  <span className="font-semibold text-foreground text-sm">
                    {Number(item.valor || 0).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
              </div>

              {!isPago && (
                <div className="pt-2">
                  <Button
                    size="sm"
                    className="w-full gap-1.5 text-xs rounded-xl h-9"
                    onClick={() => setMensalidadeSelecionada(item)}
                  >
                    <DollarSign className="size-3.5" /> Dar Baixa em Pagamento
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* VISÃO DESKTOP: TABELA TRADICIONAL (Oculta em mobile, visível em sm+) */}
      <div className="hidden sm:block rounded-xl border border-border bg-card overflow-hidden shadow-sm">
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
            {mensalidades.map((item) => (
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
                      className="gap-1.5 text-xs rounded-lg h-8"
                      onClick={() => setMensalidadeSelecionada(item)}
                    >
                      <DollarSign className="size-3.5 text-primary" /> Dar Baixa
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* MODAL DE BAIXA DE PAGAMENTO */}
      <Dialog
        open={!!mensalidadeSelecionada}
        onOpenChange={(open) => !open && setMensalidadeSelecionada(null)}
      >
        <DialogContent className="sm:max-w-[400px] w-[92vw] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="size-5 text-primary" />
              <span>Registrar Pagamento</span>
            </DialogTitle>
            <DialogDescription>
              Confirme os dados da parcela para dar baixa no sistema.
            </DialogDescription>
          </DialogHeader>

          {mensalidadeSelecionada && (
            <div className="space-y-4 py-2">
              <div className="rounded-xl bg-muted/60 p-3.5 text-sm space-y-2 border border-border/50">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Mês Referência:</span>
                  <span className="font-medium text-foreground capitalize">
                    {formatarMesReferencia(mensalidadeSelecionada.competencia)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Valor da Parcela:</span>
                  <span className="font-semibold text-foreground text-base">
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
                  <SelectTrigger className="rounded-xl h-10">
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

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              variant="outline"
              onClick={() => setMensalidadeSelecionada(null)}
              disabled={processando}
              className="rounded-xl w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button onClick={handleBaixarPagamento} disabled={processando} className="rounded-xl gap-1.5 w-full sm:w-auto">
              <CheckCircle2 className="size-4" />
              {processando ? "Confirmando..." : "Confirmar Baixa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}