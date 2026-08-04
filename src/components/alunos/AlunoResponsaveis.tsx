// src/components/alunos/AlunoResponsaveis.tsx
import { Mail, Phone, MapPin, UserX, ShieldCheck } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SectionCard } from "@/components/ui-kit/primitives";
import type { Aluno, Responsavel } from "@/types";

interface AlunoResponsaveisProps {
  readonly aluno: Aluno;
}

function getIniciais(nome?: string): string {
  if (!nome) return "RS";
  const partes = nome.trim().split(" ").filter(Boolean);
  if (partes.length === 0) return "RS";
  if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

export function AlunoResponsaveis({ aluno }: AlunoResponsaveisProps) {
  // Normaliza a lista de responsáveis suportando tanto múltiplos quanto o formato legado/único
  const listaResponsaveis: readonly Responsavel[] =
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
          listaResponsaveis.map((resp, index) => {
            const key = resp.id || `${resp.nome}-${index}`;
            const telefoneLimpo = resp.telefone ? resp.telefone.replace(/\D/g, "") : "";

            return (
              <div key={key} className="space-y-3">
                {index > 0 && <Separator className="my-4" />}

                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="size-10 shrink-0 border border-border">
                      <AvatarImage src={resp.foto || resp.avatar_url} alt={resp.nome} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                        {getIniciais(resp.nome)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {resp.nome}
                      </p>
                      <p className="truncate text-xs text-muted-foreground capitalize">
                        {resp.parentesco || "Responsável"}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1">
                    {resp.responsavel_financeiro && (
                      <Badge
                        variant="outline"
                        className="border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0 text-[10px] font-medium text-emerald-600 dark:text-emerald-400"
                      >
                        Financeiro
                      </Badge>
                    )}
                    {resp.responsavel_emergencia && (
                      <Badge
                        variant="outline"
                        className="border-amber-500/30 bg-amber-500/10 px-1.5 py-0 text-[10px] font-medium text-amber-600 dark:text-amber-400"
                      >
                        Emergência
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5 pl-1 text-xs text-muted-foreground">
                  {resp.telefone && (
                    <a
                      href={`tel:${telefoneLimpo}`}
                      className="flex items-center gap-2 transition-colors hover:text-foreground w-fit"
                      title="Ligar para este número"
                    >
                      <Phone className="size-3.5 shrink-0 text-primary" />
                      <span>{resp.telefone}</span>
                    </a>
                  )}
                  {resp.email && (
                    <a
                      href={`mailto:${resp.email}`}
                      className="flex min-w-0 items-center gap-2 transition-colors hover:text-foreground w-fit max-w-full"
                      title="Enviar e-mail"
                    >
                      <Mail className="size-3.5 shrink-0 text-primary" />
                      <span className="truncate">{resp.email}</span>
                    </a>
                  )}
                  {resp.endereco && (
                    <div className="flex items-center gap-2 text-muted-foreground/90">
                      <MapPin className="size-3.5 shrink-0 text-primary" />
                      <span className="truncate">{resp.endereco}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
            <UserX className="size-8 mb-2 stroke-[1.5] text-muted-foreground/60" />
            <p className="text-sm font-medium text-foreground">Nenhum responsável cadastrado</p>
            <p className="text-xs text-muted-foreground/80 mt-0.5">
              Não constam responsáveis vinculados a este perfil.
            </p>
          </div>
        )}
      </div>
    </SectionCard>
  );
}