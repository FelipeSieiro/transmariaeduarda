// Mock data layer — substitui futuras chamadas REST sem refatoração de UI.

export type StatusAluno = "ativo" | "inativo" | "suspenso";
export type StatusPagamento = "pago" | "pendente" | "atrasado";

export interface Aluno {
  id: string;
  nome: string;
  foto: string;
  nascimento: string;
  escola: string;
  serie: string;
  turno: string;
  bairro: string;
  endereco: string;
  cidade: string;
  responsavel: string;
  parentesco: string;
  telefone: string;
  enderecoResponsavel?: string;
  email: string;
  motorista: string;
  veiculo: string;
  rota: string;
  mensalidade: number;
  status: StatusAluno;
  pagamento: StatusPagamento;
  desde: string;
  contrato: {
    numero: string;
    inicio: string;
    fim: string;
    vencimentoDia: number;
    formaPagamento: string;
    observacoes: string;
  };
  mensalidades: Array<{
    competencia: string;
    vencimento: string;
    valor: number;
    status: StatusPagamento;
    pagoEm: string | null;
    forma: string;
  }>;
  ocorrencias: Array<{ data: string; tipo: string; descricao: string; gravidade: "baixa" | "media" | "alta" }>;
  historico: Array<{ data: string; evento: string }>;
  documentos: Array<{ nome: string; tipo: string; tamanho: string; data: string }>;
}

const avatar = (seed: string) =>
  `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=d1e7dd,e6dfc8,cfe3ea`;

const escolas = [
  "Colégio São Bento",
  "Escola Monteiro Lobato",
  "Instituto Aurora",
  "Colégio Dom Pedro II",
  "Escola Vila Verde",
];
const bairros = ["Centro", "Jardim América", "Vila Nova", "Alto da Serra", "Parque das Águas", "Boa Vista"];
const motoristas = ["Carlos Menezes", "Ana Beatriz Rocha", "Roberto Salles", "Fernanda Lima", "Jorge Antunes"];
const veiculos = ["Van Sprinter · KLM-3F21", "Micro-ônibus · JQR-7B08", "Van Ducato · PAX-2C55", "Ônibus · TRV-9H43"];
const rotas = ["Rota Norte 01", "Rota Sul 02", "Rota Leste 03", "Rota Oeste 04", "Rota Central 05"];
const nomes = [
  "Alice Ferreira", "Bernardo Souza", "Cecília Martins", "Davi Nogueira", "Elisa Cardoso",
  "Felipe Andrade", "Gabriela Pires", "Heitor Ramos", "Isabela Moura", "João Vitor Teixeira",
  "Kauã Barbosa", "Laura Nunes", "Miguel Correia", "Nina Vasconcelos", "Otávio Duarte",
  "Pietra Amaral", "Rafael Lopes", "Sofia Bittencourt", "Théo Machado", "Valentina Prado",
  "Arthur Camargo", "Beatriz Sampaio", "Caio Rezende", "Duda Fontes", "Enzo Peixoto",
  "Fernanda Antunes", "Gustavo Ribeiro", "Helena Braga", "Ícaro Tavares", "Júlia Monteiro",
  "Lorenzo Bastos", "Manuela Freitas", "Nicolas Aguiar", "Olívia Castro", "Pedro Henrique Dias",
];
const responsaveis = [
  "Marcos Ferreira", "Patrícia Souza", "Renata Martins", "Eduardo Nogueira", "Cláudia Cardoso",
  "Sérgio Andrade", "Tatiane Pires", "Vinícius Ramos", "Adriana Moura", "Luciano Teixeira",
];

const parentescos = ["Pai", "Mãe", "Avó", "Tio"];
const formas = ["PIX", "Boleto", "Cartão de Crédito", "Dinheiro"];
const turnos = ["Manhã", "Tarde", "Integral"];
const series = ["1º ano", "3º ano", "5º ano", "7º ano", "9º ano", "1ª série EM"];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length] as T;
}

