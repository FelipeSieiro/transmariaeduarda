import { Route as RouteIcon } from "lucide-react";
import { ModulePage } from "@/components/layout/module-page";

export default function Rotas() {
  return (
    <ModulePage
      titulo="Rotas"
      descricao="Trajetos, escolas atendidas, distância e tempo estimado"
      icon={RouteIcon}
      destaques={[
        { label: "Rotas", valor: "5" },
        { label: "KM/dia", valor: "482" },
        { label: "Tempo médio", valor: "54 min" },
        { label: "Alunos atendidos", valor: "381" },
      ]}
    />
  );
}
