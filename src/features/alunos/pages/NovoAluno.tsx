// src/pages/NovoAluno.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Check,
  ChevronsUpDown,
  Calendar as CalendarIcon,
  UserPlus,
  Trash2,
  Plus,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionCard } from "@/components/ui-kit/primitives";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { criarAlunoCompleto } from "@/features/alunos/services/alunos.service";
import { responsaveisService } from "@/features/responsaveis/services/responsaveis.service";
import { listarEscolas } from "@/services/escolas.service";
import { listarRotas } from "@/features/rotas/services/rotas.service";
import type { Responsavel } from "@/features/responsaveis/types/responsavel";
import type { Escola } from "@/features/escolas/types/escola";
import type { Rota } from "@/features/rotas/types/rota";
import { toResponsavelPayload } from "@/features/responsaveis/mappers/responsavel.mapper";

import {
  SERIES,
  TURMAS,
  TURNOS,
  STATUS_ALUNO,
  FORMAS_PAGAMENTO,
  PARENTESCOS,
} from "@/constants";

type ResponsavelAluno = {
  responsavel_id: string;
  parentesco: string;
  responsavel_financeiro: boolean;
  responsavel_emergencia: boolean;
};

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

export default function NovoAluno() {
  const navigate = useNavigate();

  const [serie, setSerie] = useState("");
  const [turma, setTurma] = useState("");
  const [responsaveis, setResponsaveis] = useState<readonly Responsavel[]>([]);
  const [escolas, setEscolas] = useState<readonly Escola[]>([]);
  const [rotas, setRotas] = useState<readonly Rota[]>([]);
  const [responsaveisSelecionados, setResponsaveisSelecionados] = useState<
    readonly ResponsavelAluno[]
  >([]);

  const [openComboboxResponsavel, setOpenComboboxResponsavel] = useState(false);
  const [openModalNovoResponsavel, setOpenModalNovoResponsavel] = useState(false);
  const [novoResponsavel, setNovoResponsavel] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    observacoes: "",
    endereco: {
      cidade: "",
      bairro: "",
      logradouro: "",
      numero: "",
      complemento: "",
      cep: "",
    },
  });
  const [criandoResponsavel, setCriandoResponsavel] = useState(false);

  const [responsavelAtual, setResponsavelAtual] = useState<ResponsavelAluno>({
    responsavel_id: "",
    parentesco: "",
    responsavel_financeiro: false,
    responsavel_emergencia: false,
  });

  const [form, setForm] = useState({
    matricula: "",
    nome: "",
    foto_url: "",
    data_nascimento: "",
    data_inicio: "",
    escola_id: "",
    turno: "",
    cidade: "",
    bairro: "",
    endereco: "",
    numero: "",
    complemento: "",
    cep: "",
    status: "ativo",
  });

  const [contrato, setContrato] = useState({
    numero: "",
    data_inicio: "",
    data_fim: "",
    valor_mensalidade: "",
    dia_vencimento: "",
    forma_pagamento: "",
    observacoes: "",
    status: "ativo",
  });

  // Carrega Responsáveis, Escolas e Rotas em paralelo
  useEffect(() => {
    Promise.all([responsaveisService.getAll(), listarEscolas(), listarRotas()])
      .then(([resp, esc, rot]) => {
        setResponsaveis(resp || []);
        setEscolas(esc || []);
        setRotas(rot || []);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Erro ao carregar dados dos seletores");
      });
  }, []);

  function alterar(campo: string, valor: string) {
    setForm((prev) => {
      const novoForm = { ...prev, [campo]: valor };

      if (campo === "nome") {
        const novoNumeroContrato = gerarNumeroContrato(valor);
        setContrato((prevContrato) => ({
          ...prevContrato,
          numero: novoNumeroContrato,
        }));
      }

      return novoForm;
    });
  }

  function alterarContrato(campo: string, valor: string) {
    setContrato((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  function alterarResponsavel(
    campo: keyof ResponsavelAluno,
    valor: string | boolean,
  ) {
    setResponsavelAtual((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  function adicionarResponsavel() {
    if (!responsavelAtual.responsavel_id) {
      toast.error("Selecione um responsável");
      return;
    }

    if (!responsavelAtual.parentesco) {
      toast.error("Selecione o parentesco");
      return;
    }

    const existe = responsaveisSelecionados.some(
      (item) => item.responsavel_id === responsavelAtual.responsavel_id,
    );

    if (existe) {
      toast.error("Responsável já adicionado");
      return;
    }

    setResponsaveisSelecionados((prev) => [...prev, responsavelAtual]);

    setResponsavelAtual({
      responsavel_id: "",
      parentesco: "",
      responsavel_financeiro: false,
      responsavel_emergencia: false,
    });
  }

  function removerResponsavel(id: string) {
    setResponsaveisSelecionados((prev) =>
      prev.filter((item) => item.responsavel_id !== id),
    );
  }

  async function criarNovoResponsavel() {
    if (!novoResponsavel.nome.trim()) {
      toast.error("Informe o nome do responsável");
      return;
    }

    if (!novoResponsavel.cpf.trim()) {
      toast.error("Informe o CPF do responsável");
      return;
    }

    try {
      setCriandoResponsavel(true);
      const novo = await responsaveisService.create(
        toResponsavelPayload({
          nome: novoResponsavel.nome,
          cpf: novoResponsavel.cpf,
          telefone: novoResponsavel.telefone,
          email: novoResponsavel.email,
          observacoes: novoResponsavel.observacoes,
          endereco: novoResponsavel.endereco,
        })
      );

      // Atualiza a lista de responsáveis disponíveis
      setResponsaveis((prev) => [...prev, novo]);

      // Seleciona automaticamente o novo responsável
      setResponsavelAtual({
        responsavel_id: novo.id,
        parentesco: "",
        responsavel_financeiro: false,
        responsavel_emergencia: false,
      });

      // Limpa o formulário e fecha o modal
      setNovoResponsavel({
        nome: "",
        cpf: "",
        telefone: "",
        email: "",
        observacoes: "",
        endereco: {
          cidade: "",
          bairro: "",
          logradouro: "",
          numero: "",
          complemento: "",
          cep: "",
        },
      });
      setOpenModalNovoResponsavel(false);

      toast.success("Responsável criado com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar responsável");
    } finally {
      setCriandoResponsavel(false);
    }
  }

  async function salvar() {
    if (!form.nome) {
      toast.error("Informe o nome do aluno");
      return;
    }

    if (!serie || !turma) {
      toast.error("Selecione série e turma");
      return;
    }

    if (!form.escola_id) {
      toast.error("Selecione a escola");
      return;
    }

    if (!responsaveisSelecionados.length) {
      toast.error("Adicione ao menos um responsável");
      return;
    }

    try {
      const matriculaGerada =
        form.matricula && form.matricula.trim() !== ""
          ? form.matricula.trim()
          : crypto.randomUUID();

      const alunoPayload = {
        ...form,
        matricula: matriculaGerada,
        foto_url: form.foto_url || undefined,
        data_nascimento: form.data_nascimento || undefined,
        data_inicio: form.data_inicio || undefined,
        cidade: form.cidade || undefined,
        bairro: form.bairro || undefined,
        endereco: form.endereco || undefined,
        numero: form.numero || undefined,
        complemento: form.complemento || undefined,
        cep: form.cep || undefined,
        serie: `${serie} - Turma ${turma}`,
      };

      const numeroContratoFinal =
        contrato.numero || gerarNumeroContrato(form.nome);

      const contratoPayload = numeroContratoFinal
        ? {
            numero: numeroContratoFinal,
            data_inicio: contrato.data_inicio || undefined,
            data_fim: contrato.data_fim || null,
            valor_mensalidade: Number(contrato.valor_mensalidade) || 0,
            dia_vencimento: Number(contrato.dia_vencimento) || 1,
            forma_pagamento: contrato.forma_pagamento || undefined,
            observacoes: contrato.observacoes || undefined,
            status: contrato.status || "ativo",
          }
        : undefined;

      const responsaveisPayload = responsaveisSelecionados
        .map((item) => {
          const respObj = responsaveis.find(
            (r) => r.id === item.responsavel_id,
          );
          if (!respObj) return null;
          return {
            nome: respObj.nome,
            telefone: respObj.telefone || undefined,
            email: respObj.email || undefined,
            cpf: respObj.cpf || undefined,
            endereco: respObj.endereco || undefined,
            observacoes: respObj.observacoes || undefined,
            parentesco: item.parentesco,
            responsavel_financeiro: item.responsavel_financeiro,
            responsavel_emergencia: item.responsavel_emergencia,
          };
        })
        .filter(Boolean);

      const payload = {
        aluno: alunoPayload,
        responsaveis: responsaveisPayload,
        contrato: contratoPayload,
      };

      await criarAlunoCompleto(payload);

      toast.success("Aluno cadastrado com sucesso");
      navigate("/alunos");
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Erro ao cadastrar aluno";
      toast.error(msg);
    }
  }

  const dateInputStyle =
    "w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
          Novo aluno
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Preencha as informações para cadastrar um novo aluno no sistema
        </p>
      </header>

      <SectionCard
        title="Dados pessoais"
        description="Informações básicas de identificação do aluno"
      >
        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              placeholder="Matrícula (Automática)"
              value={form.matricula}
              disabled
              className="rounded-xl bg-muted/50 text-muted-foreground cursor-not-allowed italic"
            />
            <Input
              placeholder="Nome completo"
              value={form.nome}
              onChange={(e) => alterar("nome", e.target.value)}
              className="rounded-xl"
            />
            <Input
              placeholder="URL da foto"
              value={form.foto_url}
              onChange={(e) => alterar("foto_url", e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <CalendarIcon className="size-3.5 text-muted-foreground/70" />
                Data de Nascimento
              </label>
              <Input
                type="date"
                className={dateInputStyle}
                value={form.data_nascimento}
                onChange={(e) => alterar("data_nascimento", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <CalendarIcon className="size-3.5 text-muted-foreground/70" />
                Data de Início do Transporte
              </label>
              <Input
                type="date"
                className={dateInputStyle}
                value={form.data_inicio}
                onChange={(e) => alterar("data_inicio", e.target.value)}
              />
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Dados escolares e transporte"
        description="Escola, série, turma, turno e rota principal"
      >
        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Select value={serie} onValueChange={setSerie}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Selecione a série" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {SERIES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={turma} onValueChange={setTurma}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Selecione a turma" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {TURMAS.map((item) => (
                  <SelectItem key={item} value={item}>
                    Turma {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Select value={form.turno} onValueChange={(v) => alterar("turno", v)}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Selecione o turno" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {TURNOS.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={form.escola_id}
            onValueChange={(v) => alterar("escola_id", v)}
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Selecione a escola" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {escolas.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </SectionCard>

      <SectionCard
        title="Responsáveis"
        description="Associe um ou mais responsáveis ao aluno"
      >
        <div className="grid gap-4">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <Popover
              open={openComboboxResponsavel}
              onOpenChange={setOpenComboboxResponsavel}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openComboboxResponsavel}
                  className="w-full justify-between font-normal rounded-xl h-10"
                >
                  {responsavelAtual.responsavel_id
                    ? responsaveis.find(
                        (r) => r.id === responsavelAtual.responsavel_id,
                      )?.nome
                    : "Selecionar responsável..."}
                  <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[var(--radix-popover-trigger-width)] p-0 rounded-xl"
                align="start"
              >
                <Command>
                  <CommandInput placeholder="Buscar por nome..." />
                  <CommandList>
                    <CommandEmpty>Nenhum responsável encontrado.</CommandEmpty>
                    <CommandGroup>
                      {responsaveis.map((item) => (
                        <CommandItem
                          key={item.id}
                          value={item.nome}
                          onSelect={() => {
                            alterarResponsavel("responsavel_id", item.id);
                            setOpenComboboxResponsavel(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 size-4",
                              responsavelAtual.responsavel_id === item.id
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {item.nome}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Dialog open={openModalNovoResponsavel} onOpenChange={setOpenModalNovoResponsavel}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl h-10 gap-2"
                >
                  <Plus className="size-4" />
                  <span className="hidden sm:inline">Novo</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Cadastrar novo responsável</DialogTitle>
                  <DialogDescription>
                    Preencha os dados do responsável para associá-lo ao aluno
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nome Completo *</label>
                      <Input
                        placeholder="Ex: Ana Maria Souza"
                        value={novoResponsavel.nome}
                        onChange={(e) => setNovoResponsavel({ ...novoResponsavel, nome: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">CPF *</label>
                      <Input
                        placeholder="000.000.000-00"
                        value={novoResponsavel.cpf}
                        onChange={(e) => setNovoResponsavel({ ...novoResponsavel, cpf: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Telefone</label>
                      <Input
                        placeholder="(11) 99999-9999"
                        value={novoResponsavel.telefone}
                        onChange={(e) => setNovoResponsavel({ ...novoResponsavel, telefone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">E-mail</label>
                      <Input
                        type="email"
                        placeholder="exemplo@email.com"
                        value={novoResponsavel.email}
                        onChange={(e) => setNovoResponsavel({ ...novoResponsavel, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="border-t border-border/60 pt-4">
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Endereço
                    </h3>
                    <div className="grid gap-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Cidade</label>
                          <Input
                            placeholder="Ex: São Paulo"
                            value={novoResponsavel.endereco.cidade}
                            onChange={(e) => setNovoResponsavel({
                              ...novoResponsavel,
                              endereco: { ...novoResponsavel.endereco, cidade: e.target.value }
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Bairro</label>
                          <Input
                            placeholder="Ex: Centro"
                            value={novoResponsavel.endereco.bairro}
                            onChange={(e) => setNovoResponsavel({
                              ...novoResponsavel,
                              endereco: { ...novoResponsavel.endereco, bairro: e.target.value }
                            })}
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Rua / Logradouro</label>
                          <Input
                            placeholder="Ex: Rua das Flores"
                            value={novoResponsavel.endereco.logradouro}
                            onChange={(e) => setNovoResponsavel({
                              ...novoResponsavel,
                              endereco: { ...novoResponsavel.endereco, logradouro: e.target.value }
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Número</label>
                          <Input
                            placeholder="Ex: 123"
                            value={novoResponsavel.endereco.numero}
                            onChange={(e) => setNovoResponsavel({
                              ...novoResponsavel,
                              endereco: { ...novoResponsavel.endereco, numero: e.target.value }
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">CEP</label>
                          <Input
                            placeholder="Ex: 00000-000"
                            value={novoResponsavel.endereco.cep}
                            onChange={(e) => setNovoResponsavel({
                              ...novoResponsavel,
                              endereco: { ...novoResponsavel.endereco, cep: e.target.value }
                            })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Complemento (opcional)</label>
                        <Input
                          placeholder="Ex: Apto 101"
                          value={novoResponsavel.endereco.complemento}
                          onChange={(e) => setNovoResponsavel({
                            ...novoResponsavel,
                            endereco: { ...novoResponsavel.endereco, complemento: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Observações</label>
                    <Input
                      placeholder="Informações adicionais..."
                      value={novoResponsavel.observacoes}
                      onChange={(e) => setNovoResponsavel({ ...novoResponsavel, observacoes: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpenModalNovoResponsavel(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    onClick={criarNovoResponsavel}
                    disabled={criandoResponsavel}
                  >
                    {criandoResponsavel ? "Criando..." : "Criar responsável"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Select
            value={responsavelAtual.parentesco}
            onValueChange={(v) => alterarResponsavel("parentesco", v)}
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Selecione o parentesco" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {PARENTESCOS.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center justify-between flex-wrap gap-4 pt-1">
            <div className="flex items-center gap-6">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
                <input
                  type="checkbox"
                  checked={responsavelAtual.responsavel_financeiro}
                  onChange={(e) =>
                    alterarResponsavel(
                      "responsavel_financeiro",
                      e.target.checked,
                    )
                  }
                  className="rounded border-border size-4 accent-primary"
                />
                Responsável Financeiro
              </label>

              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
                <input
                  type="checkbox"
                  checked={responsavelAtual.responsavel_emergencia}
                  onChange={(e) =>
                    alterarResponsavel(
                      "responsavel_emergencia",
                      e.target.checked,
                    )
                  }
                  className="rounded border-border size-4 accent-primary"
                />
                Contato de Emergência
              </label>
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={adicionarResponsavel}
              className="rounded-xl gap-2"
            >
              <UserPlus className="size-4" />
              <span>Adicionar responsável</span>
            </Button>
          </div>

          {responsaveisSelecionados.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-border">
              {responsaveisSelecionados.map((item) => {
                const respObj = responsaveis.find(
                  (r) => r.id === item.responsavel_id,
                );
                return (
                  <div
                    key={item.responsavel_id}
                    className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3"
                  >
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium text-foreground">
                        {respObj?.nome ?? "Responsável"} —{" "}
                        <span className="text-muted-foreground">
                          {item.parentesco}
                        </span>
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {item.responsavel_financeiro && (
                          <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium text-[10px]">
                            Financeiro
                          </span>
                        )}
                        {item.responsavel_emergencia && (
                          <span className="bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded font-medium text-[10px]">
                            Emergência
                          </span>
                        )}
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg size-8 p-0"
                      onClick={() => removerResponsavel(item.responsavel_id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </SectionCard>

      <SectionCard
        title="Endereço"
        description="Localização e dados residenciais do aluno"
      >
        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              placeholder="Cidade"
              value={form.cidade}
              onChange={(e) => alterar("cidade", e.target.value)}
              className="rounded-xl"
            />
            <Input
              placeholder="Bairro"
              value={form.bairro}
              onChange={(e) => alterar("bairro", e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Input
              placeholder="Endereço"
              value={form.endereco}
              onChange={(e) => alterar("endereco", e.target.value)}
              className="rounded-xl"
            />
            <Input
              placeholder="Número"
              value={form.numero}
              onChange={(e) => alterar("numero", e.target.value)}
              className="rounded-xl"
            />
            <Input
              placeholder="CEP"
              value={form.cep}
              onChange={(e) => alterar("cep", e.target.value)}
              className="rounded-xl"
            />
          </div>

          <Input
            placeholder="Complemento"
            value={form.complemento}
            onChange={(e) => alterar("complemento", e.target.value)}
            className="rounded-xl"
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Contrato"
        description="Dados comerciais e financeiros do aluno"
      >
        <div className="grid gap-4">
          <Input
            placeholder="Número do contrato (Gerado automaticamente)"
            value={contrato.numero}
            disabled
            className="rounded-xl bg-muted/50 text-muted-foreground cursor-not-allowed italic font-medium"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <CalendarIcon className="size-3.5 text-muted-foreground/70" />
                Início do Contrato
              </label>
              <Input
                type="date"
                className={dateInputStyle}
                value={contrato.data_inicio}
                onChange={(e) => alterarContrato("data_inicio", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <CalendarIcon className="size-3.5 text-muted-foreground/70" />
                Fim do Contrato (opcional)
              </label>
              <Input
                type="date"
                className={dateInputStyle}
                value={contrato.data_fim}
                onChange={(e) => alterarContrato("data_fim", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              type="number"
              placeholder="Valor mensalidade (R$)"
              value={contrato.valor_mensalidade}
              onChange={(e) =>
                alterarContrato("valor_mensalidade", e.target.value)
              }
              className="rounded-xl"
            />
            <Input
              type="number"
              placeholder="Dia do vencimento"
              value={contrato.dia_vencimento}
              onChange={(e) =>
                alterarContrato("dia_vencimento", e.target.value)
              }
              className="rounded-xl"
            />
          </div>

          <Select
            value={contrato.forma_pagamento}
            onValueChange={(v) => alterarContrato("forma_pagamento", v)}
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Forma de pagamento" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {FORMAS_PAGAMENTO.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Observações do contrato"
            value={contrato.observacoes}
            onChange={(e) => alterarContrato("observacoes", e.target.value)}
            className="rounded-xl"
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Status"
        description="Controle de ativação do cadastro"
      >
        <Select value={form.status} onValueChange={(v) => alterar("status", v)}>
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {STATUS_ALUNO.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SectionCard>

      <div className="flex justify-end gap-3 pb-8">
        <Button
          variant="outline"
          onClick={() => navigate("/alunos")}
          className="rounded-xl"
        >
          Cancelar
        </Button>
        <Button onClick={salvar} className="rounded-xl px-6">
          Salvar aluno
        </Button>
      </div>
    </div>
  );
}
