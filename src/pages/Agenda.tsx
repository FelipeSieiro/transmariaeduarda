import { CalendarDays } from "lucide-react";
import { ModulePage } from "@/components/layout/module-page";

export default function Agenda() {
  return (
    <ModulePage
      titulo="Agenda"
      descricao="Rotas, horários, idas e voltas por dia, semana e mês"
      icon={CalendarDays}
      destaques={[
        { label: "Eventos hoje", valor: "24" },
        { label: "Rotas ativas", valor: "5" },
        { label: "Motoristas", valor: "16" },
        { label: "Ocorrências", valor: "2" },
      ]}
    />
  );
}
