import { Settings } from "lucide-react";
import { ModulePage } from "@/components/layout/module-page";

export default function Configuracoes() {
  return (
    <ModulePage
      titulo="Configurações"
      descricao="Perfil, empresa, usuários, permissões, tema e integrações"
      icon={Settings}
      destaques={[
        { label: "Usuários", valor: "12" },
        { label: "Perfis de acesso", valor: "4" },
        { label: "Integrações", valor: "3" },
        { label: "Último backup", valor: "hoje 03:00" },
      ]}
    />
  );
}
