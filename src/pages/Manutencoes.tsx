import { Wrench } from "lucide-react";
import { ModulePage } from "@/components/layout/module-page";

export default function Manutencoes() {
  return (
    <ModulePage
      titulo="Manutenções"
      descricao="Preventivas, corretivas, fornecedores e custos"
      icon={Wrench}
      destaques={[
        { label: "Ordens abertas", valor: "6" },
        { label: "Concluídas", valor: "41" },
        { label: "Custo no mês", valor: "R$ 9.400" },
        { label: "Preventivas", valor: "68%" },
      ]}
    />
  );
}
