import { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { toast } from "sonner";
  import { Check, ChevronsUpDown, Calendar as CalendarIcon } from "lucide-react";

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

  import { criarAlunoCompleto } from "@/services/alunos.service";
  import {
    listarResponsaveis,
    type Responsavel,
  } from "@/services/responsaveis.service";
  import { listarEscolas, type Escola } from "@/services/escolas.service";
  import { listarRotas, type Rota } from "@/services/rotas.service";

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
    const [responsaveis, setResponsaveis] = useState<Responsavel[]>([]);
    const [escolas, setEscolas] = useState<Escola[]>([]);
    const [rotas, setRotas] = useState<Rota[]>([]); // State para armazenar as rotas
    const [responsaveisSelecionados, setResponsaveisSelecionados] = useState<
      ResponsavelAluno[]
    >([]);

    const [openComboboxResponsavel, setOpenComboboxResponsavel] = useState(false);

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
      rota_id: "",
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
      Promise.all([listarResponsaveis(), listarEscolas(), listarRotas()])
        .then(([resp, esc, rot]) => {
          setResponsaveis(resp);
          setEscolas(esc);
          setRotas(rot);
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
      valor: string | boolean
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
        (item) => item.responsavel_id === responsavelAtual.responsavel_id
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
        prev.filter((item) => item.responsavel_id !== id)
      );
    }

    async function salvar() {
      if (!form.nome) {
        toast.error("Informe o nome");
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

        // Mapeia os dados completos dos responsáveis selecionados para validação do backend (responsavelSchema)
        const listaResponsaveisCompletos = responsaveisSelecionados
          .map((item) => {
            const respObj = responsaveis.find((r) => r.id === item.responsavel_id);
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

        const alunoPayload = {
          ...form,
          matricula: matriculaGerada,
          foto_url: form.foto_url || undefined,
          data_nascimento: form.data_nascimento || undefined,
          data_inicio: form.data_inicio || undefined,
          rota_id: form.rota_id || undefined,
          cidade: form.cidade || undefined,
          bairro: form.bairro || undefined,
          endereco: form.endereco || undefined,
          numero: form.numero || undefined,
          complemento: form.complemento || undefined,
          cep: form.cep || undefined,
          serie: `${serie} - Turma ${turma}`,
          aluno_responsavel: responsaveisSelecionados,
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

        const payload = {
          aluno: alunoPayload,
          responsaveis: listaResponsaveisCompletos,
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
      "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100";

    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Novo aluno</h1>

        <SectionCard
          title="Dados pessoais"
          description="Informações básicas do aluno"
        >
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Input
                placeholder="Matrícula (Automática)"
                value={form.matricula}
                disabled
                className="bg-muted/50 text-muted-foreground cursor-not-allowed italic"
              />
              <Input
                placeholder="Nome completo"
                value={form.nome}
                onChange={(e) => alterar("nome", e.target.value)}
              />
              <Input
                placeholder="URL da foto"
                value={form.foto_url}
                onChange={(e) => alterar("foto_url", e.target.value)}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground/70" />
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
                  <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground/70" />
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
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a série" />
                </SelectTrigger>
                <SelectContent>
                  {SERIES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={turma} onValueChange={setTurma}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a turma" />
                </SelectTrigger>
                <SelectContent>
                  {TURMAS.map((item) => (
                    <SelectItem key={item} value={item}>
                      Turma {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Select
              value={form.turno}
              onValueChange={(v) => alterar("turno", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o turno" />
              </SelectTrigger>
              <SelectContent>
                {TURNOS.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="grid gap-4 md:grid-cols-2">
              <Select
                value={form.escola_id}
                onValueChange={(v) => alterar("escola_id", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a escola" />
                </SelectTrigger>
                <SelectContent>
                  {escolas.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={form.rota_id}
                onValueChange={(v) => alterar("rota_id", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a rota principal" />
                </SelectTrigger>
                <SelectContent>
                  {rotas.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.nome} {item.codigo ? `(${item.codigo})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Responsáveis"
          description="Adicione um ou mais responsáveis"
        >
          <div className="grid gap-4">
            <Popover
              open={openComboboxResponsavel}
              onOpenChange={setOpenComboboxResponsavel}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openComboboxResponsavel}
                  className="w-full justify-between font-normal"
                >
                  {responsavelAtual.responsavel_id
                    ? responsaveis.find(
                        (r) => r.id === responsavelAtual.responsavel_id
                      )?.nome
                    : "Digite para buscar o responsável..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[var(--radix-popover-trigger-width)] p-0"
                align="start"
              >
                <Command>
                  <CommandInput placeholder="Digite um nome..." />
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
                              "mr-2 h-4 w-4",
                              responsavelAtual.responsavel_id === item.id
                                ? "opacity-100"
                                : "opacity-0"
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

            <Select
              value={responsavelAtual.parentesco}
              onValueChange={(v) => alterarResponsavel("parentesco", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o parentesco" />
              </SelectTrigger>
              <SelectContent>
                {PARENTESCOS.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-4">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={responsavelAtual.responsavel_financeiro}
                  onChange={(e) =>
                    alterarResponsavel("responsavel_financeiro", e.target.checked)
                  }
                  className="rounded border-gray-300"
                />
                Financeiro
              </label>

              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={responsavelAtual.responsavel_emergencia}
                  onChange={(e) =>
                    alterarResponsavel("responsavel_emergencia", e.target.checked)
                  }
                  className="rounded border-gray-300"
                />
                Emergência
              </label>
            </div>

            <Button type="button" onClick={adicionarResponsavel}>
              Adicionar responsável
            </Button>

            {responsaveisSelecionados.map((item) => (
              <div
                key={item.responsavel_id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <span className="text-sm">
                  {
                    responsaveis.find((r) => r.id === item.responsavel_id)?.nome
                  }{" "}
                  — {item.parentesco}
                </span>

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removerResponsavel(item.responsavel_id)}
                >
                  Remover
                </Button>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Endereço" description="Localização do aluno">
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                placeholder="Cidade"
                value={form.cidade}
                onChange={(e) => alterar("cidade", e.target.value)}
              />
              <Input
                placeholder="Bairro"
                value={form.bairro}
                onChange={(e) => alterar("bairro", e.target.value)}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Input
                placeholder="Endereço"
                value={form.endereco}
                onChange={(e) => alterar("endereco", e.target.value)}
              />
              <Input
                placeholder="Número"
                value={form.numero}
                onChange={(e) => alterar("numero", e.target.value)}
              />
              <Input
                placeholder="CEP"
                value={form.cep}
                onChange={(e) => alterar("cep", e.target.value)}
              />
            </div>

            <Input
              placeholder="Complemento"
              value={form.complemento}
              onChange={(e) => alterar("complemento", e.target.value)}
            />
          </div>
        </SectionCard>

        <SectionCard title="Contrato" description="Dados comerciais do aluno">
          <div className="grid gap-4">
            <Input
              placeholder="Número do contrato (Gerado automaticamente)"
              value={contrato.numero}
              disabled
              className="bg-muted/50 text-muted-foreground cursor-not-allowed italic font-medium"
            />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground/70" />
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
                  <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground/70" />
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
                placeholder="Valor mensalidade"
                value={contrato.valor_mensalidade}
                onChange={(e) =>
                  alterarContrato("valor_mensalidade", e.target.value)
                }
              />
              <Input
                type="number"
                placeholder="Dia vencimento"
                value={contrato.dia_vencimento}
                onChange={(e) =>
                  alterarContrato("dia_vencimento", e.target.value)
                }
              />
            </div>

            <Select
              value={contrato.forma_pagamento}
              onValueChange={(v) => alterarContrato("forma_pagamento", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Forma de pagamento" />
              </SelectTrigger>
              <SelectContent>
                {FORMAS_PAGAMENTO.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Observações"
              value={contrato.observacoes}
              onChange={(e) => alterarContrato("observacoes", e.target.value)}
            />
          </div>
        </SectionCard>

        <SectionCard title="Status" description="Controle do cadastro">
          <Select
            value={form.status}
            onValueChange={(v) => alterar("status", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_ALUNO.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SectionCard>

        <Button onClick={salvar} className="w-full rounded-xl">
          Salvar aluno
        </Button>
      </div>
    );
  }