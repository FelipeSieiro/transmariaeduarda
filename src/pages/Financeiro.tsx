import { Wallet } from "lucide-react";
import { ModulePage } from "@/components/layout/module-page";

export default function Financeiro() {
  return (
    <ModulePage
      titulo="Financeiro"
      descricao="Receitas, despesas, mensalidades e fluxo de caixa"
      icon={Wallet}
      destaques={[
        { label: "Receita do mês", valor: "R$ 148.320" },
        { label: "Despesas", valor: "R$ 95.410" },
        { label: "Lucro", valor: "R$ 52.910" },
        { label: "Inadimplência", valor: "7,1%" },
      ]}
    />
  );
}
