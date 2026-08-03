import { Link } from "react-router-dom";
import {
  Users,
  UserCheck,
  UserMinus,
  IdCard,
  Bus,
  FileSignature,
  CheckCircle2,
  AlertTriangle,
  Wallet,
  Target,
  TrendingUp,
  ReceiptText,
  Landmark,
  Percent,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";

import { KpiCard } from "@/components/ui-kit/kpi-card";
import { SectionCard } from "@/components/ui-kit/primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  agendaDoDia,
  gastosCategoria,
  kpis,
  receitaMensal,
  fluxoCaixa,
  alunosPorEscola,
  brl,
} from "@/data/mock";

const iconMap = {
  users: Users,
  userCheck: UserCheck,
  userMinus: UserMinus,
  steering: IdCard,
  bus: Bus,
  file: FileSignature,
  check: CheckCircle2,
  alert: AlertTriangle,
  wallet: Wallet,
  target: Target,
  trendingUp: TrendingUp,
  receipt: ReceiptText,
  bank: Landmark,
  percent: Percent,
  sparkles: Sparkles,
} as const;

const chartColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

const axis = {
  stroke: "var(--color-muted-foreground)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
};

const tooltipStyle = {
  contentStyle: {
    background: "var(--color-popover)",
    border: "1px solid var(--color-border)",
    borderRadius: "12px",
    fontSize: "12px",
    color: "var(--color-popover-foreground)",
  },
  labelStyle: { color: "var(--color-muted-foreground)" },
};

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Dashboard executivo
          </h1>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            Visão consolidada da operação · competência junho/2026
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Tabs defaultValue="mes">
            <TabsList className="rounded-xl">
              <TabsTrigger value="semana">Semana</TabsTrigger>
              <TabsTrigger value="mes">Mês</TabsTrigger>
              <TabsTrigger value="ano">Ano</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button asChild className="rounded-xl">
            <Link to="/alunos">
              Ver alunos <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {kpis.map((k, i) => (
          <KpiCard
            key={k.label}
            label={k.label}
            value={k.value}
            delta={k.delta}
            trend={k.trend}
            hint={k.hint}
            icon={iconMap[k.icon as keyof typeof iconMap]}
            accent={
              i % 5 === 1
                ? "gold"
                : i % 5 === 3
                ? "info"
                : k.trend === "down" && i > 6
                ? "destructive"
                : "primary"
            }
          />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <SectionCard
          title="Receita x Despesas"
          description="Evolução mensal consolidada em 2026"
          className="xl:col-span-2"
          action={<Badge variant="secondary">R$ 1,68 mi acumulado</Badge>}
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={receitaMensal} margin={{ left: -18, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="gReceita" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gDespesa" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="mes" {...axis} />
              <YAxis {...axis} tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`} />
              <RTooltip {...tooltipStyle} formatter={(v: number) => brl(v)} />
              <Area
                type="monotone"
                dataKey="receita"
                name="Receita"
                stroke="var(--color-chart-1)"
                strokeWidth={2}
                fill="url(#gReceita)"
              />
              <Area
                type="monotone"
                dataKey="despesa"
                name="Despesa"
                stroke="var(--color-chart-2)"
                strokeWidth={2}
                fill="url(#gDespesa)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Gastos por categoria" description="Distribuição das despesas do mês">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={gastosCategoria}
                dataKey="valor"
                nameKey="categoria"
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={92}
                paddingAngle={3}
                stroke="var(--color-card)"
                strokeWidth={2}
              >
                {gastosCategoria.map((_, i) => (
                  <Cell key={i} fill={chartColors[i % chartColors.length]} />
                ))}
              </Pie>
              <RTooltip {...tooltipStyle} formatter={(v: number) => brl(v)} />
            </PieChart>
          </ResponsiveContainer>
          <ul className="mt-2 space-y-1.5">
            {gastosCategoria.map((g, i) => (
              <li key={g.categoria} className="flex items-center justify-between gap-3 text-xs">
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ background: chartColors[i % chartColors.length] }}
                  />
                  <span className="truncate text-muted-foreground">{g.categoria}</span>
                </span>
                <span className="shrink-0 font-medium">{brl(g.valor)}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <SectionCard title="Fluxo de caixa" description="Entradas, saídas e saldo">
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={fluxoCaixa} margin={{ left: -20, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="mes" {...axis} />
              <YAxis {...axis} tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`} />
              <RTooltip {...tooltipStyle} formatter={(v: number) => brl(v)} />
              <Line type="monotone" dataKey="entrada" name="Entradas" stroke="var(--color-chart-1)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="saida" name="Saídas" stroke="var(--color-chart-5)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="saldo" name="Saldo" stroke="var(--color-chart-2)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Alunos por escola" description="Distribuição da base ativa">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={alunosPorEscola} layout="vertical" margin={{ left: 24, right: 12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
              <XAxis type="number" {...axis} />
              <YAxis type="category" dataKey="escola" width={92} {...axis} />
              <RTooltip {...tooltipStyle} />
              <Bar dataKey="alunos" name="Alunos" fill="var(--color-chart-1)" radius={[0, 8, 8, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>
    </div>
  );
}
