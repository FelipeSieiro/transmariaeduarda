import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bus,
  CalendarDays,
  FileSignature,
  School,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui-kit/primitives";
import { buscarContrato, type Contrato } from "@/services/contratos.service";

function Campo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value || "-"}</p>
    </div>
  );
}

function moeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function ContratoDetalhe() {
  const { id } = useParams();
  const [contrato, setContrato] = useState<Contrato | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        if (!id) return;
        const dados = await buscarContrato(id);
        setContrato(dados);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar contrato");
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [id]);

  if (carregando) {
    return <div className="p-6 text-center">Carregando contrato...</div>;
  }

  if (!contrato) {
    return <div className="p-6 text-center">Contrato não encontrado</div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Button asChild variant="ghost">
        <Link to="/contratos">
          <ArrowLeft className="size-4 mr-2" />
          Voltar
        </Link>
      </Button>

      <div>
        <h1 className="flex items-center gap-2 text-3xl font-semibold">
          <FileSignature className="size-7" />
          Contrato {contrato.numero}
        </h1>
        <p className="text-sm text-muted-foreground">
          Detalhes comerciais do contrato
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Contrato" description="Informações financeiras">
          <div className="space-y-4">
            <Campo label="Número" value={contrato.numero} />
            <Campo
              label="Valor mensalidade"
              value={moeda(Number(contrato.valor_mensalidade))}
            />
            <Campo
              label="Dia vencimento"
              value={`Dia ${contrato.dia_vencimento}`}
            />
            <Campo
              label="Forma pagamento"
              value={contrato.forma_pagamento ?? "-"}
            />
            <Campo label="Status" value={contrato.status ?? "-"} />
          </div>
        </SectionCard>

        <SectionCard title="Aluno" description="Aluno vinculado">
          <div className="space-y-4">
            <User className="size-5 text-primary" />
            <Campo label="Nome" value={contrato.alunos?.nome ?? "-"} />
            <Campo
              label="Matrícula"
              value={contrato.alunos?.matricula ?? "-"}
            />
          </div>
        </SectionCard>

        <SectionCard title="Datas" description="Vigência do contrato">
          <div className="space-y-4">
            <CalendarDays className="size-5 text-primary" />
            <Campo label="Início" value={contrato.data_inicio} />
            <Campo label="Fim" value={contrato.data_fim ?? "-"} />
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Relacionamentos"
        description="Dados vinculados ao aluno"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex gap-3">
            <School className="size-5 text-primary" />
            <Campo
              label="Escola"
              value={contrato.alunos?.escolas?.nome ?? "-"}
            />
          </div>

          <div className="flex gap-3">
            <Bus className="size-5 text-primary" />
            <Campo label="Rota" value={contrato.alunos?.rotas?.nome ?? "-"} />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Observações" description="Informações adicionais">
        <p className="text-sm text-muted-foreground">
          {contrato.observacoes ?? "Nenhuma observação cadastrada"}
        </p>
      </SectionCard>
    </div>
  );
}