import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { buscarContratoPorAluno } from "@/services/contratos.service";
import type { Contrato } from "@/services/contratos.service";

import {
  ArrowLeft,
  Bus,
  CalendarDays,
  Download,
  FileText,
  History,
  Home,
  Images,
  Mail,
  MapPin,
  MessageSquareWarning,
  Phone,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { SectionCard, StatusPill } from "@/components/ui-kit/primitives";

import {
  alunos as alunosMock,
  brlExato,
  type Aluno,
} from "@/data/mock";

import { adaptarAlunoDetalhe } from "@/adapters/alunoDetalhe.adapter";
import { buscarAluno } from "@/services/alunos.service";


function Campo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="mt-0.5 truncate text-sm font-medium">
        {value || "-"}
      </p>
    </div>
  );
}


export default function AlunoDetalhe() {
  const { alunoId } = useParams();

  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [contrato, setContrato] = useState<Contrato | null>(null);




  useEffect(() => {
    async function carregarAluno() {
      if (!alunoId) return;

      try {

        const response = await buscarAluno(alunoId);

        const alunoAdaptado = adaptarAlunoDetalhe(response);

        setAluno(alunoAdaptado);


      } catch (error) {

        console.error(
          "Erro ao buscar aluno API:",
          error
        );

        const alunoMock = alunosMock.find(
          (item) => item.id === alunoId
        );

        if (alunoMock) {
          setAluno(alunoMock);
        }

      }


      try {

        const contratoApi =
          await buscarContratoPorAluno(alunoId);

        setContrato(contratoApi);

      } catch (error) {

        console.error(
          "Erro ao buscar contrato:",
          error
        );

        setContrato(null);

      }


      setCarregando(false);
    }


    carregarAluno();

  }, [alunoId]);


  if (carregando) {
    return (
      <div className="mx-auto max-w-[1200px] p-6 text-center">
        Carregando aluno...
      </div>
    );
  }


  if (!aluno) {
    return (
      <div className="mx-auto max-w-[1200px] p-6 text-center">

        <h1 className="font-display text-2xl font-semibold">
          Aluno não encontrado
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Verifique a URL ou volte para a lista de alunos.
        </p>

        <div className="mt-4">
          <Button asChild className="rounded-xl">
            <Link to="/alunos">
              Voltar para alunos
            </Link>
          </Button>
        </div>

      </div>
    );
  }


  return (
    <div className="mx-auto max-w-[1400px] space-y-6">

      <Button asChild variant="ghost" size="sm" className="rounded-lg -ml-2">
        <Link to="/alunos">
          <ArrowLeft className="size-4" />
          Voltar para alunos
        </Link>
      </Button>


      <section className="surface-card overflow-hidden">

        <div className="h-20 bg-gradient-to-r from-primary/85 to-gold/70" />

        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 px-5 pb-5 sm:flex sm:flex-wrap sm:justify-between">

          <div className="flex min-w-0 items-end gap-4">

            <Avatar className="-mt-10 size-20 shrink-0 border-4 border-card">
              <AvatarImage src={aluno.foto} alt={aluno.nome} />

              <AvatarFallback>
                {aluno.nome.slice(0, 2)}
              </AvatarFallback>
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

                <Badge variant="secondary">
                  {aluno.rota}
                </Badge>
              </div>

            </div>

          </div>


          <div className="flex shrink-0 gap-2 pb-1">

            <Button variant="outline" className="rounded-xl">
              <Phone className="size-4" />
              Contatar
            </Button>

            <Button className="rounded-xl">
              <FileText className="size-4" />
              Contrato
            </Button>

          </div>

        </div>

      </section>


      <div className="grid gap-4 lg:grid-cols-3">

        <SectionCard
          title="Dados pessoais"
          description="Informações cadastrais do aluno"
        >

          <div className="grid grid-cols-2 gap-4">

            <Campo
              label="Matrícula"
              value={`ALU-${aluno.id.slice(0, 8).toUpperCase()}`}
            />

            <Campo label="Nascimento" value={aluno.nascimento} />

            <Campo label="Escola" value={aluno.escola} />

            <Campo label="Série" value={aluno.serie} />

            <Campo label="Turno" value={aluno.turno} />

            <Campo label="Aluno desde" value={aluno.desde} />

          </div>

        </SectionCard>
        <SectionCard
          title="Endereço"
          description="Ponto de embarque e desembarque"
        >

          <div className="space-y-4">

            <div className="flex items-start gap-3">
              <Home className="mt-0.5 size-4 shrink-0 text-primary" />

              <div className="min-w-0">

                <p className="text-sm font-medium">
                  {aluno.endereco}
                </p>

                <p className="text-xs text-muted-foreground">
                  {aluno.cidade}
                </p>

              </div>
            </div>


            <div className="relative h-40 overflow-hidden rounded-xl border border-border bg-muted">

              <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] [background-size:26px_26px]" />

              <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">

                <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground">
                  <MapPin className="size-4" />
                </span>

                <span className="mt-2 rounded-lg bg-card px-2 py-1 text-[11px] font-medium shadow-sm">
                  {aluno.bairro}
                </span>

              </div>

            </div>

          </div>

        </SectionCard>


        <SectionCard
          title="Responsáveis"
          description="Contatos autorizados"
        >

          <div className="space-y-4">

            <div className="flex items-center gap-3">

              <Avatar className="size-10 shrink-0">

                <AvatarFallback>
                  {aluno.responsavel
                    ? aluno.responsavel.slice(0, 2).toUpperCase()
                    : "RS"}
                </AvatarFallback>

              </Avatar>


              <div className="min-w-0">

                <p className="truncate text-sm font-medium">
                  {aluno.responsavel}
                </p>

                <p className="truncate text-xs text-muted-foreground">
                  {aluno.parentesco} · responsável financeiro
                </p>

              </div>

            </div>


            <Separator />


            <div className="space-y-2 text-sm">

              <p className="flex items-center gap-2">
                <Phone className="size-4 text-muted-foreground" />
                {aluno.telefone}
              </p>


              <p className="flex min-w-0 items-center gap-2">

                <Mail className="size-4 shrink-0 text-muted-foreground" />

                <span className="truncate">
                  {aluno.email}
                </span>

              </p>


              <p className="flex items-center gap-2">
                <Bus className="size-4 text-muted-foreground" />

                {aluno.enderecoResponsavel || aluno.endereco}
              </p>

            </div>

          </div>

        </SectionCard>


      </div>


      <Tabs defaultValue="contrato" className="space-y-4">

        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-xl p-1">

          <TabsTrigger value="contrato">
            Contrato
          </TabsTrigger>

          <TabsTrigger value="mensalidades">
            Mensalidades
          </TabsTrigger>

          <TabsTrigger value="ocorrencias">
            Ocorrências
          </TabsTrigger>

          <TabsTrigger value="historico">
            Histórico
          </TabsTrigger>

          <TabsTrigger value="documentos">
            Documentos
          </TabsTrigger>

          <TabsTrigger value="fotos">
            Fotos
          </TabsTrigger>

        </TabsList>



        <TabsContent value="contrato">

          {contrato ? (

            <SectionCard
              title={`Contrato ${contrato.numero}`}
              description="Vigência e condições comerciais"
            >

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">

                <Campo
                  label="Número"
                  value={contrato.numero}
                />

                <Campo
                  label="Início"
                  value={contrato.data_inicio}
                />

                <Campo
                  label="Término"
                  value={contrato.data_fim}
                />

                <Campo
                  label="Vencimento"
                  value={`Dia ${contrato.dia_vencimento}`}
                />

                <Campo
                  label="Pagamento"
                  value={contrato.forma_pagamento}
                />

                <Campo
                  label="Mensalidade"
                  value={brlExato(
                    contrato.valor_mensalidade
                  )}
                />

              </div>


              <p className="mt-4 rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground">

                {contrato.observacoes ||
                  "Sem observações cadastradas."}

              </p>


            </SectionCard>

          ) : (

            <SectionCard
              title="Contrato"
              description="Vigência e condições comerciais"
            >

              <p className="text-sm text-muted-foreground">
                Nenhum contrato encontrado para este aluno.
              </p>

            </SectionCard>

          )}

        </TabsContent>



        <TabsContent value="mensalidades">

          <SectionCard
            title="Mensalidades"
            description="Histórico de cobranças do ano letivo"
            bodyClassName="p-0"
          >

            <div className="overflow-x-auto">

              <Table>

                <TableHeader>

                  <TableRow>

                    <TableHead>
                      Competência
                    </TableHead>

                    <TableHead>
                      Vencimento
                    </TableHead>

                    <TableHead>
                      Forma
                    </TableHead>

                    <TableHead className="text-right">
                      Valor
                    </TableHead>

                    <TableHead>
                      Status
                    </TableHead>

                    <TableHead>
                      Pago em
                    </TableHead>

                  </TableRow>

                </TableHeader>


                <TableBody>

                  {aluno.mensalidades.map((m) => (

                    <TableRow key={m.competencia}>

                      <TableCell className="font-medium">
                        {m.competencia}
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {m.vencimento}
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {m.forma}
                      </TableCell>

                      <TableCell className="text-right font-semibold tabular-nums">
                        {brlExato(m.valor)}
                      </TableCell>

                      <TableCell>
                        <StatusPill status={m.status} />
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {m.pagoEm ?? "—"}
                      </TableCell>

                    </TableRow>

                  ))}

                </TableBody>

              </Table>

            </div>

          </SectionCard>

        </TabsContent>
        <TabsContent value="ocorrencias">

          <SectionCard
            title="Ocorrências"
            description="Registros operacionais vinculados ao aluno"
            bodyClassName="p-0"
          >

            <ul className="divide-y divide-border">

              {aluno.ocorrencias.map((o) => (

                <li
                  key={o.data + o.tipo}
                  className="flex items-start gap-3 px-5 py-4"
                >

                  <span
                    className={`
                      mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl
                      ${o.gravidade === "alta"
                        ? "bg-destructive/12 text-destructive"
                        : o.gravidade === "media"
                          ? "bg-warning/15 text-warning"
                          : "bg-muted text-muted-foreground"
                      }
                    `}
                  >
                    <MessageSquareWarning className="size-4" />
                  </span>


                  <div className="min-0 flex-1">

                    <p className="truncate text-sm font-medium">
                      {o.tipo}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {o.descricao}
                    </p>

                  </div>


                  <span className="text-xs text-muted-foreground">
                    {o.data}
                  </span>

                </li>

              ))}

            </ul>

          </SectionCard>

        </TabsContent>



        <TabsContent value="historico">

          <SectionCard
            title="Linha do tempo"
            description="Eventos do relacionamento com a empresa"
          >

            <ol className="relative space-y-6 border-l border-border pl-6">

              {aluno.historico.map((h) => (

                <li
                  key={h.data + h.evento}
                  className="relative"
                >

                  <span className="absolute -left-[31px] top-1 grid size-5 place-items-center rounded-full border-2 border-card bg-primary text-primary-foreground">

                    <History className="size-2.5" />

                  </span>


                  <p className="text-sm font-medium">
                    {h.evento}
                  </p>


                  <p className="flex items-center gap-1 text-xs text-muted-foreground">

                    <CalendarDays className="size-3" />

                    {h.data}

                  </p>

                </li>

              ))}

            </ol>

          </SectionCard>

        </TabsContent>



        <TabsContent value="documentos">

          <SectionCard
            title="Documentos"
            description="Arquivos anexados ao cadastro"
          >

            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

              {aluno.documentos.map((d) => (

                <li
                  key={d.nome}
                  className="flex items-center gap-3 rounded-xl border border-border p-3"
                >

                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="size-4" />
                  </span>


                  <div className="min-w-0 flex-1">

                    <p className="truncate text-sm font-medium">
                      {d.nome}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {d.tipo} · {d.tamanho}
                    </p>

                  </div>


                  <Button variant="ghost" size="icon">
                    <Download className="size-4" />
                  </Button>

                </li>

              ))}

            </ul>

          </SectionCard>

        </TabsContent>



        <TabsContent value="fotos">

          <SectionCard
            title="Fotos"
            description="Galeria de registros do aluno"
          >

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

              {Array.from({ length: 4 }).map((_, i) => (

                <div
                  key={i}
                  className="flex aspect-square flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/40"
                >

                  <Images className="size-5" />

                  <span className="text-[11px]">
                    Foto {i + 1}
                  </span>

                </div>

              ))}

            </div>

          </SectionCard>

        </TabsContent>


      </Tabs>

    </div>
  );
}