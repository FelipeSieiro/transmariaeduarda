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

import { listarAlunos, type Aluno } from "@/services/alunos.service";
import { criarContrato } from "@/services/contratos.service";

const STATUS = ["ativo", "inativo", "encerrado"];

const FORMAS_PAGAMENTO = ["PIX", "Dinheiro", "Cartão", "Boleto"];

// Função para gerar o número do contrato: Iniciais do nome + Hash de 5 dígitos
function gerarNumeroContrato(nomeCompleto: string): string {
  if (!nomeCompleto || !nomeCompleto.trim()) return "";

  // Extrai as iniciais do nome do aluno
  const iniciais = nomeCompleto
    .trim()
    .split(/\s+/)
    .map((palavra) => palavra[0]?.toUpperCase() || "")
    .join("");

  // Gera um número aleatório de 5 dígitos (ex: 10000 a 99999)
  const hash5Digitos = Math.floor(10000 + Math.random() * 90000);

  return `${iniciais}-${hash5Digitos}`;
}

export default function NovoContrato() {
  const navigate = useNavigate();

  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [alunoId, setAlunoId] = useState("");
  const [openComboboxAluno, setOpenComboboxAluno] = useState(false);

  const [form, setForm] = useState({
    numero: "",
    data_inicio: "",
    data_fim: "",
    valor_mensalidade: "",
    dia_vencimento: "",
    forma_pagamento: "",
    observacoes: "",
    status: "ativo",
  });

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await listarAlunos();
        setAlunos(dados);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar alunos");
      }
    }

    carregar();
  }, []);

  function alterar(campo: string, valor: string) {
    setForm((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  // Atualiza o aluno e gera automaticamente o número do contrato
  function selecionarAluno(id: string) {
    setAlunoId(id);

    const alunoSelecionado = alunos.find((a) => a.id === id);
    if (alunoSelecionado?.nome) {
      const numeroGerado = gerarNumeroContrato(alunoSelecionado.nome);
      alterar("numero", numeroGerado);
    } else {
      alterar("numero", "");
    }
  }

  async function salvar() {
    try {
      if (!alunoId) {
        toast.error("Selecione o aluno");
        return;
      }

      // Garante que haja um número de contrato gerado
      const alunoSelecionado = alunos.find((a) => a.id === alunoId);
      const numeroFinal =
        form.numero ||
        (alunoSelecionado ? gerarNumeroContrato(alunoSelecionado.nome) : "");

      const payload = {
        aluno_id: alunoId,
        numero: numeroFinal,
        data_inicio: form.data_inicio,
        data_fim: form.data_fim || null,
        valor_mensalidade: Number(form.valor_mensalidade),
        dia_vencimento: Number(form.dia_vencimento),
        forma_pagamento: form.forma_pagamento,
        observacoes: form.observacoes,
        status: form.status,
      };

      console.log("NOVO CONTRATO:", payload);

      await criarContrato(payload);

      toast.success("Contrato criado com sucesso");
      navigate("/contratos");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar contrato");
    }
  }

  // Estilização utilitária para os inputs do tipo "date"
  const dateInputStyle =
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-3xl font-semibold">Novo contrato</h1>

      <SectionCard
        title="Dados do contrato"
        description="Cadastro comercial do aluno"
      >
        <div className="grid gap-4">
          {/* Combobox de Busca de Aluno */}
          <Popover
            open={openComboboxAluno}
            onOpenChange={setOpenComboboxAluno}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openComboboxAluno}
                className="w-full justify-between font-normal"
              >
                {alunoId
                  ? alunos.find((a) => a.id === alunoId)?.nome
                  : "Digite para buscar o aluno..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[var(--radix-popover-trigger-width)] p-0"
              align="start"
            >
              <Command>
                <CommandInput placeholder="Digite o nome do aluno..." />
                <CommandList>
                  <CommandEmpty>Nenhum aluno encontrado.</CommandEmpty>
                  <CommandGroup>
                    {alunos.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={item.nome}
                        onSelect={() => {
                          selecionarAluno(item.id);
                          setOpenComboboxAluno(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            alunoId === item.id ? "opacity-100" : "opacity-0"
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

          {/* Campo de Número do Contrato (Automático / Desabilitado) */}
          <Input
            placeholder="Número do contrato (Gerado automaticamente)"
            value={form.numero}
            disabled
            className="bg-muted/50 text-muted-foreground cursor-not-allowed italic font-medium"
          />

          {/* Datas com Labels e Ícones */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground/70" />
                Início do Contrato
              </label>
              <Input
                type="date"
                className={dateInputStyle}
                value={form.data_inicio}
                onChange={(e) => alterar("data_inicio", e.target.value)}
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
                value={form.data_fim}
                onChange={(e) => alterar("data_fim", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              placeholder="Valor mensalidade"
              type="number"
              value={form.valor_mensalidade}
              onChange={(e) => alterar("valor_mensalidade", e.target.value)}
            />

            <Input
              placeholder="Dia vencimento"
              type="number"
              value={form.dia_vencimento}
              onChange={(e) => alterar("dia_vencimento", e.target.value)}
            />
          </div>

          <Select
            value={form.forma_pagamento}
            onValueChange={(v) => alterar("forma_pagamento", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Forma pagamento" />
            </SelectTrigger>
            <SelectContent>
              {FORMAS_PAGAMENTO.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={form.status}
            onValueChange={(v) => alterar("status", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Observações"
            value={form.observacoes}
            onChange={(e) => alterar("observacoes", e.target.value)}
          />

          <Button onClick={salvar} className="rounded-xl">
            Salvar contrato
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}