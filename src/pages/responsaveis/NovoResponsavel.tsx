import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionCard } from "@/components/ui-kit/primitives";

import { criarResponsavel } from "@/services/responsaveis.service";

export default function NovoResponsavel() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    observacoes: "",
  });

  // Estado separado para os campos individuais do endereço
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

  // Função para transformar os campos de endereço em uma única string formatada
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
      if (!form.nome) {
        toast.error("Informe o nome do responsável");
        return;
      }

      if (!form.cpf) {
        toast.error("Informe o CPF do responsável");
        return;
      }

      // Junta todos os campos de endereço em uma única string
      const enderecoCompleto = montarEnderecoFormatado();

      const payload = {
        ...form,
        endereco: enderecoCompleto,
      };

      await criarResponsavel(payload);

      toast.success("Responsável cadastrado com sucesso");
      navigate("/responsaveis");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao cadastrar responsável");
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-3xl font-semibold">Novo responsável</h1>

      <SectionCard
        title="Dados do responsável"
        description="Cadastro de responsável financeiro e contato autorizado"
      >
        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              placeholder="Nome completo"
              value={form.nome}
              onChange={(e) => alterarForm("nome", e.target.value)}
            />

            <Input
              placeholder="CPF"
              value={form.cpf}
              onChange={(e) => alterarForm("cpf", e.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              placeholder="Telefone"
              value={form.telefone}
              onChange={(e) => alterarForm("telefone", e.target.value)}
            />

            <Input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => alterarForm("email", e.target.value)}
            />
          </div>

          {/* Campos Individuais de Endereço */}
          <div className="pt-2">
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              Endereço
            </h3>
            <div className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  placeholder="Cidade"
                  value={endereco.cidade}
                  onChange={(e) => alterarEndereco("cidade", e.target.value)}
                />
                <Input
                  placeholder="Bairro"
                  value={endereco.bairro}
                  onChange={(e) => alterarEndereco("bairro", e.target.value)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Input
                  placeholder="Rua / Logradouro"
                  value={endereco.logradouro}
                  onChange={(e) => alterarEndereco("logradouro", e.target.value)}
                />
                <Input
                  placeholder="Número"
                  value={endereco.numero}
                  onChange={(e) => alterarEndereco("numero", e.target.value)}
                />
                <Input
                  placeholder="CEP"
                  value={endereco.cep}
                  onChange={(e) => alterarEndereco("cep", e.target.value)}
                />
              </div>

              <Input
                placeholder="Complemento (opcional)"
                value={endereco.complemento}
                onChange={(e) => alterarEndereco("complemento", e.target.value)}
              />
            </div>
          </div>

          <Textarea
            placeholder="Observações"
            value={form.observacoes}
            onChange={(e) => alterarForm("observacoes", e.target.value)}
          />

          <Button onClick={salvar} className="rounded-xl">
            Salvar responsável
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}