const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export const alunos: Aluno[] = nomes.map((nome, i) => {
  const status: StatusAluno = i % 11 === 0 ? "inativo" : i % 17 === 0 ? "suspenso" : "ativo";
  const pagamento: StatusPagamento = i % 7 === 0 ? "atrasado" : i % 3 === 0 ? "pendente" : "pago";
  const mensalidade = 320 + (i % 6) * 45;
  const bairro = pick(bairros, i);
  const responsavel = pick(responsaveis, i);

  return {
    id: String(1000 + i),
    nome,
    foto: avatar(nome),
    nascimento: `${String((i % 27) + 1).padStart(2, "0")}/${String((i % 12) + 1).padStart(2, "0")}/201${i % 9}`,
    escola: pick(escolas, i),
    serie: pick(series, i),
    turno: pick(turnos, i),
    bairro,
    endereco: `Rua das Acácias, ${120 + i * 7} — ${bairro}`,
    cidade: "São Paulo / SP",
    responsavel,
    parentesco: pick(parentescos, i),
    telefone: `(11) 9${String(8000 + i).slice(0, 4)}-${String(1000 + i * 3).slice(0, 4)}`,
    email: `${responsavel.split(" ")[0]!.toLowerCase()}.${i}@email.com`,
    motorista: pick(motoristas, i),
    veiculo: pick(veiculos, i),
    rota: pick(rotas, i),
    mensalidade,
    status,
    pagamento,
    desde: `0${(i % 9) + 1}/02/202${(i % 4) + 1}`,
    contrato: {
      numero: `CT-2026-${String(300 + i)}`,
      inicio: "01/02/2026",
      fim: "20/12/2026",
      vencimentoDia: 5 + (i % 3) * 5,
      formaPagamento: pick(formas, i),
      observacoes: "Contrato anual com reajuste previsto para o próximo período letivo.",
    },
    mensalidades: meses.slice(0, 8).map((m, k) => ({
      competencia: `${m}/2026`,
      vencimento: `0${5 + (i % 3) * 2}/${String(k + 1).padStart(2, "0")}/2026`,
      valor: mensalidade,
      status: (k > 5 ? pagamento : "pago") as StatusPagamento,
      pagoEm: k > 5 && pagamento !== "pago" ? null : `0${(k % 6) + 2}/${String(k + 1).padStart(2, "0")}/2026`,
      forma: pick(formas, i + k),
    })),
    ocorrencias: [
      { data: "12/06/2026", tipo: "Atraso no embarque", descricao: "Aluno não estava no ponto no horário combinado.", gravidade: "baixa" },
      { data: "28/05/2026", tipo: "Ausência", descricao: "Responsável avisou com antecedência sobre consulta médica.", gravidade: "baixa" },
      { data: "03/04/2026", tipo: "Comportamento", descricao: "Conversa com o responsável sobre uso do cinto de segurança.", gravidade: "media" },
    ],
    historico: [
      { data: "01/02/2026", evento: "Contrato assinado e matrícula ativada" },
      { data: "15/03/2026", evento: "Alteração de rota para " + pick(rotas, i) },
      { data: "02/05/2026", evento: "Atualização de endereço residencial" },
      { data: "18/06/2026", evento: "Mensalidade de junho liquidada via PIX" },
    ],
    documentos: [
      { nome: "Contrato assinado.pdf", tipo: "PDF", tamanho: "412 KB", data: "01/02/2026" },
      { nome: "RG do responsável.jpg", tipo: "Imagem", tamanho: "1,2 MB", data: "01/02/2026" },
      { nome: "Comprovante de endereço.pdf", tipo: "PDF", tamanho: "268 KB", data: "05/02/2026" },
      { nome: "Declaração escolar.pdf", tipo: "PDF", tamanho: "190 KB", data: "10/02/2026" },
    ],
  };
});

export const escolasList = escolas;
export const bairrosList = bairros;
export const motoristasList = motoristas;

// ————— Dashboard —————

export const kpis = [
  { label: "Total de alunos", value: "412", delta: "+3,2%", trend: "up" as const, icon: "users", hint: "vs. mês anterior" },
  { label: "Alunos ativos", value: "381", delta: "+1,8%", trend: "up" as const, icon: "userCheck", hint: "92% da base" },
  { label: "Alunos inativos", value: "31", delta: "-0,6%", trend: "down" as const, icon: "userMinus", hint: "8% da base" },
  { label: "Motoristas", value: "18", delta: "0", trend: "flat" as const, icon: "steering", hint: "16 em serviço" },
  { label: "Veículos", value: "21", delta: "+1", trend: "up" as const, icon: "bus", hint: "3 em manutenção" },
  { label: "Contratos ativos", value: "374", delta: "+2,4%", trend: "up" as const, icon: "file", hint: "12 vencendo" },
  { label: "Mensalidades pagas", value: "342", delta: "+5,1%", trend: "up" as const, icon: "check", hint: "junho/2026" },
  { label: "Mensalidades atrasadas", value: "29", delta: "-4,3%", trend: "down" as const, icon: "alert", hint: "R$ 11.240 em aberto" },
  { label: "Valor recebido", value: "R$ 148.320", delta: "+6,7%", trend: "up" as const, icon: "wallet", hint: "junho/2026" },
  { label: "Valor previsto", value: "R$ 162.500", delta: "+2,1%", trend: "up" as const, icon: "target", hint: "competência atual" },
  { label: "Lucro", value: "R$ 52.910", delta: "+8,9%", trend: "up" as const, icon: "trendingUp", hint: "margem 35,7%" },
  { label: "Despesas", value: "R$ 95.410", delta: "+1,4%", trend: "up" as const, icon: "receipt", hint: "combustível 38%" },
  { label: "Saldo em caixa", value: "R$ 217.880", delta: "+4,5%", trend: "up" as const, icon: "bank", hint: "consolidado" },
  { label: "Inadimplência", value: "7,1%", delta: "-1,2 p.p.", trend: "down" as const, icon: "percent", hint: "meta: 5%" },
  { label: "Novos alunos", value: "24", delta: "+9", trend: "up" as const, icon: "sparkles", hint: "últimos 30 dias" },
];

