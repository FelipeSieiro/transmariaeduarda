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
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Clock,
} from "lucide-react";

import api from "@/config/api";
import { alunosService } from "@/features/alunos/services/alunos.service";
import { contratosService } from "@/features/contratos/services/contratos.service";
import type { Contrato } from "@/features/contratos/types/contrato";
import type { Mensalidade } from "@/features/alunos/types/mensalidade";
import { mensalidadesService } from "@/features/alunos/services/mensalidades.service";
import { motoristasService } from "@/features/motoristas/services/motoristas.service";
import { veiculosService } from "@/features/veiculos/services/veiculos.service";
import { rotasService } from "@/features/rotas/services/rotas.service";

import { ListPageHeader } from "@/components/common/page-header";
import { SectionCard } from "@/components/ui-kit/primitives";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DashboardStats {
  totalAlunos: number;
  alunosAtivos: number;
  alunosManha: number;
  alunosTarde: number;
  alunosNoite: number;
  totalContratos: number;
  contratosAtivos: number;
  totalMotoristas: number;
  motoristasAtivos: number;
  totalVeiculos: number;
  veiculosAtivos: number;
  totalRotas: number;
  rotasAtivas: number;
  receitaMensal: number;
  mensalidadesPagas: number;
  mensalidadesAReceber: number;
}

interface MensalidadeTimeline {
  mes: string;
  competencia: string;
  pagas: number;
  aReceber: number;
}

