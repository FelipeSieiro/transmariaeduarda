import { Link } from "react-router-dom";
import { FileText, Phone } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui-kit/primitives";
import type { Aluno } from "@/types";

interface AlunoHeaderProps {
  readonly aluno: Aluno;
  readonly onContratoClick?: () => void;
}

function getIniciais(nome?: string): string {
  if (!nome) return "AL";
  const partes = nome.trim().split(" ").filter(Boolean);
  if (partes.length === 0) return "AL";
  if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

export function AlunoHeader({ aluno, onContratoClick }: AlunoHeaderProps) {
  const nomeEscola = typeof aluno.escolas === "string"
    ? aluno.escolas
    : aluno.escola?.nome ?? aluno.escolas?.nome ?? aluno.escola_nome ?? "Escola não informada";

  const nomeRota = typeof aluno.rota === "string"
    ? aluno.rota
    : aluno.rota_obj?.nome ?? aluno.rota_nome ?? "Sem Rota";

  const telefoneContato = aluno.telefone || aluno.responsaveis?.[0]?.telefone;

  const handleContatar = () => {
    if (telefoneContato) {
      window.open(`tel:${telefoneContato.replace(/\D/g, "")}`, "_self");
    } else {
      toast.info(`Nenhum telefone de contato encontrado para ${aluno.nome}.`);
    }
  };

  const statusNormalizado = aluno.status?.toLowerCase() === "ativo" ? "ativo" : "inativo";
  const pagamentoNormalizado = aluno.pagamento || aluno.status_pagamento || "regular";

  return (
    <section className="surface-card overflow-hidden rounded-2xl border border-border bg-card">
      <div className="h-20 bg-gradient-to-r from-primary/85 via-primary/70 to-gold/70" />
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 px-5 pb-5 sm:flex sm:flex-wrap sm:justify-between">
        <div className="flex min-w-0 items-end gap-4">
          <Avatar className="-mt-10 size-20 shrink-0 border-4 border-card shadow-md">
            <AvatarImage src={aluno.foto || aluno.avatar_url} alt={aluno.nome} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
              {getIniciais(aluno.nome)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 pb-1">
            <h1 className="truncate font-display text-2xl font-semibold tracking-tight text-foreground">
              {aluno.nome}
            </h1>
            <p className="truncate text-sm text-muted-foreground">
              {nomeEscola} · {aluno.serie || "Série N/I"} · {aluno.turno || "Turno N/I"}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusPill status={statusNormalizado} />
              <StatusPill status={pagamentoNormalizado} />
              {nomeRota && (
                <Badge variant="secondary" className="rounded-md font-normal text-xs">
                  {nomeRota}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 gap-2 pb-1">
          <Button
            variant="outline"
            className="rounded-xl gap-2"
            onClick={handleContatar}
            title={telefoneContato ? `Ligar para ${telefoneContato}` : "Sem telefone"}
          >
            <Phone className="size-4" />
            <span>Contatar</span>
          </Button>

          {onContratoClick ? (
            <Button className="rounded-xl gap-2" onClick={onContratoClick}>
              <FileText className="size-4" />
              <span>Contrato</span>
            </Button>
          ) : (
            <Button asChild className="rounded-xl gap-2">
              <Link to={`/contratos?alunoId=${aluno.id}`}>
                <FileText className="size-4" />
                <span>Contrato</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}