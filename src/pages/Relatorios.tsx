import { BarChart3 } from "lucide-react";
import { ModulePage } from "@/components/layout/module-page";

export default function Relatorios() {
  return (
    <ModulePage
      titulo="Relatórios"
      descricao="Relatórios gerenciais com exportação em PDF, Excel e CSV"
      icon={BarChart3}
      destaques={[
        { label: "Modelos", valor: "22" },
        { label: "Agendados", valor: "6" },
        { label: "Gerados no mês", valor: "148" },
        { label: "Favoritos", valor: "5" },
      ]}
    />
  );
}
