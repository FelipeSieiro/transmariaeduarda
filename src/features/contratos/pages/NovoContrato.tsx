// src/pages/contratos/NovoContrato.tsx
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader2, FileText, Calendar as CalendarIcon, Search, Check } from "lucide-react";
import { toast } from "sonner";

import { SectionCard } from "@/components/ui-kit/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import { contratosService } from "@/features/contratos/services/contratos.service";
import { alunosService } from "@/features/alunos/services/alunos.service";

function gerarNumeroContrato(nomeCompleto: string): string {
  if (!nomeCompleto || !nomeCompleto.trim()) return "";

  const iniciais = nomeCompleto
    .trim()
    .split(/\s+/)
    .map((palavra) => palavra[0]?.toUpperCase() || "")
    .join("");

  const hash5Digitos = Math.floor(10000 + Math.random() * 90000);

  return `${iniciais}-${hash5Digitos}`;
}

export default function NovoContrato() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [alunoId, setAlunoId] = useState("");
  const [buscaAluno, setBuscaAluno] = useState("");
  const [alunoSelecionadoNome, setAlunoSelecionadoNome] = useState("");
  const [mostrarDropdownAlunos, setMostrarDropdownAlunos] = useState(false);

  const [numero, setNumero] = useState("");
  const [valorMensalidade, setValorMensalidade] = useState("");
  const [diaVencimento, setDiaVencimento] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [status, setStatus] = useState("ativo");
  const [observacoes, setObservacoes] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("mensal");

  const [alunos, setAlunos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMostrarDropdownAlunos(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);

        let listaAlunos: any[] = [];
        try {
          if (alunosService) {
            if (typeof (alunosService as any).listarAlunos === "function") {
              listaAlunos = await (alunosService as any).listarAlunos();
            } else if (typeof (alunosService as any).listar === "function") {
              listaAlunos = await (alunosService as any).listar();
            } else if (typeof (alunosService as any).findAll === "function") {
              listaAlunos = await (alunosService as any).findAll();
            } else if (typeof (alunosService as any).getAll === "function") {
              listaAlunos = await (alunosService as any).getAll();
            }
          }
        } catch (err) {
          console.error("Erro ao buscar lista de alunos:", err);
        }

        const alunosFinal = Array.isArray(listaAlunos) 
          ? listaAlunos 
          : (listaAlunos as any)?.data || [];

        setAlunos(alunosFinal);

        if (id) {
          const contrato = typeof contratosService.buscarContrato === "function"
            ? await contratosService.buscarContrato(id)
            : null;
            
          if (contrato) {
            setAlunoId(contrato.aluno_id || "");
            setNumero(contrato.numero || "");
            setValorMensalidade(contrato.valor_mensalidade ? String(contrato.valor_mensalidade) : "");
            setDiaVencimento(contrato.dia_vencimento ? String(contrato.dia_vencimento) : "");
            const dataInicio = contrato.data_inicio ? contrato.data_inicio.split("T")[0] : "";
            setDataInicio(dataInicio || "");
            const dataFim = contrato.data_fim ? contrato.data_fim.split("T")[0] : "";
            setDataFim(dataFim || "");
            setStatus(contrato.status ? contrato.status.toLowerCase() : "ativo");
            setObservacoes(contrato.observacoes || "");

            // Se estiver editando, acha o nome do aluno correspondente
            const alunoEncontrado = alunosFinal.find((a: any) => a.id === contrato.aluno_id);
            if (alunoEncontrado) {
              setAlunoSelecionadoNome(alunoEncontrado.nome);
              setBuscaAluno(alunoEncontrado.nome);
            }
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados do contrato", error);
        toast.error("Erro ao carregar dados do formulário");
        if (id) navigate("/contratos");
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [id, navigate]);

  function selecionarAluno(aluno: any) {
    setAlunoId(aluno.id);
    setAlunoSelecionadoNome(aluno.nome);
    setBuscaAluno(aluno.nome);
    setMostrarDropdownAlunos(false);

    // Gera o número do contrato automaticamente se for novo contrato
    if (!isEditing) {
      setNumero(gerarNumeroContrato(aluno.nome));
    }
  }

  // Alunos filtrados com base no que foi digitado
  const alunosFiltrados = alunos.filter((a) =>
    a.nome?.toLowerCase().includes(buscaAluno.toLowerCase())
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!alunoId) {
      toast.error("Selecione um aluno válido da lista.");
      return;
    }

    if (!numero) {
      toast.error("O número do contrato é obrigatório.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        aluno_id: alunoId,
        numero: numero.trim(),
        valor_mensalidade: valorMensalidade ? parseFloat(valorMensalidade) : 0,
        dia_vencimento: diaVencimento ? parseInt(diaVencimento, 10) : 10,
        data_inicio: dataInicio || null,
        data_fim: dataFim || null,
        status: status.toLowerCase(),
        observacoes: observacoes.trim() || null,
      };

      // Adiciona forma_pagamento ao payload
      const payloadCompleto = {
        ...payload,
        forma_pagamento: formaPagamento || "mensal",
        data_inicio: payload.data_inicio || "",
      };

      if (isEditing && id) {
        if (typeof (contratosService as any).atualizarContrato === "function") {
          await (contratosService as any).atualizarContrato(id, payloadCompleto);
        } else if (typeof (contratosService as any).update === "function") {
          await (contratosService as any).update(id, payloadCompleto);
        }
        toast.success("Contrato atualizado com sucesso");
      } else {
        await contratosService.criarContrato(payloadCompleto);
        toast.success("Contrato cadastrado com sucesso");
      }

      navigate("/contratos");
    } catch (error: any) {
      console.error("Erro ao salvar contrato", error);
      const msg = error.response?.data?.message || "Erro ao salvar contrato";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  const dateInputStyle =
    "w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100";

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/contratos")}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="inline-flex p-2 rounded-xl bg-primary/10 text-primary">
              <FileText className="size-5" />
            </div>
            <div className="space-y-0.5">
              <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                {isEditing ? "Editar Contrato" : "Novo Contrato"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isEditing
                  ? "Atualize as informações do contrato selecionado"
                  : "Preencha os dados para registrar um novo contrato"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionCard
          title="Vínculo e Identificação"
          description="Pesquise o aluno associado e verifique o número gerado"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {/* Campo de Busca Autocompletar */}
            <div className="space-y-1.5 relative" ref={dropdownRef}>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Aluno *
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Digite para procurar o aluno..."
                  value={buscaAluno}
                  onChange={(e) => {
                    setBuscaAluno(e.target.value);
                    setMostrarDropdownAlunos(true);
                    if (e.target.value !== alunoSelecionadoNome) {
                      setAlunoId(""); // Limpa o ID se alterar o texto e ainda não re-selecionar
                    }
                  }}
                  onFocus={() => setMostrarDropdownAlunos(true)}
                  className="rounded-xl h-10 pl-9 pr-4"
                  disabled={submitting}
                />
              </div>

              {/* Lista Flutuante de Resultados */}
              {mostrarDropdownAlunos && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-border bg-popover p-1 shadow-lg text-popover-foreground">
                  {alunosFiltrados.length > 0 ? (
                    alunosFiltrados.map((aluno) => (
                      <button
                        type="button"
                        key={aluno.id}
                        onClick={() => selecionarAluno(aluno)}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-left hover:bg-muted transition-colors cursor-pointer"
                      >
                        <span className="font-medium">{aluno.nome}</span>
                        {alunoId === aluno.id && <Check className="size-4 text-primary" />}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-3 text-sm text-muted-foreground text-center">
                      Nenhum aluno encontrado
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Número do Contrato *
              </Label>
              <Input
                type="text"
                placeholder="Gerado automaticamente"
                value={numero}
                disabled
                className="rounded-xl bg-muted/50 text-muted-foreground cursor-not-allowed italic font-medium h-10"
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Valores e Vigência"
          description="Defina a mensalidade, dia de vencimento e o período de validade"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Valor Mensalidade (R$) *
              </Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={valorMensalidade}
                onChange={(e) => setValorMensalidade(e.target.value)}
                className="rounded-xl h-10"
                disabled={submitting}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Dia de Vencimento *
              </Label>
              <Input
                type="number"
                min="1"
                max="31"
                placeholder="Ex: 10"
                value={diaVencimento}
                onChange={(e) => setDiaVencimento(e.target.value)}
                className="rounded-xl h-10"
                disabled={submitting}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 pt-4">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <CalendarIcon className="size-3.5 text-muted-foreground/70" />
                Data de Início
              </label>
              <Input
                type="date"
                className={dateInputStyle}
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                disabled={submitting}
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <CalendarIcon className="size-3.5 text-muted-foreground/70" />
                Data de Término (opcional)
              </label>
              <Input
                type="date"
                className={dateInputStyle}
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                disabled={submitting}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Status e Observações"
          description="Controle a situação e anotações extras do contrato"
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </Label>
              <Select value={status} onValueChange={setStatus} disabled={submitting}>
                <SelectTrigger className="rounded-xl h-10">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="suspenso">Suspenso</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Observações
              </Label>
              <Textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Detalhes ou acordos especiais do contrato..."
                className="rounded-xl min-h-[90px] resize-none"
                disabled={submitting}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => navigate("/contratos")}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button type="submit" className="rounded-xl px-6" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="size-4 mr-2" />
                  {isEditing ? "Salvar Alterações" : "Cadastrar Contrato"}
                </>
              )}
            </Button>
          </div>
        </SectionCard>
      </form>
    </div>
  );
}