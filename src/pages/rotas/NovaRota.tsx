import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader2, Lock } from "lucide-react";
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

import { rotasService, type Rota } from "@/services/rotas.service";
import { motoristasService, type Motorista } from "@/services/motoristas.service";
import { veiculosService, type Veiculo } from "@/services/veiculos.service";
import { listarEscolas, type Escola } from "@/services/escolas.service";

export default function NovaRota() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  // Campos do Formulário
  const [nome, setNome] = useState("");
  const [tipoTrajeto, setTipoTrajeto] = useState<"ENTRADA" | "SAIDA">("ENTRADA");
  const [escolaId, setEscolaId] = useState<string>("");
  const [bairro, setBairro] = useState("");
  const [horarioSaida, setHorarioSaida] = useState("");
  const [horarioRetorno, setHorarioRetorno] = useState("");
  const [motoristaId, setMotoristaId] = useState<string>("");
  const [veiculoId, setVeiculoId] = useState<string>("");
  const [status, setStatus] = useState<string>("ATIVA");
  const [descricao, setDescricao] = useState("");

  // Listas de Opções
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [escolas, setEscolas] = useState<Escola[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 1. Carrega opções e dados da rota
  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);

        const [listaMotoristas, listaVeiculos, listaEscolas] = await Promise.all([
          motoristasService.getAll().catch(() => []),
          veiculosService.getAll().catch(() => []),
          listarEscolas().catch(() => []),
        ]);

        setMotoristas(listaMotoristas || []);
        setVeiculos(listaVeiculos || []);
        setEscolas(listaEscolas || []);

        if (id) {
          const rota = await rotasService.getById(id);
          if (rota) {
            setNome(rota.nome || "");
            setBairro(rota.bairro || "");
            setHorarioSaida(rota.horario_saida ? rota.horario_saida.slice(0, 5) : "");
            setHorarioRetorno(rota.horario_retorno ? rota.horario_retorno.slice(0, 5) : "");
            setMotoristaId(rota.motorista_id || "unassigned");
            setVeiculoId(rota.veiculo_id || "unassigned");
            setStatus(rota.status ? rota.status.toUpperCase() : "ATIVA");
            setDescricao(rota.descricao || "");
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados", error);
        toast.error("Erro ao carregar dados do formulário");
        if (id) navigate("/rotas");
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [id, navigate]);

  // 2. Construção estruturada do nome da rota
  useEffect(() => {
    const tipoTexto = tipoTrajeto === "ENTRADA" ? "Entrada" : "Saída";
    
    const escolaEncontrada = escolas.find((e) => e.id === escolaId && e.id !== "none");
    const escolaTexto = escolaEncontrada ? escolaEncontrada.nome : "";

    const horarioValor = tipoTrajeto === "ENTRADA" ? horarioSaida : horarioRetorno;
    const horarioTexto = horarioValor ? `às ${horarioValor}` : "";

    const bairroTexto = bairro.trim() ? `(${bairro.trim()})` : "";

    const motoristaEncontrado = motoristas.find((m) => m.id === motoristaId && m.id !== "unassigned");
    const motoristaTexto = motoristaEncontrado ? `• ${motoristaEncontrado.nome}` : "";

    const nomeFormatado = [tipoTexto, escolaTexto, horarioTexto, bairroTexto, motoristaTexto]
      .filter(Boolean)
      .join(" ");

    setNome(nomeFormatado);
  }, [tipoTrajeto, escolaId, horarioSaida, horarioRetorno, bairro, motoristaId, escolas, motoristas]);

  // Formata HH:mm para HH:mm:ss garantindo retorno de string
  const formatarHorario = (valor: string): string => {
    if (!valor) return "";
    return valor.length === 5 ? `${valor}:00` : valor;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!nome.trim()) {
      toast.error("Preencha as informações para gerar o nome da rota.");
      return;
    }

    // Se o tipo for ENTRADA usa horarioSaida, se for SAIDA usa horarioRetorno
    const horaPrincipal = tipoTrajeto === "ENTRADA" ? horarioSaida : horarioRetorno;

    if (!horaPrincipal) {
      toast.error("Informe o horário do trajeto");
      return;
    }

    try {
      setSubmitting(true);

      const payload: Record<string, any> = {
        nome: nome.trim(),
        // Garante envio de string para atender a validação do Zod
        horario_saida: formatarHorario(horarioSaida || horarioRetorno),
        horario_retorno: formatarHorario(horarioRetorno),
        bairro: bairro.trim() || null,
        escola_id: !escolaId || escolaId === "none" ? null : escolaId,
        motorista_id: !motoristaId || motoristaId === "unassigned" ? null : motoristaId,
        veiculo_id: !veiculoId || veiculoId === "unassigned" ? null : veiculoId,
        status: status.toUpperCase(),
        descricao: descricao.trim() || null,
      };

      if (isEditing && id) {
        await rotasService.update(id, payload);
        toast.success("Rota atualizada com sucesso");
      } else {
        await rotasService.create(payload);
        toast.success("Rota cadastrada com sucesso");
      }

      navigate("/rotas");
    } catch (error: any) {
      console.error("Erro ao salvar rota", error);
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        (isEditing ? "Erro ao atualizar rota" : "Erro ao cadastrar rota");
      toast.error(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl"
            onClick={() => navigate("/rotas")}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="font-display text-2xl font-semibold">
              {isEditing ? "Editar Rota" : "Nova Rota"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isEditing
                ? "Atualize as informações da rota selecionada"
                : "Preencha os dados para cadastrar uma nova rota"}
            </p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identificação da Rota */}
        <SectionCard title="Identificação da Rota">
          <div className="space-y-2">
            <Label htmlFor="nome" className="flex items-center gap-1.5 font-medium">
              <Lock className="size-3.5 text-muted-foreground" />
              Nome da Rota (Gerado Automático)
            </Label>
            <Input
              id="nome"
              value={nome}
              readOnly
              placeholder="Preencha os campos abaixo para gerar o nome..."
              className="rounded-xl bg-muted/50 font-semibold text-foreground cursor-not-allowed"
            />
          </div>
        </SectionCard>

        {/* Informações Principais */}
        <SectionCard title="Informações e Horários">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Tipo de Trajeto */}
            <div className="space-y-2">
              <Label htmlFor="tipo_trajeto">Tipo de Trajeto *</Label>
              <Select
                value={tipoTrajeto}
                onValueChange={(val: "ENTRADA" | "SAIDA") => setTipoTrajeto(val)}
                disabled={submitting}
              >
                <SelectTrigger id="tipo_trajeto" className="rounded-xl">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ENTRADA">Entrada</SelectItem>
                  <SelectItem value="SAIDA">Saída</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Escola */}
            <div className="space-y-2">
              <Label htmlFor="escola_id">Escola</Label>
              <Select
                value={escolaId}
                onValueChange={setEscolaId}
                disabled={submitting}
              >
                <SelectTrigger id="escola_id" className="rounded-xl">
                  <SelectValue placeholder="Selecione a escola" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma</SelectItem>
                  {escolas.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Horários Dinâmicos */}
            {tipoTrajeto === "ENTRADA" ? (
              <div className="space-y-2">
                <Label htmlFor="horario_saida">Horário de Entrada *</Label>
                <Input
                  id="horario_saida"
                  type="time"
                  value={horarioSaida}
                  onChange={(e) => setHorarioSaida(e.target.value)}
                  className="rounded-xl"
                  disabled={submitting}
                  required
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="horario_retorno">Horário de Saída *</Label>
                <Input
                  id="horario_retorno"
                  type="time"
                  value={horarioRetorno}
                  onChange={(e) => setHorarioRetorno(e.target.value)}
                  className="rounded-xl"
                  disabled={submitting}
                  required
                />
              </div>
            )}

            {/* Bairro */}
            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro / Região</Label>
              <Input
                id="bairro"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                placeholder="Ex: Centro"
                className="rounded-xl"
                disabled={submitting}
              />
            </div>

            {/* Status */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={setStatus}
                disabled={submitting}
              >
                <SelectTrigger id="status" className="rounded-xl">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ATIVA">Ativa</SelectItem>
                  <SelectItem value="INATIVA">Inativa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </SectionCard>

        {/* Atribuições de Equipe e Veículo */}
        <SectionCard title="Atribuições e Detalhes">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Motorista */}
            <div className="space-y-2">
              <Label htmlFor="motorista_id">Motorista Responsável</Label>
              <Select
                value={motoristaId}
                onValueChange={setMotoristaId}
                disabled={submitting}
              >
                <SelectTrigger id="motorista_id" className="rounded-xl">
                  <SelectValue placeholder="Selecione o motorista" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Sem motorista</SelectItem>
                  {motoristas.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Veículo */}
            <div className="space-y-2">
              <Label htmlFor="veiculo_id">Veículo Atribuído</Label>
              <Select
                value={veiculoId}
                onValueChange={setVeiculoId}
                disabled={submitting}
              >
                <SelectTrigger id="veiculo_id" className="rounded-xl">
                  <SelectValue placeholder="Selecione o veículo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Sem veículo</SelectItem>
                  {veiculos.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.modelo} - {v.placa}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Descrição */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="descricao">Descrição / Observações</Label>
              <Textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Observações adicionais da rota..."
                className="rounded-xl min-h-[90px] resize-none"
                disabled={submitting}
              />
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-3 pt-6 mt-6 border-t">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => navigate("/rotas")}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="rounded-xl"
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
                  {isEditing ? "Salvar Alterações" : "Cadastrar Rota"}
                </>
              )}
            </Button>
          </div>
        </SectionCard>
      </form>
    </div>
  );
}