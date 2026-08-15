"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsUpDown, Home, LogOut, UserRound } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { logout } from "@/service/logout";
import type { Role, User } from "@/app/lib/types";

const roleLabel: Record<Role, string> = {
  TENANT: "Tenant",
  LANDLORD: "Landlord",
  ADMIN: "Admin",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface DashboardAppBarProps {
  user: User;
  navItems: { label: string; href: string }[];
}

export function DashboardAppBar({ user, navItems }: DashboardAppBarProps) {
  const pathname = usePathname();

  const active = navItems.find(
    (item) =>
      pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
    toast.success("Logged out");
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border/70 bg-paper/85 px-4 backdrop-blur supports-[backdrop-filter]:bg-paper/70 md:h-16 md:px-6 lg:px-8">
      <SidebarTrigger className="-ml-1.5 text-foreground" />

      {/* The doorplate: role eyebrow + current section */}
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
          <span className="size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
          {roleLabel[user.role]}
        </p>
        <h1 className="truncate text-sm font-semibold tracking-tight md:text-base">
          {active?.label ?? "Dashboard"}
        </h1>
      </div>

      <div className="ml-auto flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "flex items-center gap-2 rounded-full p-0.5 outline-none transition-shadow",
                "focus-visible:ring-2 focus-visible:ring-ring",
              )}
              aria-label="Open user menu"
            >
              <Avatar className="size-8">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <ChevronsUpDown className="hidden size-3.5 text-muted-foreground sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user.name}</span>
                <span className="text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/" className="flex items-center gap-2">
                  <Home className="size-4" />
                  Back to site
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={user.role === "TENANT" ? "/tenant-dashboard/profile" : user.role === "LANDLORD" ? "/landlord-dashboard/profile" : "/admin-dashboard"}
                  className="flex items-center gap-2"
                >
                  <UserRound className="size-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-500 focus:text-red-500"
              onSelect={handleLogout}
            >
              <LogOut className="size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
