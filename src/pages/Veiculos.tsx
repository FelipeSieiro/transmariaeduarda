import { Bus } from "lucide-react";
import { ModulePage } from "@/components/layout/module-page";

export default function Veiculos() {
  return (
    <ModulePage
      titulo="Veículos"
      descricao="Frota, documentação, quilometragem e revisões"
      icon={Bus}
      destaques={[
        { label: "Frota", valor: "21" },
        { label: "Disponíveis", valor: "18" },
        { label: "Em manutenção", valor: "3" },
        { label: "Revisão em 30d", valor: "5" },
      ]}
    />
  );
}
