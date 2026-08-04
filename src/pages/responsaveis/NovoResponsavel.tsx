// src/pages/NovoResponsavel.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionCard } from "@/components/ui-kit/primitives";

import { criarResponsavel } from "@/services/responsaveis.service";

export default function NovoResponsavel() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    observacoes: "",
  });

  const [endereco, setEndereco] = useState({
    cidade: "",
    bairro: "",
    logradouro: "",
    numero: "",
    complemento: "",
    cep: "",
  });

  function alterarForm(campo: string, valor: string) {
    setForm((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  function alterarEndereco(campo: string, valor: string) {
    setEndereco((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  function montarEnderecoFormatado(): string {
    const partes: string[] = [];

    if (endereco.logradouro.trim()) {
      let ruaEnumero = endereco.logradouro.trim();
      if (endereco.numero.trim()) {
        ruaEnumero += `, ${endereco.numero.trim()}`;
      }
      partes.push(ruaEnumero);
    }

    if (endereco.complemento.trim()) {
      partes.push(endereco.complemento.trim());
    }

    if (endereco.bairro.trim()) {
      partes.push(endereco.bairro.trim());
    }

    if (endereco.cidade.trim()) {
      partes.push(endereco.cidade.trim());
    }

    if (endereco.cep.trim()) {
      partes.push(`CEP: ${endereco.cep.trim()}`);
    }

    return partes.join(" - ");
  }

  async function salvar() {
    try {
      if (!form.nome.trim()) {
        toast.error("Informe o nome completo do responsável");
        return;
      }

      if (!form.cpf.trim()) {
        toast.error("Informe o CPF do responsável");
        return;
      }

      setSubmitting(true);
      const enderecoCompleto = montarEnderecoFormatado();

      const payload = {
        ...form,
        endereco: enderecoCompleto || undefined,
        observacoes: form.observacoes || undefined,
      };

      await criarResponsavel(payload);

      toast.success("Responsável cadastrado com sucesso");
      navigate("/responsaveis");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao cadastrar responsável");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/responsaveis")}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="inline-flex p-2 rounded-xl bg-primary/10 text-primary">
              <Users className="size-5" />
            </div>
            <div className="space-y-0.5">
              <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                Novo responsável
              </h1>
              <p className="text-sm text-muted-foreground">
                Cadastro de responsável financeiro e contato autorizado
              </p>
            </div>
          </div>
        </div>
      </header>

      <SectionCard
        title="Dados do responsável"
        description="Informações pessoais e de contato"
      >
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Nome Completo *
              </label>
              <Input
                placeholder="Ex: Ana Maria Souza"
                value={form.nome}
                onChange={(e) => alterarForm("nome", e.target.value)}
                className="rounded-xl h-10"
                disabled={submitting}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                CPF *
              </label>
              <Input
                placeholder="000.000.000-00"
                value={form.cpf}
                onChange={(e) => alterarForm("cpf", e.target.value)}
                className="rounded-xl h-10"
                disabled={submitting}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Telefone
              </label>
              <Input
                placeholder="(11) 99999-9999"
                value={form.telefone}
                onChange={(e) => alterarForm("telefone", e.target.value)}
                className="rounded-xl h-10"
                disabled={submitting}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                E-mail
              </label>
              <Input
                placeholder="exemplo@email.com"
                type="email"
                value={form.email}
                onChange={(e) => alterarForm("email", e.target.value)}
                className="rounded-xl h-10"
                disabled={submitting}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border/60">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Endereço
            </h3>
            <div className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  placeholder="Cidade"
                  value={endereco.cidade}
                  onChange={(e) => alterarEndereco("cidade", e.target.value)}
                  className="rounded-xl h-10"
                  disabled={submitting}
                />
                <Input
                  placeholder="Bairro"
                  value={endereco.bairro}
                  onChange={(e) => alterarEndereco("bairro", e.target.value)}
                  className="rounded-xl h-10"
                  disabled={submitting}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Input
                  placeholder="Rua / Logradouro"
                  value={endereco.logradouro}
                  onChange={(e) => alterarEndereco("logradouro", e.target.value)}
                  className="rounded-xl h-10"
                  disabled={submitting}
                />
                <Input
                  placeholder="Número"
                  value={endereco.numero}
                  onChange={(e) => alterarEndereco("numero", e.target.value)}
                  className="rounded-xl h-10"
                  disabled={submitting}
                />
                <Input
                  placeholder="CEP"
                  value={endereco.cep}
                  onChange={(e) => alterarEndereco("cep", e.target.value)}
                  className="rounded-xl h-10"
                  disabled={submitting}
                />
              </div>

              <Input
                placeholder="Complemento (opcional)"
                value={endereco.complemento}
                onChange={(e) => alterarEndereco("complemento", e.target.value)}
                className="rounded-xl h-10"
                disabled={submitting}
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Observações
            </label>
            <Textarea
              placeholder="Informações adicionais sobre o responsável..."
              value={form.observacoes}
              onChange={(e) => alterarForm("observacoes", e.target.value)}
              className="rounded-xl min-h-[90px]"
              disabled={submitting}
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => navigate("/responsaveis")}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={salvar}
              className="rounded-xl px-6"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="size-4 mr-2" />
                  Salvar responsável
                </>
              )}
            </Button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}