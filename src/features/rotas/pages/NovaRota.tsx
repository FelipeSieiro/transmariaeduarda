// src/pages/NovaRota.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader2, Lock, Route as RouteIcon } from "lucide-react";
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

import { rotasService } from "@/features/rotas/services/rotas.service";
import type { TipoTrajeto } from "@/types/transporte";
import { motoristasService, type Motorista } from "@/features/motoristas/services/motoristas.service";
import { veiculosService, type Veiculo } from "@/features/veiculos/services/veiculos.service";
import { listarEscolas } from "@/services/escolas.service";
import type { Escola } from "@/types/escola";

export default function NovaRota() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [tipoTrajeto, setTipoTrajeto] = useState<TipoTrajeto>("ENTRADA");
  const [escolaId, setEscolaId] = useState<string>("");
  const [bairro, setBairro] = useState("");
  const [horarioSaida, setHorarioSaida] = useState("");
  const [horarioRetorno, setHorarioRetorno] = useState("");
  const [motoristaId, setMotoristaId] = useState<string>("");
  const [veiculoId, setVeiculoId] = useState<string>("");
  const [status, setStatus] = useState<string>("ATIVA");
  const [descricao, setDescricao] = useState("");

  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [escolas, setEscolas] = useState<Escola[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

    if (!horarioSaida.trim() && !horarioRetorno.trim()) {
      toast.error("Informe pelo menos um horário (Entrada ou Retorno)");
      return;
    }

    try {
      setSubmitting(true);

      const payload: Record<string, any> = {
        nome: nome.trim(),
        horario_saida: horarioSaida.trim() ? formatarHorario(horarioSaida) : null,
        horario_retorno: horarioRetorno.trim() ? formatarHorario(horarioRetorno) : null,
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
            onClick={() => navigate("/rotas")}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="inline-flex p-2 rounded-xl bg-primary/10 text-primary">
              <RouteIcon className="size-5" />
            </div>
            <div className="space-y-0.5">
              <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                {isEditing ? "Editar Rota" : "Nova Rota"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isEditing
                  ? "Atualize as informações e diretrizes da rota selecionada"
                  : "Preencha os dados para cadastrar uma nova rota"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionCard
          title="Identificação da Rota"
          description="Nome gerado automaticamente com base nos parâmetros preenchidos"
        >
          <div className="space-y-1.5">
            <Label htmlFor="nome" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Lock className="size-3.5 text-muted-foreground" />
              Nome da Rota (Gerado Automático)
            </Label>
            <Input
              id="nome"
              value={nome}
              readOnly
              placeholder="Preencha os campos abaixo para gerar o nome..."
              className="rounded-xl h-10 bg-muted/50 font-semibold text-foreground cursor-not-allowed"
            />
          </div>
        </SectionCard>

        <SectionCard
          title="Informações e Horários"
          description="Definição de trajeto, escola, horários e região"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="tipo_trajeto" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tipo de Trajeto *
              </Label>
              <Select
                value={tipoTrajeto}
                onValueChange={(val: TipoTrajeto) => setTipoTrajeto(val)}
                disabled={submitting}
              >
                <SelectTrigger id="tipo_trajeto" className="rounded-xl h-10">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="ENTRADA">Entrada</SelectItem>
                  <SelectItem value="SAIDA">Saída</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="escola_id" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Escola
              </Label>
              <Select
                value={escolaId}
                onValueChange={setEscolaId}
                disabled={submitting}
              >
                <SelectTrigger id="escola_id" className="rounded-xl h-10">
                  <SelectValue placeholder="Selecione a escola" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="none">Nenhuma</SelectItem>
                  {escolas.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ambos os campos de horário visíveis independentemente */}
            <div className="space-y-1.5">
              <Label htmlFor="horario_saida" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Horário de Saída
              </Label>
              <Input
                id="horario_saida"
                type="time"
                value={horarioSaida}
                onChange={(e) => setHorarioSaida(e.target.value)}
                className="rounded-xl h-10"
                disabled={submitting}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="horario_retorno" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Horário de Retorno
              </Label>
              <Input
                id="horario_retorno"
                type="time"
                value={horarioRetorno}
                onChange={(e) => setHorarioRetorno(e.target.value)}
                className="rounded-xl h-10"
                disabled={submitting}
              />
            </div>



            <div className="space-y-1.5">
              <Label htmlFor="bairro" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Bairro / Região
              </Label>
              <Input
                id="bairro"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                placeholder="Ex: Centro"
                className="rounded-xl h-10"
                disabled={submitting}
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="status" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </Label>
              <Select
                value={status}
                onValueChange={setStatus}
                disabled={submitting}
              >
                <SelectTrigger id="status" className="rounded-xl h-10">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="ATIVA">Ativa</SelectItem>
                  <SelectItem value="INATIVA">Inativa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Atribuições e Detalhes"
          description="Designação de motorista, veículo e observações adicionais"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="motorista_id" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Motorista Responsável
              </Label>
              <Select
                value={motoristaId}
                onValueChange={setMotoristaId}
                disabled={submitting}
              >
                <SelectTrigger id="motorista_id" className="rounded-xl h-10">
                  <SelectValue placeholder="Selecione o motorista" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="unassigned">Sem motorista</SelectItem>
                  {motoristas.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="veiculo_id" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Veículo Atribuído
              </Label>
              <Select
                value={veiculoId}
                onValueChange={setVeiculoId}
                disabled={submitting}
              >
                <SelectTrigger id="veiculo_id" className="rounded-xl h-10">
                  <SelectValue placeholder="Selecione o veículo" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="unassigned">Sem veículo</SelectItem>
                  {veiculos.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.modelo} - {v.placa}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="descricao" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Descrição / Observações
              </Label>
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

          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-border/60">
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