import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

import { criarAluno } from "@/services/alunos.service";

import {
  listarResponsaveis,
  type Responsavel,
} from "@/services/responsaveis.service";

import {
  listarEscolas,
  type Escola,
} from "@/services/escolas.service";

import { 
  Serie, 
  StatusAluno, 
  Turma, 
  Turno 
} from "@/constants/aluno";

const SERIES = Object.values(Serie);
const TURMAS = Object.values(Turma);
const TURNOS = Object.values(Turno);
const STATUS = Object.values(StatusAluno);

export default function NovoAluno() {
  const navigate = useNavigate();

  const [serie, setSerie] = useState("");
  const [turma, setTurma] = useState("");

  const [responsaveis, setResponsaveis] =
    useState<Responsavel[]>([]);

  const [escolas, setEscolas] =
    useState<Escola[]>([]);

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

  const [responsavelData, setResponsavelData] = useState({
    responsavel_id: "",
    parentesco: "",
    responsavel_financeiro: false,
    responsavel_emergencia: false,
  });

  useEffect(() => {
    async function carregarDados() {
      try {
        const [
          responsaveisData,
          escolasData,
        ] = await Promise.all([
          listarResponsaveis(),
          listarEscolas(),
        ]);

        setResponsaveis(responsaveisData);
        setEscolas(escolasData);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar dados");
      }
    }

    carregarDados();
  }, []);

  function alterar(campo: string, valor: string) {
    setForm((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  function alterarResponsavel(
    campo: string,
    valor: any
  ) {
    setResponsavelData((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  async function salvar() {
    try {
      if (!form.matricula) {
        toast.error("Informe a matrícula do aluno");
        return;
      }

      if (!form.nome) {
        toast.error("Informe o nome do aluno");
        return;
      }

      if (!serie) {
        toast.error("Selecione a série");
        return;
      }

      if (!turma) {
        toast.error("Selecione a turma");
        return;
      }

      if (!form.escola_id) {
        toast.error("Selecione a escola");
        return;
      }

      const payload = {
        matricula: form.matricula,
        nome: form.nome,
        foto_url: form.foto_url || undefined,
        data_nascimento:
          form.data_nascimento || undefined,
        data_inicio:
          form.data_inicio || undefined,

        escola_id: form.escola_id,

        serie: `${serie} - Turma ${turma}`,

        turno: form.turno || undefined,

        endereco: form.endereco || undefined,
        numero: form.numero || undefined,
        complemento:
          form.complemento || undefined,
        bairro: form.bairro || undefined,
        cidade: form.cidade || undefined,
        cep: form.cep || undefined,

        rota_id: form.rota_id || undefined,

        status: form.status,

        aluno_responsavel:
          responsavelData.responsavel_id
            ? [
              {
                responsavel_id:
                  responsavelData.responsavel_id,
                parentesco:
                  responsavelData.parentesco ||
                  undefined,
                responsavel_financeiro:
                  responsavelData.responsavel_financeiro,
                responsavel_emergencia:
                  responsavelData.responsavel_emergencia,
              },
            ]
            : [],
      };

      console.log(
        "PAYLOAD NOVO ALUNO",
        payload
      );

      await criarAluno(payload);

      toast.success(
        "Aluno cadastrado com sucesso"
      );

      navigate("/alunos");
    } catch (error) {
      console.error(
        "ERRO CADASTRO ALUNO",
        error
      );

      toast.error("Erro ao cadastrar aluno");
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-3xl font-semibold">
        Novo aluno
      </h1>
      <SectionCard
        title="Dados pessoais"
        description="Informações básicas do aluno"
      >
        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              placeholder="Matrícula"
              value={form.matricula}
              onChange={(e) =>
                alterar("matricula", e.target.value)
              }
            />

            <Input
              placeholder="Nome completo"
              value={form.nome}
              onChange={(e) =>
                alterar("nome", e.target.value)
              }
            />

            <Input
              placeholder="URL da foto"
              value={form.foto_url}
              onChange={(e) =>
                alterar("foto_url", e.target.value)
              }
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              type="date"
              value={form.data_nascimento}
              onChange={(e) =>
                alterar(
                  "data_nascimento",
                  e.target.value
                )
              }
            />

            <Input
              type="date"
              value={form.data_inicio}
              onChange={(e) =>
                alterar(
                  "data_inicio",
                  e.target.value
                )
              }
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Dados escolares"
        description="Escola, série e turno"
      >
        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Select
              value={serie}
              onValueChange={setSerie}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a série" />
              </SelectTrigger>

              <SelectContent>
                {SERIES.map((item) => (
                  <SelectItem
                    key={item}
                    value={item}
                  >
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={turma}
              onValueChange={setTurma}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a turma" />
              </SelectTrigger>

              <SelectContent>
                {TURMAS.map((item) => (
                  <SelectItem
                    key={item}
                    value={item}
                  >
                    Turma {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Select
            value={form.turno}
            onValueChange={(v) =>
              alterar("turno", v)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o turno" />
            </SelectTrigger>

            <SelectContent>
              {TURNOS.map((item) => (
                <SelectItem
                  key={item}
                  value={item}
                >
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={form.escola_id}
            onValueChange={(v) =>
              alterar("escola_id", v)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a escola" />
            </SelectTrigger>

            <SelectContent>
              {escolas.map((escola) => (
                <SelectItem
                  key={escola.id}
                  value={escola.id}
                >
                  {escola.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="UUID da rota"
            value={form.rota_id}
            onChange={(e) =>
              alterar("rota_id", e.target.value)
            }
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Endereço"
        description="Localização do aluno"
      >
        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              placeholder="Cidade"
              value={form.cidade}
              onChange={(e) =>
                alterar("cidade", e.target.value)
              }
            />

            <Input
              placeholder="Bairro"
              value={form.bairro}
              onChange={(e) =>
                alterar("bairro", e.target.value)
              }
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Input
              placeholder="Endereço"
              value={form.endereco}
              onChange={(e) =>
                alterar("endereco", e.target.value)
              }
            />

            <Input
              placeholder="Número"
              value={form.numero}
              onChange={(e) =>
                alterar("numero", e.target.value)
              }
            />

            <Input
              placeholder="CEP"
              value={form.cep}
              onChange={(e) =>
                alterar("cep", e.target.value)
              }
            />
          </div>

          <Input
            placeholder="Complemento"
            value={form.complemento}
            onChange={(e) =>
              alterar(
                "complemento",
                e.target.value
              )
            }
          />
        </div>
      </SectionCard>
      <SectionCard
        title="Responsável"
        description="Vínculo do responsável pelo aluno"
      >
        <div className="grid gap-4">
          <Select
            value={responsavelData.responsavel_id}
            onValueChange={(v) =>
              alterarResponsavel(
                "responsavel_id",
                v
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o responsável" />
            </SelectTrigger>

            <SelectContent>
              {responsaveis.map((item) => (
                <SelectItem
                  key={item.id}
                  value={item.id}
                >
                  {item.nome}
                  {item.cpf
                    ? ` - CPF: ${item.cpf}`
                    : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Parentesco (Pai, Mãe, Tutor...)"
            value={responsavelData.parentesco}
            onChange={(e) =>
              alterarResponsavel(
                "parentesco",
                e.target.value
              )
            }
          />

          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={
                  responsavelData.responsavel_financeiro
                }
                onChange={(e) =>
                  alterarResponsavel(
                    "responsavel_financeiro",
                    e.target.checked
                  )
                }
              />

              Responsável financeiro
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={
                  responsavelData.responsavel_emergencia
                }
                onChange={(e) =>
                  alterarResponsavel(
                    "responsavel_emergencia",
                    e.target.checked
                  )
                }
              />

              Contato de emergência
            </label>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Status"
        description="Controle do cadastro"
      >
        <Select
          value={form.status}
          onValueChange={(v) =>
            alterar("status", v)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            {STATUS.map((item) => (
              <SelectItem
                key={item}
                value={item}
              >
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SectionCard>

      <Button
        onClick={salvar}
        className="w-full rounded-xl"
      >
        Salvar aluno
      </Button>
    </div>
  );
}