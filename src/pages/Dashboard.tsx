import { useEffect, useState } from "react";
import {
  Users,
  Bus,
  UserCheck,
  FileText,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Calendar,
} from "lucide-react";

import { alunosService } from "@/features/alunos/services/alunos.service";
import { contratosService } from "@/features/contratos/services/contratos.service";
import { motoristasService } from "@/features/motoristas/services/motoristas.service";
import { veiculosService } from "@/features/veiculos/services/veiculos.service";
import { rotasService } from "@/features/rotas/services/rotas.service";
import { useAsyncData } from "@/hooks/use-async-data";

interface DashboardStats {
  totalAlunos: number;
  alunosAtivos: number;
  totalContratos: number;
  contratosAtivos: number;
  totalMotoristas: number;
  motoristasAtivos: number;
  totalVeiculos: number;
  veiculosAtivos: number;
  totalRotas: number;
  rotasAtivas: number;
  receitaMensal: number;
}

function MetricCard({
  icon: Icon,
  title,
  value,
  subtitle,
  trend,
  color = "primary",
}: {
  icon: any;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  color?: "primary" | "success" | "warning" | "destructive";
}) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    destructive: "bg-destructive/10 text-destructive",
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-foreground">{value}</h3>
          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <p className="mt-2 text-xs text-success flex items-center gap-1">
              <TrendingUp className="size-3" />
              {trend}
            </p>
          )}
        </div>
        <div className={`flex size-12 items-center justify-center rounded-xl ${colorClasses[color]}`}>
          <Icon className="size-6" />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAlunos: 0,
    alunosAtivos: 0,
    totalContratos: 0,
    contratosAtivos: 0,
    totalMotoristas: 0,
    motoristasAtivos: 0,
    totalVeiculos: 0,
    veiculosAtivos: 0,
    totalRotas: 0,
    rotasAtivas: 0,
    receitaMensal: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);

        const [alunos, contratos, motoristas, veiculos, rotas] = await Promise.all([
          alunosService.getAll().catch(() => []),
          contratosService.getAll().catch(() => []),
          motoristasService.getAll().catch(() => []),
          veiculosService.getAll().catch(() => []),
          rotasService.listar().catch(() => []),
        ]);

        const alunosArray = Array.isArray(alunos) ? alunos : [];
        const contratosArray = Array.isArray(contratos) ? contratos : [];
        const motoristasArray = Array.isArray(motoristas) ? motoristas : [];
        const veiculosArray = Array.isArray(veiculos) ? veiculos : [];
        const rotasArray = Array.isArray(rotas) ? rotas : [];

        const alunosAtivos = alunosArray.filter(
          (a) => a.status?.toLowerCase() === "ativo"
        ).length;
        const contratosAtivos = contratosArray.filter(
          (c) => c.status?.toLowerCase() === "ativo"
        ).length;
        const motoristasAtivos = motoristasArray.filter(
          (m) => m.status?.toLowerCase() === "ativo"
        ).length;
        const veiculosAtivos = veiculosArray.filter(
          (v) => v.status?.toLowerCase() === "ativo"
        ).length;
        const rotasAtivas = rotasArray.filter(
          (r) => r.status?.toLowerCase() === "ativa"
        ).length;

        const receitaMensal = contratosArray
          .filter((c) => c.status?.toLowerCase() === "ativo")
          .reduce((acc, c) => acc + (c.valor_mensalidade || 0), 0);

        setStats({
          totalAlunos: alunosArray.length,
          alunosAtivos,
          totalContratos: contratosArray.length,
          contratosAtivos,
          totalMotoristas: motoristasArray.length,
          motoristasAtivos,
          totalVeiculos: veiculosArray.length,
          veiculosAtivos,
          totalRotas: rotasArray.length,
          rotasAtivas,
          receitaMensal,
        });
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral da operação de transporte escolar
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={Users}
          title="Total de Alunos"
          value={stats.totalAlunos}
          subtitle={`${stats.alunosAtivos} ativos`}
          color="primary"
        />
        <MetricCard
          icon={FileText}
          title="Contratos"
          value={stats.totalContratos}
          subtitle={`${stats.contratosAtivos} ativos`}
          color="primary"
        />
        <MetricCard
          icon={UserCheck}
          title="Motoristas"
          value={stats.totalMotoristas}
          subtitle={`${stats.motoristasAtivos} ativos`}
          color="success"
        />
        <MetricCard
          icon={Bus}
          title="Veículos"
          value={stats.totalVeiculos}
          subtitle={`${stats.veiculosAtivos} ativos`}
          color="success"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          icon={Calendar}
          title="Rotas"
          value={stats.totalRotas}
          subtitle={`${stats.rotasAtivas} ativas`}
          color="warning"
        />
        <MetricCard
          icon={DollarSign}
          title="Receita Mensal"
          value={formatCurrency(stats.receitaMensal)}
          subtitle="Contratos ativos"
          color="success"
        />
        <MetricCard
          icon={TrendingUp}
          title="Taxa de Ocupação"
          value={`${stats.totalVeiculos > 0 ? Math.round((stats.veiculosAtivos / stats.totalVeiculos) * 100) : 0}%`}
          subtitle="Frota ativa"
          color="primary"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Status da Operação</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Alunos ativos</span>
              <span className="text-sm font-medium">
                {stats.totalAlunos > 0
                  ? Math.round((stats.alunosAtivos / stats.totalAlunos) * 100)
                  : 0}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{
                  width: `${
                    stats.totalAlunos > 0
                      ? (stats.alunosAtivos / stats.totalAlunos) * 100
                      : 0
                  }%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Contratos ativos</span>
              <span className="text-sm font-medium">
                {stats.totalContratos > 0
                  ? Math.round((stats.contratosAtivos / stats.totalContratos) * 100)
                  : 0}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-success transition-all"
                style={{
                  width: `${
                    stats.totalContratos > 0
                      ? (stats.contratosAtivos / stats.totalContratos) * 100
                      : 0
                  }%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Frota ativa</span>
              <span className="text-sm font-medium">
                {stats.totalVeiculos > 0
                  ? Math.round((stats.veiculosAtivos / stats.totalVeiculos) * 100)
                  : 0}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-warning transition-all"
                style={{
                  width: `${
                    stats.totalVeiculos > 0
                      ? (stats.veiculosAtivos / stats.totalVeiculos) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Alertas</h3>
          <div className="space-y-3">
            {stats.veiculosAtivos < stats.totalVeiculos && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
                <AlertCircle className="size-5 text-warning mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Veículos inativos
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stats.totalVeiculos - stats.veiculosAtivos} veículo(s) inativo(s)
                  </p>
                </div>
              </div>
            )}

            {stats.motoristasAtivos < stats.totalMotoristas && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
                <AlertCircle className="size-5 text-warning mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Motoristas inativos
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stats.totalMotoristas - stats.motoristasAtivos} motorista(s)
                    inativo(s)
                  </p>
                </div>
              </div>
            )}

            {stats.rotasAtivas < stats.totalRotas && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
                <AlertCircle className="size-5 text-warning mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Rotas inativas</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.totalRotas - stats.rotasAtivas} rota(s) inativa(s)
                  </p>
                </div>
              </div>
            )}

            {stats.veiculosAtivos === stats.totalVeiculos &&
              stats.motoristasAtivos === stats.totalMotoristas &&
              stats.rotasAtivas === stats.totalRotas && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10 border border-success/20">
                  <TrendingUp className="size-5 text-success" />
                  <p className="text-sm font-medium text-foreground">
                    Operação em dia
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
