import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  FileSignature,
  Wallet,
  CalendarDays,
  Route as RouteIcon,
  IdCard,
  Bus,
  Boxes,
  Fuel,
  Wrench,
  ReceiptText,
  BarChart3,
  Settings,
  ShieldCheck,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";


type MenuItem = {
  title: string;
  url: string;
  icon: React.ElementType;
  exact?: boolean;
  disabled?: boolean;
};


const grupos: {
  label: string;
  items: MenuItem[];
}[] = [
  {
    label: "Operação",
    items: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard, exact: true, disabled: true },
      { title: "Alunos", url: "/alunos", icon: GraduationCap },
      { title: "Responsáveis", url: "/responsaveis", icon: Users },
      { title: "Contratos", url: "/contratos", icon: FileSignature, disabled: true},
      {
        title: "Agenda",
        url: "/agenda",
        icon: CalendarDays,
        disabled: true,
      },
      { title: "Rotas", url: "/rotas", icon: RouteIcon, disabled: true },
    ],
  },
  {
    label: "Frota & Equipe",
    items: [
      { title: "Motoristas", url: "/motoristas", icon: IdCard, disabled: true },
      {
        title: "Veículos",
        url: "/veiculos",
        icon: Bus,
        disabled: true,
      },
      {
        title: "Patrimônio",
        url: "/patrimonio",
        icon: Boxes,
        disabled: true,
      },
      {
        title: "Abastecimentos",
        url: "/abastecimentos",
        icon: Fuel,
        disabled: true,
      },
      {
        title: "Manutenções",
        url: "/manutencoes",
        icon: Wrench,
        disabled: true,
      },
    ],
  },
  {
    label: "Gestão",
    items: [
      {
        title: "Financeiro",
        url: "/financeiro",
        icon: Wallet,
        disabled: true,
      },
      {
        title: "Despesas",
        url: "/despesas",
        icon: ReceiptText,
        disabled: true,
      },
      {
        title: "Relatórios",
        url: "/relatorios",
        icon: BarChart3,
        disabled: true,
      },
      { title: "Configurações", url: "/configuracoes", icon: Settings },
    ],
  },
];


export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (url: string, exact?: boolean) =>
    exact ? pathname === url : pathname === url || pathname.startsWith(url + "/");
    return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
        <div className="flex items-center gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <Bus className="size-5" />
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-semibold text-sidebar-foreground">
                RotaEscolar
              </p>

              <p className="truncate text-[11px] text-sidebar-foreground/60">
                Gestão de Transporte
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>


      <SidebarContent className="px-1">
        {grupos.map((grupo) => (
          <SidebarGroup key={grupo.label}>
            <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-sidebar-foreground/45">
              {grupo.label}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {grupo.items.map((item) => (
                  <SidebarMenuItem key={item.title}>

                    <SidebarMenuButton
                      asChild={!item.disabled}
                      tooltip={
                        item.disabled
                          ? `${item.title} (Em breve)`
                          : item.title
                      }
                      isActive={
                        !item.disabled &&
                        isActive(item.url, item.exact)
                      }
                      disabled={item.disabled}
                      className={
                        item.disabled
                          ? "cursor-not-allowed opacity-40"
                          : ""
                      }
                    >

                      {item.disabled ? (
                        <div className="flex items-center gap-3">
                          <item.icon className="size-4 shrink-0" />

                          <span className="truncate">
                            {item.title}
                          </span>
                        </div>
                      ) : (
                        <Link to={item.url} className="flex items-center gap-3">
                          <item.icon className="size-4 shrink-0" />

                          <span className="truncate">
                            {item.title}
                          </span>
                        </Link>
                      )}

                    </SidebarMenuButton>

                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>


      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3">
          <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
            <ShieldCheck className="size-4" />
          </div>

          {!collapsed && (
            <div className="min-w-0 text-[11px] leading-tight text-sidebar-foreground/65">
              <p className="truncate font-medium text-sidebar-foreground">
                Plano Corporativo
              </p>

              <p className="truncate">
                Licença até 12/2026
              </p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}