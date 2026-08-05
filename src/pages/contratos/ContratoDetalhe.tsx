// src/pages/ContratoDetalhe.tsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bus,
  CalendarDays,
  School,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { buscarContrato, type Contrato } from "@/services/contratos.service";

function Campo({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
        {label}
      </span>
      <p className="text-xs font-medium text-foreground">{value || "—"}</p>
    </div>
  );
}

function moeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function ContratoDetalhe() {
  const { id } = useParams();
  const [contrato, setContrato] = useState<Contrato | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        if (!id) return;
        const dados = await buscarContrato(id);
        setContrato(dados);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar detalhes do contrato");
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [id]);

  if (carregando) {
    return (
      <div className="mx-auto max-w-4xl p-12 text-center text-xs text-muted-foreground animate-pulse">
        Carregando detalhes do contrato...
      </div>
    );
  }

  if (!contrato) {
    return (
      <div className="mx-auto max-w-4xl py-16 text-center space-y-4">
        <h1 className="text-xl font-semibold text-foreground">
          Contrato não encontrado
        </h1>
        <p className="text-xs text-muted-foreground">
          Verifique a URL ou volte para a lista geral de contratos.
        </p>
        <div>
          <Button asChild size="sm" className="h-9 rounded-lg text-xs">
            <Link to="/contratos">Voltar para contratos</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-2">
      {/* Header Minimalista */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-6">
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
          >
            <Link to="/contratos">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>

          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Contrato {contrato.numero}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Detalhes comerciais, financeiros e vínculos
            </p>
          </div>
        </div>
      </div>

      {/* Grid Minimalista de Conteúdo */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Informações Financeiras */}
        <div className="rounded-xl border border-border/60 bg-card/50 p-6 space-y-6">
          <div>
            <h2 className="text-sm font-medium text-foreground">Contrato</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Informações financeiras</p>
          </div>

          <div className="space-y-4 pt-2 border-t border-border/40">
            <Campo label="Número" value={contrato.numero} />
            <Campo
              label="Valor mensalidade"
              value={moeda(Number(contrato.valor_mensalidade))}
            />
            <Campo
              label="Dia de vencimento"
              value={`Dia ${contrato.dia_vencimento}`}
            />
            <Campo
              label="Forma de pagamento"
              value={contrato.forma_pagamento ?? "—"}
            />
            <Campo label="Status" value={contrato.status ?? "—"} />
          </div>
        </div>

        {/* Aluno Vinculado */}
        <div className="rounded-xl border border-border/60 bg-card/50 p-6 space-y-6">
          <div>
            <h2 className="text-sm font-medium text-foreground">Aluno</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Aluno vinculado</p>
          </div>

          <div className="space-y-4 pt-2 border-t border-border/40">
            <div className="flex items-center gap-2.5">
              <div className="grid size-7 shrink-0 place-items-center rounded-md bg-muted/50 text-muted-foreground">
                <User className="size-3.5" />
              </div>
              <span className="text-xs font-medium text-foreground">
                {contrato.alunos?.nome ?? "—"}
              </span>
            </div>
            <Campo
              label="Matrícula"
              value={contrato.alunos?.matricula ?? "—"}
            />
          </div>
        </div>

        {/* Vigência */}
        <div className="rounded-xl border border-border/60 bg-card/50 p-6 space-y-6">
          <div>
            <h2 className="text-sm font-medium text-foreground">Datas</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Vigência do contrato</p>
          </div>

          <div className="space-y-4 pt-2 border-t border-border/40">
            <div className="flex items-center gap-2.5">
              <div className="grid size-7 shrink-0 place-items-center rounded-md bg-muted/50 text-muted-foreground">
                <CalendarDays className="size-3.5" />
              </div>
              <span className="text-xs font-medium text-foreground">Período</span>
            </div>
            <Campo label="Início" value={contrato.data_inicio} />
            <Campo label="Fim" value={contrato.data_fim ?? "Indeterminado"} />
          </div>
        </div>
      </div>

      {/* Relacionamentos & Observações */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border/60 bg-card/50 p-6 space-y-4">
          <h2 className="text-sm font-medium text-foreground">Vínculos Institucionais</h2>
          <div className="grid gap-4 pt-2 border-t border-border/40 sm:grid-cols-2">
            <div className="flex items-start gap-2.5">
              <div className="grid size-7 shrink-0 place-items-center rounded-md bg-muted/50 text-muted-foreground mt-0.5">
                <School className="size-3.5" />
              </div>
              <div className="w-full">
                <Campo
                  label="Escola"
                  value={contrato.alunos?.escolas?.nome ?? "—"}
                />
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="grid size-7 shrink-0 place-items-center rounded-md bg-muted/50 text-muted-foreground mt-0.5">
                <Bus className="size-3.5" />
              </div>
              <div className="w-full">
                <Campo
                  label="Rota"
                  value={contrato.alunos?.rotas?.nome ?? "—"}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/50 p-6 space-y-4">
          <h2 className="text-sm font-medium text-foreground">Observações</h2>
          <div className="pt-2 border-t border-border/40">
            <p className="text-xs text-muted-foreground/90 leading-relaxed">
              {contrato.observacoes ?? "Nenhuma observação cadastrada para este contrato."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}