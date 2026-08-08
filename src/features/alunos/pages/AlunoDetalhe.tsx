import { useParams } from "react-router-dom";
import { Bus } from "lucide-react";

import { useAlunoDetalhe } from "@/features/alunos/hooks/useAlunoDetalhe";
import { useHistoricoCompleto } from "@/features/alunos/hooks/useHistoricoCompleto";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { SectionCard } from "@/components/ui-kit/primitives";

import { AlunoHeader } from "@/features/alunos/components/AlunoHeader";
import { AlunoDadosPessoais } from "@/features/alunos/components/AlunoDadosPessoais";
import { AlunoEndereco } from "@/features/alunos/components/AlunoEndereco";
import { AlunoResponsaveis } from "@/features/alunos/components/AlunoResponsaveis";
import { AlunoContrato } from "@/features/alunos/components/AlunoContrato";
import { TabelaMensalidades } from "@/features/alunos/components/TabelaMensalidades";
import { AlunoOcorrencias } from "@/features/alunos/components/AlunoOcorrencias";
import { AlunoHistorico } from "@/features/alunos/components/AlunoHistorico";
import { AlunoDocumentos } from "@/features/alunos/components/AlunoDocumentos";
import { AlunoFotos } from "@/features/alunos/components/AlunoFotos";
import { GradeSemanalRotas } from "@/features/agenda/components/GradeSemanalRotas";
import { AlunoDetalheLoading } from "@/features/alunos/components/AlunoDetalheLoading";
import { AlunoDetalheErro } from "@/features/alunos/components/AlunoDetalheErro";
import { AlunoDetalheBackButton } from "@/features/alunos/components/AlunoDetalheBackButton";

export default function AlunoDetalhe() {
  const { alunoId } = useParams();
  const { aluno, alunoOriginal, contrato, carregando, erro } = useAlunoDetalhe(alunoId);
  const historicoCompleto = useHistoricoCompleto(aluno, contrato);

  if (carregando) {
    return <AlunoDetalheLoading />;
  }

  if (!aluno || erro) {
    return <AlunoDetalheErro />;
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 py-2">
      <AlunoDetalheBackButton />

      <AlunoHeader aluno={aluno as any} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <AlunoDadosPessoais aluno={aluno as any} />
        <AlunoEndereco aluno={aluno as any} />
        <AlunoResponsaveis aluno={alunoOriginal || aluno} />
      </div>

      <Tabs
        defaultValue="transporte"
        className="space-y-4"
      >
        <TabsList
          className="
            flex
            w-full
            items-center
            justify-start
            overflow-x-auto
            rounded-xl
            border
            border-border/60
            bg-card/50
            p-1
            gap-1
            h-auto
            scrollbar-none
            shadow-2xs
          "
        >
          <TabsTrigger
            value="transporte"
            className="flex-shrink-0 justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium data-[state=active]:bg-muted data-[state=active]:text-foreground text-muted-foreground transition-all"
          >
            <Bus className="size-3.5 opacity-70" />
            Transporte / Rotas
          </TabsTrigger>

          <TabsTrigger
            value="contrato"
            className="flex-shrink-0 justify-center rounded-lg px-3 py-2 text-xs font-medium data-[state=active]:bg-muted data-[state=active]:text-foreground text-muted-foreground transition-all"
          >
            Contrato
          </TabsTrigger>

          <TabsTrigger
            value="mensalidades"
            className="flex-shrink-0 justify-center rounded-lg px-3 py-2 text-xs font-medium data-[state=active]:bg-muted data-[state=active]:text-foreground text-muted-foreground transition-all"
          >
            Mensalidades
          </TabsTrigger>

          <TabsTrigger
            value="ocorrencias"
            className="flex-shrink-0 justify-center rounded-lg px-3 py-2 text-xs font-medium data-[state=active]:bg-muted data-[state=active]:text-foreground text-muted-foreground transition-all"
          >
            Ocorrências
          </TabsTrigger>

          <TabsTrigger
            value="historico"
            className="flex-shrink-0 justify-center rounded-lg px-3 py-2 text-xs font-medium data-[state=active]:bg-muted data-[state=active]:text-foreground text-muted-foreground transition-all"
          >
            Histórico
          </TabsTrigger>

          <TabsTrigger
            value="documentos"
            className="flex-shrink-0 justify-center rounded-lg px-3 py-2 text-xs font-medium data-[state=active]:bg-muted data-[state=active]:text-foreground text-muted-foreground transition-all"
          >
            Documentos
          </TabsTrigger>

          <TabsTrigger
            value="fotos"
            className="flex-shrink-0 justify-center rounded-lg px-3 py-2 text-xs font-medium data-[state=active]:bg-muted data-[state=active]:text-foreground text-muted-foreground transition-all"
          >
            Fotos
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="transporte"
          className="mt-4"
        >
          {alunoId && (
            <GradeSemanalRotas
              alunoId={alunoId}
              nomeRotaPrincipal={(aluno as any).rota}
            />
          )}
        </TabsContent>

        <TabsContent
          value="contrato"
          className="mt-4"
        >
          <AlunoContrato contrato={contrato} />
        </TabsContent>

        <TabsContent
          value="mensalidades"
          className="mt-4"
        >
          <SectionCard
            title="Mensalidades"
            description="Histórico de cobranças e baixas do contrato"
          >
            {contrato?.id ? (
              <TabelaMensalidades
                contratoId={contrato.id}
              />
            ) : (
              <p className="py-8 text-center text-xs text-muted-foreground">
                Nenhum contrato ativo encontrado para carregar as mensalidades.
              </p>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent
          value="ocorrencias"
          className="mt-4"
        >
          <AlunoOcorrencias
            ocorrencias={(aluno as any).ocorrencias}
          />
        </TabsContent>

        <TabsContent
          value="historico"
          className="mt-4"
        >
          <AlunoHistorico
            historico={historicoCompleto}
          />
        </TabsContent>

        <TabsContent
          value="documentos"
          className="mt-4"
        >
          <AlunoDocumentos
            documentos={(aluno as any).documentos}
          />
        </TabsContent>

        <TabsContent
          value="fotos"
          className="mt-4"
        >
          <AlunoFotos />
        </TabsContent>
      </Tabs>
    </div>
  );
}