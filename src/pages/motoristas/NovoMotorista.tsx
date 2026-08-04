// src/pages/NovoMotorista.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader2, IdCard } from "lucide-react";
import { toast } from "sonner";

import { SectionCard } from "@/components/ui-kit/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import { motoristasService } from "@/services/motoristas.service";

export default function NovoMotorista() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cnh, setCnh] = useState("");
  const [categoriaCnh, setCategoriaCnh] = useState("");
  const [salario, setSalario] = useState<string>("");
  const [status, setStatus] = useState<string>("ativo");

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function carregarMotorista() {
      try {
        setLoading(true);
        const m = await motoristasService.getById(id!);
        if (m) {
          setNome(m.nome || "");
          setCpf(m.cpf || "");
          setTelefone(m.telefone || "");
          setCnh(m.cnh || "");
          setCategoriaCnh(m.categoria_cnh || "");
          setSalario(m.salario !== null && m.salario !== undefined ? String(m.salario) : "");
          setStatus(m.status || "ativo");
        }
      } catch (error) {
        console.error("Erro ao carregar motorista", error);
        toast.error("Erro ao carregar dados do motorista");
        navigate("/motoristas");
      } finally {
        setLoading(false);
      }
    }

    carregarMotorista();
  }, [id, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!nome.trim()) {
      toast.error("Informe o nome completo do motorista");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        nome: nome.trim(),
        cpf: cpf.trim() || null,
        telefone: telefone.trim() || null,
        cnh: cnh.trim() || null,
        categoria_cnh: categoriaCnh.trim() || null,
        salario: salario ? Number(salario) : null,
        status,
      };

      if (isEditing && id) {
        await motoristasService.update(id, payload);
        toast.success("Motorista atualizado com sucesso");
      } else {
        await motoristasService.create(payload);
        toast.success("Motorista cadastrado com sucesso");
      }

      navigate("/motoristas");
    } catch (error) {
      console.error("Erro ao salvar motorista", error);
      toast.error(isEditing ? "Erro ao atualizar motorista" : "Erro ao cadastrar motorista");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
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
            onClick={() => navigate("/motoristas")}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="inline-flex p-2 rounded-xl bg-primary/10 text-primary">
              <IdCard className="size-5" />
            </div>
            <div className="space-y-0.5">
              <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                {isEditing ? "Editar Motorista" : "Novo Motorista"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isEditing
                  ? "Atualize as informações cadastrais e profissionais"
                  : "Preencha os dados para cadastrar um novo motorista"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        <SectionCard
          title="Dados Pessoais e Profissionais"
          description="Informações cadastrais e de habilitação"
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Nome Completo *
              </label>
              <Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Carlos Silva"
                className="rounded-xl h-10"
                disabled={submitting}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  CPF
                </label>
                <Input
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  className="rounded-xl h-10"
                  disabled={submitting}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Telefone
                </label>
                <Input
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="rounded-xl h-10"
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Número da CNH
                </label>
                <Input
                  value={cnh}
                  onChange={(e) => setCnh(e.target.value)}
                  placeholder="Ex: 12345678900"
                  className="rounded-xl h-10"
                  disabled={submitting}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Categoria CNH
                </label>
                <Select
                  value={categoriaCnh}
                  onValueChange={setCategoriaCnh}
                  disabled={submitting}
                >
                  <SelectTrigger className="rounded-xl h-10">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                    <SelectItem value="E">E</SelectItem>
                    <SelectItem value="AB">AB</SelectItem>
                    <SelectItem value="AC">AC</SelectItem>
                    <SelectItem value="AD">AD</SelectItem>
                    <SelectItem value="AE">AE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Salário (R$)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={salario}
                  onChange={(e) => setSalario(e.target.value)}
                  placeholder="0,00"
                  className="rounded-xl h-10"
                  disabled={submitting}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </label>
                <Select
                  value={status}
                  onValueChange={setStatus}
                  disabled={submitting}
                >
                  <SelectTrigger className="rounded-xl h-10">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => navigate("/motoristas")}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
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
                    {isEditing ? "Salvar Alterações" : "Cadastrar Motorista"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </SectionCard>
      </form>
    </div>
  );
}