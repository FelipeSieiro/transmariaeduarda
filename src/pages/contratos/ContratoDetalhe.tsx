// src/pages/ContratoDetalhe.tsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bus,
  CalendarDays,
  FileSignature,
  School,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui-kit/primitives";
import { buscarContrato, type Contrato } from "@/services/contratos.service";

function Campo({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-medium text-foreground">{value || "—"}</p>
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
      <div className="mx-auto max-w-6xl p-12 text-center text-sm text-muted-foreground animate-pulse">
        Carregando detalhes do contrato...
      </div>
    );
  }

  if (!contrato) {
    return (
      <div className="mx-auto max-w-6xl py-16 text-center space-y-4">
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Contrato não encontrado
        </h1>
        <p className="text-sm text-muted-foreground">
          Verifique a URL ou volte para a lista geral de contratos.
        </p>
        <div>
          <Button asChild className="rounded-xl">
            <Link to="/contratos">Voltar para contratos</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="-ml-2 rounded-xl text-muted-foreground hover:text-foreground"
      >
        <Link to="/contratos">
          <ArrowLeft className="size-4 mr-2" />
          Voltar para contratos
        </Link>
      </Button>

      <header className="space-y-1">
        <h1 className="font-display flex items-center gap-2.5 text-3xl font-semibold tracking-tight text-foreground">
          <FileSignature className="size-7 text-primary" />
          Contrato {contrato.numero}
        </h1>
        <p className="text-sm text-muted-foreground">
          Detalhes comerciais, financeiros e vínculos do contrato
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Contrato" description="Informações financeiras">
          <div className="space-y-4">
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
        </SectionCard>

        <SectionCard title="Aluno" description="Aluno vinculado">
          <div className="space-y-4">
            <div className="inline-flex p-2 rounded-xl bg-primary/10 text-primary">
              <User className="size-5" />
            </div>
            <Campo label="Nome" value={contrato.alunos?.nome ?? "—"} />
            <Campo
              label="Matrícula"
              value={contrato.alunos?.matricula ?? "—"}
            />
          </div>
        </SectionCard>

        <SectionCard title="Datas" description="Vigência do contrato">
          <div className="space-y-4">
            <div className="inline-flex p-2 rounded-xl bg-primary/10 text-primary">
              <CalendarDays className="size-5" />
            </div>
            <Campo label="Início" value={contrato.data_inicio} />
            <Campo label="Fim" value={contrato.data_fim ?? "Indeterminado"} />
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Relacionamentos"
        description="Dados institucionais vinculados ao aluno"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
              <School className="size-5" />
            </div>
            <div className="w-full">
              <Campo
                label="Escola"
                value={contrato.alunos?.escolas?.nome ?? "—"}
              />
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
              <Bus className="size-5" />
            </div>
            <div className="w-full">
              <Campo
                label="Rota"
                value={contrato.alunos?.rotas?.nome ?? "—"}
              />
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Observações" description="Informações adicionais do contrato">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {contrato.observacoes ?? "Nenhuma observação cadastrada para este contrato."}
        </p>
      </SectionCard>
    </div>
  );
}