export const receitaMensal = meses.map((mes, i) => ({
  mes,
  receita: 118000 + i * 4200 + (i % 3) * 5600,
  despesa: 82000 + i * 1900 + (i % 4) * 3800,
}));

export const fluxoCaixa = meses.map((mes, i) => ({
  mes,
  entrada: 120000 + i * 3800,
  saida: 84000 + i * 2100,
  saldo: 36000 + i * 1700,
}));

export const gastosCategoria = [
  { categoria: "Combustível", valor: 36200 },
  { categoria: "Salários", valor: 41800 },
  { categoria: "Manutenção", valor: 9400 },
  { categoria: "Seguros", valor: 4300 },
  { categoria: "Administrativo", valor: 3710 },
];

export const alunosPorEscola = escolas.map((escola, i) => ({
  escola: escola.replace(/^(Colégio|Escola|Instituto) /, ""),
  alunos: 96 - i * 13,
}));

export const alunosPorBairro = bairros.map((bairro, i) => ({ bairro, alunos: 84 - i * 11 }));

export const pagamentosPorForma = [
  { forma: "PIX", valor: 78200 },
  { forma: "Boleto", valor: 41300 },
  { forma: "Cartão", valor: 21600 },
  { forma: "Dinheiro", valor: 7220 },
];

export const consumoCombustivel = meses.map((mes, i) => ({
  mes,
  litros: 3100 + i * 85 + (i % 3) * 120,
  custo: 19800 + i * 520,
}));

export const custosManutencao = meses.slice(0, 8).map((mes, i) => ({
  mes,
  preventiva: 2400 + (i % 4) * 620,
  corretiva: 1500 + (i % 5) * 890,
}));

export const veiculosMaisUtilizados = [
  { veiculo: "KLM-3F21", km: 4820 },
  { veiculo: "JQR-7B08", km: 4310 },
  { veiculo: "PAX-2C55", km: 3980 },
  { veiculo: "TRV-9H43", km: 3540 },
  { veiculo: "MNO-1D77", km: 2960 },
];

export const agendaDoDia = [
  { hora: "06:20", titulo: "Rota Norte 01 · Ida", detalhe: "Carlos Menezes · Van Sprinter", tipo: "ida" },
  { hora: "07:05", titulo: "Rota Sul 02 · Ida", detalhe: "Ana Beatriz Rocha · Micro-ônibus", tipo: "ida" },
  { hora: "11:40", titulo: "Rota Central 05 · Volta", detalhe: "Jorge Antunes · Van Ducato", tipo: "volta" },
  { hora: "13:10", titulo: "Rota Leste 03 · Ida", detalhe: "Roberto Salles · Ônibus", tipo: "ida" },
  { hora: "17:35", titulo: "Rota Oeste 04 · Volta", detalhe: "Fernanda Lima · Van Sprinter", tipo: "volta" },
];

export const proximosVencimentos = alunos.slice(0, 5).map((a, i) => ({
  aluno: a.nome,
  foto: a.foto,
  valor: a.mensalidade,
  vencimento: `0${i + 3}/07/2026`,
}));

export const ultimosPagamentos = alunos.slice(6, 11).map((a, i) => ({
  aluno: a.nome,
  foto: a.foto,
  valor: a.mensalidade,
  forma: pick(formas, i),
  data: `${25 - i}/06/2026`,
}));

export const ultimosAlunos = alunos.slice(12, 17).map((a) => ({
  nome: a.nome,
  foto: a.foto,
  escola: a.escola,
  desde: a.desde,
}));

export const motoristasEmServico = motoristas.slice(0, 4).map((nome, i) => ({
  nome,
  foto: avatar(nome),
  rota: pick(rotas, i),
  status: i === 3 ? "Intervalo" : "Em rota",
}));

export const veiculosIndisponiveis = [
  { veiculo: "Van Ducato · PAX-2C55", motivo: "Revisão de 40.000 km", previsao: "04/07/2026" },
  { veiculo: "Ônibus · TRV-9H43", motivo: "Troca de embreagem", previsao: "08/07/2026" },
  { veiculo: "Van Sprinter · MNO-1D77", motivo: "Laudo de vistoria", previsao: "11/07/2026" },
];

export const contratosVencendo = alunos.slice(20, 24).map((a, i) => ({
  aluno: a.nome,
  numero: a.contrato.numero,
  fim: `${10 + i * 4}/07/2026`,
}));

export const aniversariantes = alunos.slice(3, 7).map((a, i) => ({
  nome: a.nome,
  foto: a.foto,
  dia: `${String(4 + i * 5).padStart(2, "0")}/07`,
}));

export const alertas = [
  { titulo: "CNH vencendo", detalhe: "Roberto Salles — vence em 12 dias", nivel: "warning" as const },
  { titulo: "IPVA em aberto", detalhe: "Veículo JQR-7B08 — 2ª parcela", nivel: "destructive" as const },
  { titulo: "Inadimplência acima da meta", detalhe: "7,1% contra meta de 5%", nivel: "warning" as const },
  { titulo: "Backup concluído", detalhe: "Última cópia hoje às 03:00", nivel: "success" as const },
];

export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const brlExato = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
