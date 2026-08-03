"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Home,
  Building2,
  Heart,
  Phone,
  Menu,
  LayoutDashboard,
  User,
  Settings,
  LogOut,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

const routes = [
  { label: "Home", href: "/", icon: Home },
  { label: "Properties", href: "/properties", icon: Building2 },
  { label: "Favorites", href: "/favorites", icon: Heart },
  { label: "Contact", href: "/contact", icon: Phone },
]



const profileMenu = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
]

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Home className="size-5" />
      </span>

      <span className="text-lg font-semibold tracking-tight">
        Rent<span className="text-primary">Nest</span>
      </span>
    </Link>
  )
}

export function Navbar({user} : {user: UserData}) {
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
    toast.success("Logout successful");
  };

  

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />

        {/* Desktop Nav */}
        <ul className="hidden items-center gap-2 md:flex">
          {routes.map((route) => (
            <li key={route.href}>
              <Link
                href={route.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium",
                  "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {route.label}
              </Link>
            </li>
          ))}
        </ul>

        {
          user.success ? <div className="flex items-center gap-2">
          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="rounded-full focus:outline-none"
                aria-label="Open user menu"
              >
                <Avatar className="size-9">
                  <AvatarImage src={user.data.role} />
                  <AvatarFallback>AC</AvatarFallback>
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
                    <Link
                      href={item.href}
                      className="flex items-center gap-2"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-red-500"
                onSelect={handleLogout}
                onClick={() => console.log("Logout")}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
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
        </div> : <Button ><Link href="/login">Login</Link></Button>
        }
      </nav>
    </header>
  )
}