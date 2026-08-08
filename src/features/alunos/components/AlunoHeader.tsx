import { Link } from "react-router-dom";
import { FileText, Phone } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui-kit/primitives";
import type { Aluno } from "@/features/alunos/types/alunos";
import { formatPhone } from "@/utils/format-text";

interface AlunoHeaderProps {
  readonly aluno: Aluno | any;
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
  const nomeEscola = aluno.escolas?.nome || aluno.escola || "Escola não informada";
  
  // Tenta obter telefone dos responsáveis
  const vinculos = aluno.aluno_responsavel || aluno.alunos_responsaveis || [];
  const primeiroResponsavel = vinculos[0]?.responsaveis || vinculos[0]?.responsavel;
  const telefoneContato = primeiroResponsavel?.telefone;
  const telefoneFormatado = formatPhone(telefoneContato);

  const handleContatar = () => {
    if (telefoneContato) {
      window.open(`tel:${telefoneContato.replace(/\D/g, "")}`, "_self");
    } else {
      toast.info(`Nenhum telefone de contato encontrado para ${aluno.nome}.`);
    }
  };

  const statusNormalizado = aluno.status?.toLowerCase() === "ativo" ? "ativo" : "inativo";
  const fotoUrl = aluno.foto_url || aluno.foto || aluno.avatar_url || undefined;

  return (
    <section className="surface-card overflow-hidden rounded-2xl border border-border bg-card">
      {/* Banner Superior com Gradiente Semântico */}
      <div className="h-20 sm:h-24 bg-gradient-to-r from-primary/85 via-primary/70 to-accent/70" />
      
      <div className="grid grid-cols-1 items-start sm:items-end gap-4 px-4 sm:px-5 pb-5 sm:grid-cols-[minmax(0,1fr)_auto]">
        {/* Bloco do Avatar e Informações do Aluno */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <Avatar className="-mt-10 size-20 sm:size-24 shrink-0 border-4 border-card shadow-md">
            <AvatarImage src={fotoUrl} alt={aluno.nome} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">
              {getIniciais(aluno.nome)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 pb-1 w-full sm:w-auto">
            <h1 className="truncate font-display text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
              {aluno.nome}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 sm:truncate mt-0.5">
              {nomeEscola} · {aluno.serie || "Série N/I"} · {aluno.turno || "Turno N/I"}
            </p>
          </div>
        </div>

        {/* Botões de Ação (Grid de 2 colunas no Mobile, Flex no Desktop) */}
        <div className="grid grid-cols-2 sm:flex sm:w-auto items-center gap-2 pt-2 sm:pt-0 sm:pb-1 w-full">
          <Button
            variant="outline"
            className="rounded-xl gap-2 w-full sm:w-auto justify-center"
            onClick={handleContatar}
            title={telefoneContato ? `Ligar para ${telefoneFormatado}` : "Sem telefone"}
          >
            <Phone className="size-4 shrink-0" />
            <span>Contatar</span>
          </Button>

          {onContratoClick ? (
            <Button className="rounded-xl gap-2 w-full sm:w-auto justify-center" onClick={onContratoClick}>
              <FileText className="size-4 shrink-0" />
              <span>Contrato</span>
            </Button>
          ) : (
            <Button asChild className="rounded-xl gap-2 w-full sm:w-auto justify-center">
              <Link to={`/contratos?alunoId=${aluno.id}`}>
                <FileText className="size-4 shrink-0" />
                <span>Contrato</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}