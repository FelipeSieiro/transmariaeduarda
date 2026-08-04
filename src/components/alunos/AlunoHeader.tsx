import { Link } from "react-router-dom";
import { Phone, FileText } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui-kit/primitives";
import type { Aluno } from "@/data/mock";

interface AlunoHeaderProps {
  aluno: Aluno;
}

export function AlunoHeader({ aluno }: AlunoHeaderProps) {
  return (
    <section className="surface-card overflow-hidden">
      <div className="h-20 bg-gradient-to-r from-primary/85 to-gold/70" />
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 px-5 pb-5 sm:flex sm:flex-wrap sm:justify-between">
        <div className="flex min-w-0 items-end gap-4">
          <Avatar className="-mt-10 size-20 shrink-0 border-4 border-card">
            <AvatarImage src={aluno.foto} alt={aluno.nome} />
            <AvatarFallback>{aluno.nome.slice(0, 2)}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 pb-1">
            <h1 className="truncate font-display text-2xl font-semibold tracking-tight">
              {aluno.nome}
            </h1>
            <p className="truncate text-sm text-muted-foreground">
              {aluno.escola} · {aluno.serie} · {aluno.turno}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusPill status={aluno.status} />
              <StatusPill status={aluno.pagamento} />
              <Badge variant="secondary">{aluno.rota}</Badge>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 gap-2 pb-1">
          <Button variant="outline" className="rounded-xl">
            <Phone className="mr-2 size-4" />
            Contatar
          </Button>
          <Button className="rounded-xl">
            <FileText className="mr-2 size-4" />
            Contrato
          </Button>
        </div>
      </div>
    </section>
  );
}