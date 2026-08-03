import { ReceiptText } from "lucide-react";
import { ModulePage } from "@/components/layout/module-page";

export default function Despesas() {
  return (
    <ModulePage
      titulo="Despesas"
      descricao="Lançamentos por categoria, centro de custo e fornecedor"
      icon={ReceiptText}
      destaques={[
        { label: "Total do mês", valor: "R$ 95.410" },
        { label: "Fixas", valor: "R$ 58.900" },
        { label: "Variáveis", valor: "R$ 36.510" },
        { label: "A pagar", valor: "14" },
      ]}
    />
  );
}
