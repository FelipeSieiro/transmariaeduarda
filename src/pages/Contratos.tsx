import { FileSignature } from "lucide-react";
import { ModulePage } from "@/components/layout/module-page";

export default function Contratos() {
  return (
    <ModulePage
      titulo="Contratos"
      descricao="Vigências, renovações e condições comerciais"
      icon={FileSignature}
      destaques={[
        { label: "Ativos", valor: "374" },
        { label: "Vencendo em 30d", valor: "12" },
        { label: "Renovados", valor: "58" },
        { label: "Encerrados", valor: "23" },
      ]}
    />
  );
}
