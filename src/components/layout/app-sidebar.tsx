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
  Sparkles,
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

const navigationGroups: {
  label: string;
  items: MenuItem[];
}[] = [
  {
    label: "Operação",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, exact: true },
      { title: "Alunos", url: "/alunos", icon: GraduationCap },
      { title: "Responsáveis", url: "/responsaveis", icon: Users },
      { title: "Contratos", url: "/contratos", icon: FileSignature },
      { title: "Agenda", url: "/agenda", icon: CalendarDays },
      { title: "Rotas", url: "/rotas", icon: RouteIcon },
    ],
  },
  {
    label: "Frota & Equipe",
    items: [
      { title: "Motoristas", url: "/motoristas", icon: IdCard },
      { title: "Veículos", url: "/veiculos", icon: Bus },
      { title: "Patrimônio", url: "/patrimonio", icon: Boxes, disabled: true },
      { title: "Abastecimentos", url: "/abastecimentos", icon: Fuel, disabled: true },
      { title: "Manutenções", url: "/manutencoes", icon: Wrench, disabled: true },
    ],
  },
  {
    label: "Gestão",
    items: [
      { title: "Financeiro", url: "/financeiro", icon: Wallet, disabled: true },
      { title: "Despesas", url: "/despesas", icon: ReceiptText, disabled: true },
      { title: "Relatórios", url: "/relatorios", icon: BarChart3, disabled: true },
      { title: "Configurações", url: "/configuracoes", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const { state, isMobile, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { pathname } = useLocation();

  const isActive = (url: string, exact?: boolean) =>
    exact ? pathname === url : pathname === url || pathname.startsWith(`${url}/`);

  const handleNavigation = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar 
      collapsible="icon" 
      className="border-r border-sidebar-border/60 bg-sidebar/95 backdrop-blur-xl transition-all duration-300"
    >
      {/* Header */}
      <SidebarHeader className="border-b border-sidebar-border/40 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
            <Bus className="size-4" />
          </div>

          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <span className="block truncate font-semibold text-xs tracking-tight text-sidebar-foreground">
                Transporte ERP
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="block truncate text-[10px] font-medium text-sidebar-foreground/50">
                  Online
                </span>
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="px-3 py-4 space-y-6">
        {navigationGroups.map((group) => (
          <SidebarGroup key={group.label} className="p-0 space-y-1.5">
            {!isCollapsed && (
              <SidebarGroupLabel className="px-2 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40 mb-1">
                {group.label}
              </SidebarGroupLabel>
            )}

            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {group.items.map((item) => {
                  const active = !item.disabled && isActive(item.url, item.exact);
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild={!item.disabled}
                        tooltip={isCollapsed ? `${item.title}${item.disabled ? " (Em breve)" : ""}` : undefined}
                        isActive={active}
                        disabled={item.disabled}
                        className={`h-9 rounded-lg px-3 transition-all duration-200 relative overflow-hidden ${
                          item.disabled
                            ? "opacity-40 cursor-not-allowed hover:bg-transparent"
                            : active
                            ? "bg-sidebar-accent/80 text-sidebar-foreground font-semibold shadow-xs before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-1 before:rounded-r-full before:bg-primary"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground font-medium"
                        }`}
                      >
                        {item.disabled ? (
                          <div className="flex w-full items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <Icon className="size-4 shrink-0 opacity-70" />
                              <span className="truncate text-xs">{item.title}</span>
                            </div>
                            {!isCollapsed && (
                              <span className="text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground">
                                Breve
                              </span>
                            )}
                          </div>
                        ) : (
                          <Link to={item.url} onClick={handleNavigation} className="flex w-full items-center gap-2.5">
                            <Icon className={`size-4 shrink-0 transition-colors ${active ? "text-primary" : "text-sidebar-foreground/60"}`} />
                            <span className="truncate text-xs">{item.title}</span>
                          </Link>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-sidebar-border/40 p-3">
        <div className={`flex items-center gap-2.5 rounded-lg bg-sidebar-accent/30 p-2.5 border border-sidebar-border/40 ${isCollapsed ? "justify-center p-2" : ""}`}>
          <div className="grid size-7 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
            <ShieldCheck className="size-3.5" />
          </div>

          {!isCollapsed && (
            <div className="min-w-0 flex-1 leading-tight">
              <div className="flex items-center justify-between">
                <span className="truncate font-medium text-[11px] text-sidebar-foreground">
                  Plano Corporativo
                </span>
                <Sparkles className="size-3 text-amber-500 shrink-0" />
              </div>
              <span className="block truncate text-[9px] text-sidebar-foreground/50 mt-0.5">
                Expira em 12/2026
              </span>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}