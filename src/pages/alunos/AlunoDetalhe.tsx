import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { buscarAluno } from "@/services/alunos.service";
import {
  buscarContratoPorAluno,
  type Contrato,
} from "@/services/contratos.service";
import {
  buscarMensalidadesPorContrato,
  registrarPagamento,
  type Mensalidade,
} from "@/services/mensalidades.service";

import { adaptarAlunoDetalhe } from "@/adapters/alunoDetalhe.adapter";
import { alunos as alunosMock, brlExato, type Aluno } from "@/data/mock";
import { FORMAS_PAGAMENTO } from "@/constants";

import {
  AlertCircle,
  ArrowLeft,
  Bus,
  CalendarDays,
  CheckCircle2,
  Clock,
  DollarSign,
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SectionCard, StatusPill } from "@/components/ui-kit/primitives";
import { toast } from "sonner";

function Campo({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 truncate text-sm font-medium">{value || "-"}</p>
    </div>
  );
}

export default function AlunoDetalhe() {
  const { alunoId } = useParams();
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [contrato, setContrato] = useState<Contrato | null>(null);

  // Estados das Mensalidades API
  const [mensalidades, setMensalidades] = useState<Mensalidade[]>([]);
  const [carregandoMensalidades, setCarregandoMensalidades] = useState(false);
  const [mensalidadeSelecionada, setMensalidadeSelecionada] = useState<Mensalidade | null>(null);
  const [formaPagamento, setFormaPagamento] = useState("PIX");
  const [processandoPagamento, setProcessandoPagamento] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      if (!alunoId) return;

      let alunoData: Aluno | null = null;

      try {
        const response = await buscarAluno(alunoId);
        alunoData = adaptarAlunoDetalhe(response);
        setAluno(alunoData);
      } catch (error) {
        console.error("Erro ao buscar aluno API:", error);
        const alunoMock = alunosMock.find((item) => item.id === alunoId);
        if (alunoMock) {
          alunoData = alunoMock;
          setAluno(alunoMock);
        }
      }

      try {
        const contratoApi = await buscarContratoPorAluno(alunoId);
        setContrato(contratoApi);

        if (contratoApi?.id) {
          carregarMensalidadesDoContrato(contratoApi.id);
        }
      } catch (error) {
        console.error("Erro ao buscar contrato:", error);
        setContrato(null);
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [alunoId]);

  async function carregarMensalidadesDoContrato(contratoId: string) {
    try {
      setCarregandoMensalidades(true);
      const dados = await buscarMensalidadesPorContrato(contratoId);
      setMensalidades(dados);
    } catch (error) {
      console.error("Erro ao carregar mensalidades:", error);
    } finally {
      setCarregandoMensalidades(false);
    }
  }

  async function handleBaixarPagamento() {
    if (!mensalidadeSelecionada) return;

    try {
      setProcessandoPagamento(true);
      await registrarPagamento(mensalidadeSelecionada.id, {
        forma_pagamento: formaPagamento,
        data_pagamento: new Date().toISOString().split("T")[0],
      });

      toast.success("Pagamento registrado com sucesso!");
      setMensalidadeSelecionada(null);

      if (contrato?.id) {
        await carregarMensalidadesDoContrato(contrato.id);
      }
    } catch (error) {
      console.error("Erro ao dar baixa na mensalidade:", error);
      toast.error("Erro ao registrar pagamento");
    } finally {
      setProcessandoPagamento(false);
    }
  }

  const renderStatusMensalidade = (status: string) => {
    switch (status) {
      case "pago":
        return (
          <Badge className="border-emerald-200 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 gap-1">
            <CheckCircle2 className="size-3" /> Pago
          </Badge>
        );
      case "atrasado":
        return (
          <Badge className="border-rose-200 bg-rose-500/15 text-rose-700 dark:text-rose-400 gap-1">
            <AlertCircle className="size-3" /> Atrasado
          </Badge>
        );
      default:
        return (
          <Badge className="border-amber-200 bg-amber-500/15 text-amber-700 dark:text-amber-400 gap-1">
            <Clock className="size-3" /> Pendente
          </Badge>
        );
    }
  };

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
            <Link to="/alunos">Voltar para alunos</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Garante uma lista unificada de responsáveis
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
    <div className="mx-auto max-w-[1400px] space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2 rounded-lg">
        <Link to="/alunos">
          <ArrowLeft className="mr-2 size-4" />
          Voltar para alunos
        </Link>
      </Button>

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
                <p className="text-sm font-medium">{aluno.endereco}</p>
                <p className="text-xs text-muted-foreground">{aluno.cidade}</p>
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
                        <p className="truncate text-sm font-medium">
                          {resp.nome}
                        </p>
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
      </div>

      <Tabs defaultValue="contrato" className="space-y-4">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-xl p-1">
          <TabsTrigger value="contrato">Contrato</TabsTrigger>
          <TabsTrigger value="mensalidades">Mensalidades</TabsTrigger>
          <TabsTrigger value="ocorrencias">Ocorrências</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
          <TabsTrigger value="fotos">Fotos</TabsTrigger>
        </TabsList>

        <TabsContent value="contrato">
          {contrato ? (
            <SectionCard
              title={`Contrato ${contrato.numero}`}
              description="Vigência e condições comerciais"
            >
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
                <Campo label="Número" value={contrato.numero} />
                <Campo label="Início" value={contrato.data_inicio} />
                <Campo label="Término" value={contrato.data_fim || ""} />
                <Campo
                  label="Vencimento"
                  value={`Dia ${contrato.dia_vencimento}`}
                />
                <Campo label="Pagamento" value={contrato.forma_pagamento} />
                <Campo
                  label="Mensalidade"
                  value={brlExato(contrato.valor_mensalidade)}
                />
              </div>
              <p className="mt-4 rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground">
                {contrato.observacoes || "Sem observações cadastradas."}
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
            description="Histórico de cobranças e baixas do contrato"
            bodyClassName="p-0"
          >
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Competência</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {carregandoMensalidades ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-6 text-center text-sm text-muted-foreground">
                        Carregando mensalidades...
                      </TableCell>
                    </TableRow>
                  ) : mensalidades.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-6 text-center text-sm text-muted-foreground">
                        Nenhuma mensalidade cadastrada para o contrato deste aluno.
                      </TableCell>
                    </TableRow>
                  ) : (
                    mensalidades.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell className="font-medium">
                          {m.competencia}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(m.data_vencimento).toLocaleDateString("pt-BR", {
                            timeZone: "UTC",
                          })}
                        </TableCell>
                        <TableCell className="text-right font-semibold tabular-nums">
                          {brlExato(m.valor)}
                        </TableCell>
                        <TableCell>
                          {renderStatusMensalidade(m.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          {m.status !== "pago" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1.5 text-xs rounded-lg"
                              onClick={() => setMensalidadeSelecionada(m)}
                            >
                              <DollarSign className="size-3.5" /> Dar Baixa
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
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
                    className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl ${
                      o.gravidade === "alta"
                        ? "bg-destructive/12 text-destructive"
                        : o.gravidade === "media"
                          ? "bg-warning/15 text-warning"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <MessageSquareWarning className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{o.tipo}</p>
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
                <li key={h.data + h.evento} className="relative">
                  <span className="absolute -left-[31px] top-1 grid size-5 place-items-center rounded-full border-2 border-card bg-primary text-primary-foreground">
                    <History className="size-2.5" />
                  </span>
                  <p className="text-sm font-medium">{h.evento}</p>
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
                    <p className="truncate text-sm font-medium">{d.nome}</p>
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
          <SectionCard title="Fotos" description="Galeria de registros do aluno">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex aspect-square flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/40"
                >
                  <Images className="size-5" />
                  <span className="text-[11px]">Foto {i + 1}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>

      {/* MODAL DE REGISTRO DE PAGAMENTO / BAIXA */}
      <Dialog
        open={!!mensalidadeSelecionada}
        onOpenChange={(open) => !open && setMensalidadeSelecionada(null)}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Registrar Pagamento</DialogTitle>
          </DialogHeader>

          {mensalidadeSelecionada && (
            <div className="space-y-4 py-2">
              <div className="rounded-lg bg-muted p-3 text-sm space-y-1">
                <p>
                  <strong>Competência:</strong> {mensalidadeSelecionada.competencia}
                </p>
                <p>
                  <strong>Valor:</strong>{" "}
                  {brlExato(mensalidadeSelecionada.valor)}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                  Forma de Pagamento
                </label>
                <Select
                  value={formaPagamento}
                  onValueChange={setFormaPagamento}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {FORMAS_PAGAMENTO.map((forma) => (
                      <SelectItem key={forma} value={forma}>
                        {forma}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setMensalidadeSelecionada(null)}
              disabled={processandoPagamento}
            >
              Cancelar
            </Button>
            <Button onClick={handleBaixarPagamento} disabled={processandoPagamento}>
              {processandoPagamento ? "Confirmando..." : "Confirmar Baixa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}