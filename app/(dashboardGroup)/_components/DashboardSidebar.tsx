"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  CreditCard,
  FileText,
  Home,
  LayoutDashboard,
  LucideIcon,
  User,
  Users,
  X,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { IconName } from "@/app/lib/dashboard-nav";

const iconMap: Record<IconName, LucideIcon> = {
  dashboard: LayoutDashboard,
  requests: FileText,
  payments: CreditCard,
  profile: User,
  properties: Building2,
  users: Users,
};

interface NavItem {
  label: string;
  href: string;
  icon: IconName;
}

export default function DashboardSidebar({
  navItems,
}: {
  navItems: NavItem[];
}) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="flex h-14 flex-row items-center justify-between gap-2 px-4 group-data-[collapsible=icon]:px-2 md:h-16">
        <Link
          href="/"
          className="flex items-center gap-2.5 overflow-hidden"
          aria-label="RentNest home"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
            <Home className="size-4" aria-hidden="true" />
          </span>
          <span className="truncate text-[15px] font-semibold tracking-tight text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            RentNest
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setOpenMobile(false)}
          aria-label="Close menu"
          className="flex size-8 items-center justify-center rounded-md text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent/20 hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring md:hidden"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </SidebarHeader>

      <SidebarContent className="px-3 py-3">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => {
                const Icon = iconMap[item.icon];
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className={cn(
                        "h-10 rounded-xl px-3 text-sidebar-foreground/85",
                        "transition-[background-color,color] duration-150",
                        "hover:bg-sidebar-accent/15 hover:text-sidebar-foreground",
                        isActive &&
                          "bg-sidebar-accent font-semibold text-sidebar-accent-foreground shadow-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      )}
                    >
                      <Link href={item.href}>
                        <Icon aria-hidden="true" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <p className="hidden px-2 text-[11px] text-sidebar-foreground/35 group-data-[collapsible=icon]:hidden md:block">
          Press <kbd className="rounded border border-sidebar-border bg-sidebar-accent/20 px-1 font-sans">⌘</kbd>
          <kbd className="rounded border border-sidebar-border bg-sidebar-accent/20 px-1 font-sans">B</kbd> to collapse
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