function MetricCard({
  icon: Icon,
  title,
  value,
  subtitle,
  trend,
  trendUp = true,
  color = "primary",
}: {
  icon: any;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendUp?: boolean;
  color?: "primary" | "success" | "warning" | "destructive";
}) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary border-primary/20",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    destructive: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  };

  const trendColor = trendUp ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400";

  return (
    <div className="surface-card rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{value}</h3>
          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{subtitle}</p>
          )}
          {trend && (
            <p className={`mt-2 text-xs font-medium flex items-center gap-1 ${trendColor}`}>
              {trendUp ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
              {trend}
            </p>
          )}
        </div>
        <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl border ${colorClasses[color]}`}>
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAlunos: 0,
    alunosAtivos: 0,
    alunosManha: 0,
    alunosTarde: 0,
    alunosNoite: 0,
    totalContratos: 0,
    contratosAtivos: 0,
    totalMotoristas: 0,
    motoristasAtivos: 0,
    totalVeiculos: 0,
    veiculosAtivos: 0,
    totalRotas: 0,
    rotasAtivas: 0,
    receitaMensal: 0,
    mensalidadesPagas: 0,
    mensalidadesAReceber: 0,
  });

  const [mensalidadesTimeline, setMensalidadesTimeline] = useState<MensalidadeTimeline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);

        // Chamada direta à API para contratos
        const contratosResponse = await api.get("/contratos");
        const contratosArray = contratosResponse.data.data || [];

        const [alunos, motoristas, veiculos, rotas] = await Promise.all([
          alunosService.getAll().catch(() => []),
          motoristasService.getAll().catch(() => []),
          veiculosService.getAll().catch(() => []),
          rotasService.listar().catch(() => []),
        ]);

        const alunosArray = Array.isArray(alunos) ? alunos : [];
        const motoristasArray = Array.isArray(motoristas) ? motoristas : [];
        const veiculosArray = Array.isArray(veiculos) ? veiculos : [];
        const rotasArray = Array.isArray(rotas) ? rotas : [];

        const alunosAtivos = alunosArray.filter(
          (a: any) => a.status?.toLowerCase() === "ativo"
        ).length;
        const contratosAtivos = contratosArray.filter(
          (c: Contrato) => c.status?.toLowerCase() === "ativo"
        ).length;
        const motoristasAtivos = motoristasArray.filter(
          (m: any) => m.status?.toLowerCase() === "ativo"
        ).length;
        const veiculosAtivos = veiculosArray.filter(
          (v: any) => v.status?.toLowerCase() === "ativo"
        ).length;
        const rotasAtivas = rotasArray.filter(
          (r: any) => r.status?.toLowerCase() === "ativa"
        ).length;

        // Calcular distribuição por turno (dados reais dos alunos)
        const alunosManha = alunosArray.filter(
          (a: any) => a.turno?.toLowerCase() === "manhã" || a.turno?.toLowerCase() === "manha"
        ).length;
        const alunosTarde = alunosArray.filter(
          (a: any) => a.turno?.toLowerCase() === "tarde"
        ).length;
        const alunosNoite = alunosArray.filter(
          (a: any) => a.turno?.toLowerCase() === "noite"
        ).length;

        const receitaMensal = contratosArray
          .filter((c: Contrato) => c.status?.toLowerCase() === "ativo")
          .reduce((acc: number, c: Contrato) => acc + (c.valor_mensalidade || 0), 0);

        // Calcular mensalidades pagas e a receber dos contratos ativos, agrupadas por mês (anual)
        const contratosAtivosData = contratosArray.filter(
          (c: Contrato) => c.status?.toLowerCase() === "ativo"
        );

        let mensalidadesPagas = 0;
        let mensalidadesAReceber = 0;

        // Agrupar mensalidades por mês (competência no formato MM/YYYY ou YYYY-MM)
        const mensalidadesPorMes: Record<string, { pagas: number; aReceber: number }> = {};

        // Buscar mensalidades de cada contrato ativo
        const mensalidadesPromises = contratosAtivosData.map(async (contrato: Contrato) => {
          if (contrato.id) {
            try {
              const mensalidades = await mensalidadesService.buscarPorContrato(contrato.id);
              return mensalidades;
            } catch (error) {
              return [];
            }
          }
          return [];
        });

        const todasMensalidades = await Promise.all(mensalidadesPromises);

        // Processar todas as mensalidades
        todasMensalidades.flat().forEach((mensalidade: Mensalidade) => {
          const status = mensalidade.status?.toLowerCase();
          const competencia = mensalidade.competencia || "Não definido";
          
          // Normalizar o formato da competência para MM/YYYY
          let mesAno = competencia;
          let ano = "";
          if (competencia.includes('/')) {
            const partes = competencia.split('/');
            if (partes.length === 2 && partes[0] && partes[1]) {
              mesAno = `${partes[0]}/${partes[1]}`;
              ano = partes[1];
            }
          } else if (competencia.includes('-')) {
            const partes = competencia.split('-');
            if (partes.length === 2 && partes[0] && partes[1]) {
              mesAno = `${partes[1]}/${partes[0]}`;
              ano = partes[0];
            }
          }
          
          // Filtrar apenas mensalidades do ano atual (2026)
          if (ano !== "2026") {
            return;
          }
          
          if (!mensalidadesPorMes[mesAno]) {
            mensalidadesPorMes[mesAno] = { pagas: 0, aReceber: 0 };
          }

          if (status === "pago") {
            const valor = mensalidade.valor ?? 0;
            mensalidadesPagas += valor;
            mensalidadesPorMes[mesAno]!.pagas += valor;
          } else if (status === "pendente" || status === "atrasado") {
            const valor = mensalidade.valor ?? 0;
            mensalidadesAReceber += valor;
            mensalidadesPorMes[mesAno]!.aReceber += valor;
          }
        });

        // Gerar todos os meses do ano atual
        const anoAtual = new Date().getFullYear();
        const meses = [
          "01", "02", "03", "04", "05", "06",
          "07", "08", "09", "10", "11", "12"
        ];
        const nomesMeses = [
          "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
          "Jul", "Ago", "Set", "Out", "Nov", "Dez"
        ];

        // Criar array com todos os meses do ano, preenchendo com dados ou zeros
        const mensalidadesTimelineData: MensalidadeTimeline[] = meses.map((mes, index) => {
          const mesAno = `${mes}/${anoAtual}`;
          const dados = mensalidadesPorMes[mesAno] || { pagas: 0, aReceber: 0 };
          return {
            mes: nomesMeses[index] || mes,
            competencia: mesAno,
            pagas: dados.pagas,
            aReceber: dados.aReceber,
          };
        });

        setStats({
          totalAlunos: alunosArray.length,
          alunosAtivos,
          alunosManha,
          alunosTarde,
          alunosNoite,
          totalContratos: contratosArray.length,
          contratosAtivos,
          totalMotoristas: motoristasArray.length,
          motoristasAtivos,
          totalVeiculos: veiculosArray.length,
          veiculosAtivos,
          totalRotas: rotasArray.length,
          rotasAtivas,
          receitaMensal,
          mensalidadesPagas,
          mensalidadesAReceber,
        });

        setMensalidadesTimeline(mensalidadesTimelineData);
      } catch (error) {
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
      <div className="mx-auto w-full max-w-7xl space-y-6 py-2">
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

  // Dados para gráficos - usando cores exatas do design system (oklch convertidas para hex)
  const statusData = [
    { name: "Ativos", value: stats.alunosAtivos, color: "#22c55e" }, // success: oklch(0.65 0.17 145)
    { name: "Inativos", value: stats.totalAlunos - stats.alunosAtivos, color: "#eab308" }, // warning: oklch(0.84 0.18 85)
  ];

  const contratosData = [
    { name: "Ativos", value: stats.contratosAtivos, color: "#22c55e" }, // success: oklch(0.65 0.17 145)
    { name: "Inativos", value: stats.totalContratos - stats.contratosAtivos, color: "#ef4444" }, // destructive: oklch(0.60 0.22 25)
  ];

  const frotaData = [
    { name: "Motoristas Ativos", value: stats.motoristasAtivos },
    { name: "Motoristas Inativos", value: stats.totalMotoristas - stats.motoristasAtivos },
    { name: "Veículos Ativos", value: stats.veiculosAtivos },
    { name: "Veículos Inativos", value: stats.totalVeiculos - stats.veiculosAtivos },
  ];

  // Dados para gráfico de distribuição por turno (dados reais da API)
  const turnoData = [
    { name: "Manhã", value: stats.alunosManha, color: "#eab308" },
    { name: "Tarde", value: stats.alunosTarde, color: "#22c55e" },
    { name: "Noite", value: stats.alunosNoite, color: "#3b82f6" },
  ];

  // Dados para gráfico de eficiência da frota (dados reais da API)
  const capacidadeTotal = stats.veiculosAtivos * 45; // Assumindo 45 alunos por veículo
  const eficienciaData = [
    { name: "Capacidade Total", value: capacidadeTotal, color: "#eab308" },
    { name: "Alunos Transportados", value: stats.alunosAtivos, color: "#22c55e" },
    { name: "Vagas Disponíveis", value: capacidadeTotal - stats.alunosAtivos, color: "#ef4444" },
  ];

  // Dados para gráfico de distribuição de rotas (dados reais da API)
  const rotasDistribuicaoData = [
    { name: "Rotas Ativas", value: stats.rotasAtivas, color: "#22c55e" },
    { name: "Rotas Inativas", value: stats.totalRotas - stats.rotasAtivas, color: "#ef4444" },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 py-2">
      <ListPageHeader
        title="Dashboard"
        subtitle="Visão geral da operação de transporte escolar"
        actions={
          <Badge variant="outline" className="h-8 gap-2">
            <Activity className="size-3" />
            <span>Atualizado agora</span>
          </Badge>
        }
      />

      {/* KPIs Principais - Operação */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={Users}
          title="Total de Alunos"
          value={stats.totalAlunos}
          subtitle={`${stats.alunosAtivos} ativos`}
          trend={`${stats.totalAlunos > 0 ? Math.round((stats.alunosAtivos / stats.totalAlunos) * 100) : 0}% ativos`}
          trendUp={true}
          color="primary"
        />
        <MetricCard
          icon={Bus}
          title="Veículos"
          value={stats.totalVeiculos}
          subtitle={`${stats.veiculosAtivos} ativos`}
          trend={`${stats.totalVeiculos > 0 ? Math.round((stats.veiculosAtivos / stats.totalVeiculos) * 100) : 0}% ativos`}
          trendUp={true}
          color="success"
        />
        <MetricCard
          icon={UserCheck}
          title="Motoristas"
          value={stats.totalMotoristas}
          subtitle={`${stats.motoristasAtivos} ativos`}
          trend={`${stats.totalMotoristas > 0 ? Math.round((stats.motoristasAtivos / stats.totalMotoristas) * 100) : 0}% ativos`}
          trendUp={true}
          color="success"
        />
        <MetricCard
          icon={Calendar}
          title="Rotas"
          value={stats.totalRotas}
          subtitle={`${stats.rotasAtivas} ativas`}
          trend={`${stats.totalRotas > 0 ? Math.round((stats.rotasAtivas / stats.totalRotas) * 100) : 0}% ativas`}
          trendUp={true}
          color="warning"
        />
      </div>

      {/* KPIs Financeiros */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          icon={FileText}
          title="Contratos"
          value={stats.totalContratos}
          subtitle={`${stats.contratosAtivos} ativos`}
          trend={`${stats.totalContratos > 0 ? Math.round((stats.contratosAtivos / stats.totalContratos) * 100) : 0}% ativos`}
          trendUp={true}
          color="primary"
        />
        <MetricCard
          icon={DollarSign}
          title="Receita Mensal"
          value={formatCurrency(stats.receitaMensal)}
          subtitle="Contratos ativos"
          trend="Estável"
          trendUp={true}
          color="success"
        />
        <MetricCard
          icon={TrendingUp}
          title="Taxa de Ocupação"
          value={`${stats.totalVeiculos > 0 ? Math.round((stats.veiculosAtivos / stats.totalVeiculos) * 100) : 0}%`}
          subtitle="Frota ativa"
          trend="Eficiência"
          trendUp={true}
          color="primary"
        />
      </div>

      {/* Gráficos - Status e Operação */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Gráfico de Status de Alunos */}
        <SectionCard
          title="Status dos Alunos"
          description="Distribuição de alunos ativos e inativos"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-xs text-muted-foreground">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        {/* Gráfico de Status dos Contratos */}
        <SectionCard
          title="Status dos Contratos"
          description="Distribuição de contratos ativos e inativos"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={contratosData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {contratosData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-xs text-muted-foreground">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Gráficos - Distribuição e Eficiência */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Gráfico de Distribuição por Turno */}
        <SectionCard
          title="Distribuição por Turno"
          description="Alunos por período"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={turnoData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {turnoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-xs text-muted-foreground">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        {/* Gráfico de Eficiência da Frota */}
        <SectionCard
          title="Eficiência da Frota"
          description="Capacidade vs Ocupação"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={eficienciaData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {eficienciaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-xs text-muted-foreground">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        {/* Gráfico de Distribuição de Rotas */}
        <SectionCard
          title="Distribuição de Rotas"
          description="Rotas ativas vs inativas"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={rotasDistribuicaoData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {rotasDistribuicaoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-xs text-muted-foreground">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Gráfico de Mensalidades Pagas x a Receber */}
      <SectionCard
        title="Mensalidades: Pagas x a Receber"
        description="Comparativo de mensalidades pagas e pendentes dos contratos ativos"
      >
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mensalidadesTimeline}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="mes"
                className="text-xs"
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                className="text-xs"
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value) => formatCurrency(Number(value))}
                labelFormatter={(label) => {
                  const item = mensalidadesTimeline.find(d => d.mes === label);
                  return item ? item.competencia : label;
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-xs text-muted-foreground">{value}</span>
                )}
              />
              <Line
                type="monotone"
                dataKey="pagas"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
                name="Pagas"
              />
              <Line
                type="monotone"
                dataKey="aReceber"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                name="A Receber"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* Gráfico de Frota */}
      <SectionCard
        title="Status da Frota"
        description="Motoristas e veículos ativos vs inativos"
      >
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={frotaData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="name"
                className="text-xs"
                stroke="hsl(var(--muted-foreground))"
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                className="text-xs"
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" fill="#eab308" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* Gráficos Adicionais - Comparativos */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Gráfico de Comparativo de Recursos */}
        <SectionCard
          title="Comparativo de Recursos"
          description="Relação entre alunos, motoristas e veículos"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: "Alunos", value: stats.alunosAtivos, color: "#22c55e" },
                { name: "Motoristas", value: stats.motoristasAtivos, color: "#3b82f6" },
                { name: "Veículos", value: stats.veiculosAtivos, color: "#eab308" },
              ]}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="name"
                  className="text-xs"
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  className="text-xs"
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {[{ name: "Alunos", value: stats.alunosAtivos, color: "#22c55e" },
                    { name: "Motoristas", value: stats.motoristasAtivos, color: "#3b82f6" },
                    { name: "Veículos", value: stats.veiculosAtivos, color: "#eab308" }].map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        {/* Gráfico de Performance Financeira */}
        <SectionCard
          title="Performance Financeira"
          description="Receita potencial vs receita atual"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: "Receita Mensal", value: stats.receitaMensal, color: "#22c55e" },
                { name: "Mensalidades Pagas", value: stats.mensalidadesPagas, color: "#3b82f6" },
                { name: "A Receber", value: stats.mensalidadesAReceber, color: "#ef4444" },
              ]}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="name"
                  className="text-xs"
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  className="text-xs"
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => formatCurrency(Number(value))}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {[
                    { name: "Receita Mensal", value: stats.receitaMensal, color: "#22c55e" },
                    { name: "Mensalidades Pagas", value: stats.mensalidadesPagas, color: "#3b82f6" },
                    { name: "A Receber", value: stats.mensalidadesAReceber, color: "#ef4444" }
                  ].map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Alertas e Atividades */}
      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          title="Alertas da Operação"
          description="Atenção aos itens que precisam de ação"
        >
          <div className="space-y-3">
            {stats.veiculosAtivos < stats.totalVeiculos && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <AlertCircle className="size-5 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    Veículos inativos
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.totalVeiculos - stats.veiculosAtivos} veículo(s) inativo(s)
                  </p>
                </div>
              </div>
            )}

            {stats.motoristasAtivos < stats.totalMotoristas && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <AlertCircle className="size-5 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    Motoristas inativos
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.totalMotoristas - stats.motoristasAtivos} motorista(s) inativo(s)
                  </p>
                </div>
              </div>
            )}

            {stats.rotasAtivas < stats.totalRotas && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <AlertCircle className="size-5 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">Rotas inativas</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.totalRotas - stats.rotasAtivas} rota(s) inativa(s)
                  </p>
                </div>
              </div>
            )}

            {stats.veiculosAtivos === stats.totalVeiculos &&
              stats.motoristasAtivos === stats.totalMotoristas &&
              stats.rotasAtivas === stats.totalRotas && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                  <TrendingUp className="size-5 text-green-600 dark:text-green-400 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Operação em dia
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Todos os sistemas operacionais
                    </p>
                  </div>
                </div>
              )}
          </div>
        </SectionCard>

        <SectionCard
          title="Atividades Recentes"
          description="Últimas atualizações do sistema"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Clock className="size-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  Dashboard atualizado
                </p>
                <p className="text-xs text-muted-foreground">
                  Dados carregados com sucesso
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Activity className="size-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  Sincronização completa
                </p>
                <p className="text-xs text-muted-foreground">
                  Todos os serviços integrados
                </p>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
