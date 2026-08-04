import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Bus, Calendar, Edit, Users } from "lucide-react";
import { toast } from "sonner";

import { SectionCard, StatusPill } from "@/components/ui-kit/primitives";
import { Button } from "@/components/ui/button";

import { veiculosService, type Veiculo } from "@/services/veiculos.service";

export default function VeiculoDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        if (id) {
          const dados = await veiculosService.getById(id);
          setVeiculo(dados);
        }
      } catch (error) {
        console.error("Erro ao carregar detalhes", error);
        toast.error("Não foi possível carregar os dados do veículo");
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [id]);

  if (carregando) {
    return <div className="p-8 text-center text-muted-foreground">Carregando...</div>;
  }

  if (!veiculo) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-muted-foreground">Veículo não encontrado.</p>
        <Button variant="outline" onClick={() => navigate("/veiculos")}>
          Voltar para Lista
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl"
            onClick={() => navigate("/veiculos")}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <Bus className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-semibold">
                  {veiculo.modelo}
                </h1>
                <StatusPill status={veiculo.status ?? "ativo"} />
              </div>
              <p className="text-sm font-mono text-muted-foreground">
                Placa: {veiculo.placa}
              </p>
            </div>
          </div>
        </div>

        <Button
          className="rounded-xl"
          onClick={() => navigate(`/veiculos/${veiculo.id}/editar`)}
        >
          <Edit className="size-4 mr-2" />
          Editar Veículo
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <SectionCard title="Informações do Veículo" className="md:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Modelo</p>
              <p className="font-medium">{veiculo.modelo}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Placa</p>
              <p className="font-medium font-mono">{veiculo.placa}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Marca</p>
              <p className="font-medium">{veiculo.marca || "-"}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Ano</p>
              <p className="font-medium">{veiculo.ano || "-"}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Capacidade</p>
              <p className="font-medium">
                {veiculo.capacidade ? `${veiculo.capacidade} passageiros` : "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Motorista ID</p>
              <p className="font-medium text-xs font-mono">
                {veiculo.motorista_id || "Não vinculado"}
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Resumo">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Users className="size-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Lotação Máxima</p>
                <p className="font-medium">{veiculo.capacidade ?? 0} Lugares</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="size-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Cadastrado em</p>
                <p className="font-medium">
                  {veiculo.created_at
                    ? new Date(veiculo.created_at).toLocaleDateString("pt-BR")
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}