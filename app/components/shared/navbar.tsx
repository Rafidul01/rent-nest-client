"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Home,
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

const routes = [
  { label: "Home", href: "/", icon: Home },
  { label: "Properties", href: "/properties", icon: Building2 },
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
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="size-5"
      aria-hidden="true"
    >
      <path
        d="M12 3.5 21 10h-2v10H5V10H3l9-6.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.8 20v-5.5h4.4V20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Logo() {
  return (
    <Link href="/" className="group flex shrink-0 items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5">
        <LogoMark />
      </span>
      <span className="text-lg font-semibold tracking-tight">
        rent<span className="text-primary">nest</span>
      </span>
    </Link>
  );
}

function LiveLamp({ liveCount }: { liveCount: number }) {
  if (liveCount <= 0) return null;

  return (
    <span className="hidden items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary sm:inline-flex">
      <span className="relative flex size-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
        <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
      </span>
      {liveCount} live now
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
    <header className="sticky top-0 z-50 w-full">
      <nav className="mx-auto mt-3 flex h-14 max-w-6xl items-center justify-between gap-3 rounded-2xl border bg-background/75 px-4 shadow-sm backdrop-blur-xl sm:px-5">
        <div className="flex items-center gap-3">
          <Logo />
          <LiveLamp liveCount={liveCount} />
        </div>

        {/* Desktop Nav */}
        <ul className="hidden items-center gap-1 md:flex">
          {routes.map((route) => {
            const active =
              route.href === "/"
                ? pathname === "/"
                : pathname.startsWith(route.href);
            return (
              <li key={route.href}>
                <Link
                  href={route.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent/70 hover:text-foreground",
                  )}
                >
                  {route.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />

          {user.success ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="rounded-full transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:scale-105"
                  aria-label="Open user menu"
                >
                  <Avatar className="size-9">
                    <AvatarFallback>{getInitials(user.data.name)}</AvatarFallback>
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
            <Button asChild size="sm" className="rounded-xl">
              <Link href="/login">Login</Link>
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
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
                {routes.map((route) => (
                  <SheetClose asChild key={route.href}>
                    <Link
                      href={route.href}
                      className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent"
                    >
                      <route.icon className="h-4 w-4" />
                      {route.label}
                    </Link>
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}