import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";

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
import { ROUTES } from "@/constants/routes";
import { alunosService } from "@/features/alunos/services/alunos.service";
import { listarEscolas } from "@/services/escolas.service";
import { listarRotas } from "@/features/rotas/services/rotas.service";
import type { Aluno } from "@/features/alunos/types/alunos";
import type { Escola } from "@/features/escolas/types/escola";
import type { Rota } from "@/features/rotas/types/rota";

import {
  SERIES,
  TURMAS,
  TURNOS,
  STATUS_ALUNO,
} from "@/constants";

export default function EditarAluno() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [escolas, setEscolas] = useState<readonly Escola[]>([]);
  const [rotas, setRotas] = useState<readonly Rota[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    foto_url: "",
    data_nascimento: "",
    data_inicio: "",
    escola_id: "",
    serie: "",
    turno: "",
    rota_id: "",
    cidade: "",
    bairro: "",
    endereco: "",
    numero: "",
    complemento: "",
    cep: "",
    status: "ativo",
  });

  useEffect(() => {
    async function carregarDados() {
      if (!id) return;

      try {
        setLoading(true);
        const [aluno, esc, rot] = await Promise.all([
          alunosService.getById(id),
          listarEscolas(),
          listarRotas(),
        ]);

        setEscolas(esc || []);
        setRotas(rot || []);

        if (aluno) {
          setForm({
            nome: aluno.nome || "",
            foto_url: aluno.foto_url || "",
            data_nascimento: aluno.data_nascimento || "",
            data_inicio: aluno.data_inicio || "",
            escola_id: aluno.escola_id || "",
            serie: aluno.serie || "",
            turno: aluno.turno || "",
            rota_id: aluno.rota_id || "",
            cidade: aluno.cidade || "",
            bairro: aluno.bairro || "",
            endereco: aluno.endereco || "",
            numero: aluno.numero || "",
            complemento: aluno.complemento || "",
            cep: aluno.cep || "",
            status: aluno.status || "ativo",
          });
        }
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar dados do aluno");
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [id]);

  function alterar(campo: string, valor: string) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  async function salvar() {
    if (!form.nome) {
      toast.error("Informe o nome do aluno");
      return;
    }

    if (!id) return;

    try {
      setSaving(true);
      await alunosService.update(id, form as Partial<Aluno>);
      toast.success("Aluno atualizado com sucesso");
      navigate(ROUTES.ALUNO_DETALHE(id));
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar aluno");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(ROUTES.ALUNOS)}
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Editar Aluno</h1>
          <p className="text-sm text-muted-foreground">
            Atualize as informações do aluno
          </p>
        </div>
      </div>

      <SectionCard title="Dados Pessoais">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome completo *</label>
            <Input
              value={form.nome}
              onChange={(e) => alterar("nome", e.target.value)}
              placeholder="Nome do aluno"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Data de nascimento</label>
            <Input
              type="date"
              value={form.data_nascimento}
              onChange={(e) => alterar("data_nascimento", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Data de início</label>
            <Input
              type="date"
              value={form.data_inicio}
              onChange={(e) => alterar("data_inicio", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={form.status}
              onValueChange={(value) => alterar("status", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_ALUNO.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Escolaridade">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Escola</label>
            <Select
              value={form.escola_id}
              onValueChange={(value) => alterar("escola_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a escola" />
              </SelectTrigger>
              <SelectContent>
                {escolas.map((escola) => (
                  <SelectItem key={escola.id} value={escola.id}>
                    {escola.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Série</label>
            <Select
              value={form.serie}
              onValueChange={(value) => alterar("serie", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a série" />
              </SelectTrigger>
              <SelectContent>
                {SERIES.map((serie) => (
                  <SelectItem key={serie} value={serie}>
                    {serie}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Turno</label>
            <Select
              value={form.turno}
              onValueChange={(value) => alterar("turno", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o turno" />
              </SelectTrigger>
              <SelectContent>
                {TURNOS.map((turno) => (
                  <SelectItem key={turno} value={turno}>
                    {turno}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Rota</label>
            <Select
              value={form.rota_id}
              onValueChange={(value) => alterar("rota_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a rota" />
              </SelectTrigger>
              <SelectContent>
                {rotas.map((rota) => (
                  <SelectItem key={rota.id} value={rota.id}>
                    {rota.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Endereço">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">CEP</label>
            <Input
              value={form.cep}
              onChange={(e) => alterar("cep", e.target.value)}
              placeholder="00000-000"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Cidade</label>
            <Input
              value={form.cidade}
              onChange={(e) => alterar("cidade", e.target.value)}
              placeholder="Cidade"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Bairro</label>
            <Input
              value={form.bairro}
              onChange={(e) => alterar("bairro", e.target.value)}
              placeholder="Bairro"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Endereço</label>
            <Input
              value={form.endereco}
              onChange={(e) => alterar("endereco", e.target.value)}
              placeholder="Rua, Avenida, etc."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Número</label>
            <Input
              value={form.numero}
              onChange={(e) => alterar("numero", e.target.value)}
              placeholder="123"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Complemento</label>
            <Input
              value={form.complemento}
              onChange={(e) => alterar("complemento", e.target.value)}
              placeholder="Apto, Bloco, etc."
            />
          </div>
        </div>
      </SectionCard>

      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => navigate(ROUTES.ALUNOS)}
          disabled={saving}
        >
          Cancelar
        </Button>
        <Button onClick={salvar} disabled={saving}>
          <Save className="mr-2 size-4" />
          {saving ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </div>
  );
}
