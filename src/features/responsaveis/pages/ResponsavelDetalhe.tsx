import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Mail, Phone, User, MapPin } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui-kit/primitives";
import { ROUTES } from "@/constants/routes";
import { responsaveisService } from "@/features/responsaveis/services/responsaveis.service";
import type { Responsavel } from "@/features/responsaveis/types/responsavel";
import { formatCPF, formatPhone, formatEmail } from "@/utils/format-text";

export default function ResponsavelDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [responsavel, setResponsavel] = useState<Responsavel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      if (!id) return;

      try {
        setLoading(true);
        const dados = await responsaveisService.getById(id);
        setResponsavel(dados);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar dados do responsável");
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [id]);

  async function excluir() {
    if (!id || !responsavel) return;

    if (!window.confirm(`Tem certeza que deseja excluir ${responsavel.nome}?`)) {
      return;
    }

    try {
      await responsaveisService.remove(id);
      toast.success("Responsável excluído com sucesso");
      navigate(ROUTES.RESPONSAVEIS);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir responsável");
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

  if (!responsavel) {
    return (
      <div className="mx-auto max-w-4xl py-8">
        <p className="text-center text-muted-foreground">Responsável não encontrado</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(ROUTES.RESPONSAVEIS)}
          >
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{responsavel.nome}</h1>
            <p className="text-sm text-muted-foreground">Detalhes do responsável</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => id && navigate(ROUTES.RESPONSAVEL_EDITAR(id))}
          >
            <Edit className="mr-2 size-4" />
            Editar
          </Button>
          <Button variant="destructive" onClick={excluir}>
            <Trash2 className="mr-2 size-4" />
            Excluir
          </Button>
        </div>
      </div>

      <SectionCard title="Informações Pessoais">
        <div className="grid gap-4">
          <div className="flex items-center gap-3">
            <User className="size-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Nome</p>
              <p className="text-sm text-muted-foreground">{responsavel.nome}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="size-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">CPF</p>
              <p className="text-sm text-muted-foreground font-mono">{formatCPF(responsavel.cpf) || "—"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="size-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{formatEmail(responsavel.email) || "—"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="size-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Telefone</p>
              <p className="text-sm text-muted-foreground">{formatPhone(responsavel.telefone) || "—"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="size-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Endereço</p>
              <p className="text-sm text-muted-foreground">
                {responsavel.endereco || "—"}
              </p>
            </div>
          </div>
        </div>
      </SectionCard>

      {responsavel.observacoes && (
        <SectionCard title="Observações">
          <p className="text-sm text-muted-foreground">{responsavel.observacoes}</p>
        </SectionCard>
      )}
    </div>
  );
}
