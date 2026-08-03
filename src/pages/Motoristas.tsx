import { IdCard } from "lucide-react";
import { ModulePage } from "@/components/layout/module-page";

export default function Motoristas() {
  return (
    <ModulePage
      titulo="Motoristas"
      descricao="Equipe, jornada, documentos e remuneração"
      icon={IdCard}
      destaques={[
        { label: "Motoristas", valor: "18" },
        { label: "Em serviço", valor: "16" },
        { label: "Férias", valor: "1" },
        { label: "CNH a vencer", valor: "2" },
      ]}
    />
  );
}
