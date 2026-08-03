import { Boxes } from "lucide-react";
import { ModulePage } from "@/components/layout/module-page";

export default function Patrimonio() {
  return (
    <ModulePage
      titulo="Patrimônio"
      descricao="Bens, responsáveis, valores e movimentações"
      icon={Boxes}
      destaques={[
        { label: "Itens", valor: "164" },
        { label: "Valor total", valor: "R$ 1,92 mi" },
        { label: "Em uso", valor: "149" },
        { label: "Baixados", valor: "7" },
      ]}
    />
  );
}
