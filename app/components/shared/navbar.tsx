"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { UserData } from "@/app/lib/types"
import { logout } from "@/service/logout"
import { toast } from "sonner"
import { ThemeToggle } from "./theme-toggle"
import { LettingLamp } from "@/app/(publicGroup)/_components/LettingLamp"

const routes = [
  { label: "Home", href: "/" },
  { label: "Browse", href: "/properties" },
]

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getProfileMenu(role: UserData["data"]["role"]) {
  const basePath =
    role === "ADMIN"
      ? "/admin-dashboard"
      : role === "LANDLORD"
        ? "/landlord-dashboard"
        : "/tenant-dashboard";

  return [
    { label: "Dashboard", href: basePath, icon: LayoutDashboard },
    { label: "Profile", href: `${basePath}/profile`, icon: User },
  ];
}

function LogoMark() {
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-sidebar-foreground/15 bg-sidebar-foreground/5 text-sidebar-foreground transition-colors group-hover:border-lamp/40 group-hover:text-lamp">
      <LettingLamp lit />
    </span>
  );
}

function Logo() {
  return (
    <Link href="/" className="group flex shrink-0 items-center gap-2.5">
      <LogoMark />
      <span className="font-display text-lg font-semibold tracking-tight text-sidebar-foreground">
        rent<span className="text-sidebar-accent">nest</span>
      </span>
    </Link>
  );
}

function LiveLamp({ liveCount }: { liveCount: number }) {
  if (liveCount <= 0) return null;

  return (
    <span className="hidden items-center gap-1.5 rounded-full border border-lamp/25 bg-lamp/10 px-2.5 py-1 text-xs font-medium text-lamp sm:inline-flex">
      <LettingLamp lit className="size-4" />
      {liveCount} lit now
    </span>
  );
}

export function Navbar({
  user,
  liveCount = 0,
}: {
  user: UserData;
  liveCount?: number;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
    toast.success("Logout successful");
  };

  const profileMenu = user.success ? getProfileMenu(user.data.role) : [];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sidebar-foreground/10 bg-sidebar text-sidebar-foreground shadow-[0_1px_0_0_oklch(1_0_0/0.03)_inset]">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Logo />
        </div>

        {/* Desktop Nav */}
        <ul className="hidden items-center gap-1 md:flex">
          {routes.map((route) => {
            const active =
              route.href === "/"
                ? pathname === "/"
                : pathname.startsWith(route.href);
            return (
              <li key={route.href} className="relative">
                <Link
                  href={route.href}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "text-sidebar-foreground"
                      : "text-sidebar-foreground/60 hover:text-sidebar-foreground",
                  )}
                >
                  <span className="uppercase tracking-[0.14em] text-xs">
                    {route.label}
                  </span>
                  <span
                    className={cn(
                      "h-1 w-1 rounded-full transition-colors",
                      active ? "bg-lamp" : "bg-transparent",
                    )}
                    aria-hidden="true"
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1.5">
          <LiveLamp liveCount={liveCount} />
          <ThemeToggle />

          {user.success ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="rounded-full transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar hover:scale-105"
                  aria-label="Open user menu"
                >
                  <Avatar className="size-9 border border-sidebar-foreground/15 bg-sidebar-foreground/10">
                    <AvatarFallback className="bg-transparent text-sidebar-foreground">
                      {getInitials(user.data.name)}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user.data.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {user.data.email}
                    </span>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  {profileMenu.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="text-red-500" onSelect={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              size="sm"
              className="rounded-xl border-lamp/30 bg-lamp/15 text-lamp hover:bg-lamp/25 hover:text-lamp"
            >
              <Link href="/login">Login</Link>
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-sidebar-foreground hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 flex flex-col gap-2">
                {routes.map((route) => {
                  const active =
                    route.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(route.href);
                  return (
                    <SheetClose asChild key={route.href}>
                      <Link
                        href={route.href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent",
                          active ? "font-medium text-foreground" : "text-muted-foreground",
                        )}
                      >
                        <LettingLamp lit={active} className="size-4" />
                        {route.label}
                      </Link>
                    </SheetClose>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}