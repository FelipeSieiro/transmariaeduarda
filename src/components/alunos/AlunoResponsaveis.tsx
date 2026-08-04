import { Bus, Mail, Phone } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SectionCard } from "@/components/ui-kit/primitives";
import type { Aluno } from "@/data/mock";

interface AlunoResponsaveisProps {
  aluno: Aluno;
}

export function AlunoResponsaveis({ aluno }: AlunoResponsaveisProps) {
  const listaResponsaveis =
    aluno.responsaveis && aluno.responsaveis.length > 0
      ? aluno.responsaveis
      : aluno.responsavel
        ? [
            {
              id: "1",
              nome: aluno.responsavel,
              parentesco: aluno.parentesco || "Responsável",
              telefone: aluno.telefone,
              email: aluno.email,
              endereco: aluno.enderecoResponsavel || aluno.endereco,
              responsavel_financeiro: true,
              responsavel_emergencia: true,
            },
          ]
        : [];

  return (
    <SectionCard
      title="Responsáveis"
      description="Contatos autorizados cadastrados"
    >
      <div className="space-y-5">
        {listaResponsaveis.length > 0 ? (
          listaResponsaveis.map((resp, index) => (
            <div key={resp.id || index} className="space-y-3">
              {index > 0 && <Separator className="my-4" />}

              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar className="size-10 shrink-0">
                    <AvatarFallback>
                      {resp.nome ? resp.nome.slice(0, 2).toUpperCase() : "RS"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{resp.nome}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {resp.parentesco || "Responsável"}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1">
                  {resp.responsavel_financeiro && (
                    <Badge
                      variant="outline"
                      className="border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0 text-[10px] text-emerald-600 dark:text-emerald-400"
                    >
                      Financeiro
                    </Badge>
                  )}
                  {resp.responsavel_emergencia && (
                    <Badge
                      variant="outline"
                      className="border-amber-500/30 bg-amber-500/10 px-1.5 py-0 text-[10px] text-amber-600 dark:text-amber-400"
                    >
                      Emergência
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-1.5 pl-1 text-xs text-muted-foreground">
                {resp.telefone && (
                  <p className="flex items-center gap-2">
                    <Phone className="size-3.5 shrink-0" />
                    <span>{resp.telefone}</span>
                  </p>
                )}
                {resp.email && (
                  <p className="flex min-w-0 items-center gap-2">
                    <Mail className="size-3.5 shrink-0" />
                    <span className="truncate">{resp.email}</span>
                  </p>
                )}
                {resp.endereco && (
                  <p className="flex items-center gap-2">
                    <Bus className="size-3.5 shrink-0" />
                    <span className="truncate">{resp.endereco}</span>
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            Nenhum responsável cadastrado.
          </p>
        )}
      </div>
    </SectionCard>
  );
}