// src/components/alunos/AlunoResponsaveis.tsx
import { Mail, Phone, MapPin, UserX, ShieldCheck } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SectionCard } from "@/components/ui-kit/primitives";
import type { Aluno } from "@/features/alunos/types/alunos";
import type { AlunoResponsavelVinculo } from "@/features/responsaveis/types/responsavel";
import { formatPhone, formatEmail } from "@/utils/format-text";

interface AlunoResponsaveisProps {
  readonly aluno: Aluno | any;
}

function getIniciais(nome?: string): string {
  if (!nome) return "RS";
  const partes = nome.trim().split(" ").filter(Boolean);
  if (partes.length === 0) return "RS";
  if (partes.length === 1) return partes[0]?.substring(0, 2).toUpperCase() || "RS";
  const primeiraLetra = partes[0]?.[0] || "";
  const ultimaLetra = partes[partes.length - 1]?.[0] || "";
  return (primeiraLetra + ultimaLetra).toUpperCase() || "RS";
}

export function AlunoResponsaveis({ aluno }: AlunoResponsaveisProps) {
  // Usa a estrutura real do tipo Aluno com vinculos de responsáveis
  const vinculos: AlunoResponsavelVinculo[] = 
    aluno.aluno_responsavel || aluno.alunos_responsaveis || [];

  return (
    <SectionCard
      title="Responsáveis"
      description="Contatos autorizados cadastrados"
    >
      <div className="space-y-5">
        {vinculos.length > 0 ? (
          vinculos.map((vinculo, index) => {
            const responsavel = vinculo.responsaveis || vinculo.responsavel;
            if (!responsavel) return null;

            const key = responsavel.id || `${responsavel.nome}-${index}`;
            const telefoneLimpo = responsavel.telefone ? responsavel.telefone.replace(/\D/g, "") : "";
            const telefoneFormatado = formatPhone(responsavel.telefone);
            const emailFormatado = formatEmail(responsavel.email);

            return (
              <div key={key} className="space-y-3">
                {index > 0 && <Separator className="my-4" />}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="size-10 shrink-0 border border-border">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                        {getIniciais(responsavel.nome)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {responsavel.nome}
                      </p>
                      <p className="truncate text-xs text-muted-foreground capitalize">
                        {vinculo.parentesco || "Responsável"}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1">
                    {vinculo.responsavel_financeiro && (
                      <Badge
                        variant="outline"
                        className="border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0 text-[10px] font-medium text-emerald-600 dark:text-emerald-400"
                      >
                        Financeiro
                      </Badge>
                    )}
                    {vinculo.responsavel_emergencia && (
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
                  {responsavel.telefone && (
                    <a
                      href={`tel:${telefoneLimpo}`}
                      className="flex items-center gap-2 transition-colors hover:text-foreground w-fit"
                      title="Ligar para este número"
                    >
                      <Phone className="size-3.5 shrink-0 text-primary" />
                      <span>{telefoneFormatado}</span>
                    </a>
                  )}
                  {responsavel.email && (
                    <a
                      href={`mailto:${responsavel.email}`}
                      className="flex min-w-0 items-center gap-2 transition-colors hover:text-foreground w-fit max-w-full"
                      title="Enviar e-mail"
                    >
                      <Mail className="size-3.5 shrink-0 text-primary" />
                      <span className="truncate">{emailFormatado}</span>
                    </a>
                  )}
                  {responsavel.endereco && (
                    <div className="flex items-center gap-2 text-muted-foreground/90">
                      <MapPin className="size-3.5 shrink-0 text-primary" />
                      <span className="truncate">{responsavel.endereco}</span>
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