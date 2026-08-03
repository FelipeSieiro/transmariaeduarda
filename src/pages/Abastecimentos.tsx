import { Fuel } from "lucide-react";
import { ModulePage } from "@/components/layout/module-page";

export default function Abastecimentos() {
  return (
    <ModulePage
      titulo="Abastecimentos"
      descricao="Litragem, custo por posto e consumo médio da frota"
      icon={Fuel}
      destaques={[
        { label: "Litros no mês", valor: "3.940" },
        { label: "Custo", valor: "R$ 24.180" },
        { label: "Consumo médio", valor: "8,6 km/l" },
        { label: "Abastecimentos", valor: "112" },
      ]}
    />
  );
}
