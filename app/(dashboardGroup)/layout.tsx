import { redirect } from "next/navigation"
import Link from "next/link"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { getDashboardNavItems } from "@/app/lib/dashboard-nav"
import { getUser } from "@/service/getUser"
import { Button } from "@/components/ui/button"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import DashboardSidebar from "./_components/DashboardSidebar"
import { DashboardAppBar } from "./_components/DashboardAppBar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user.success) {
    // Transient backend outage — show a calm retry screen instead of
    // bouncing a logged-in user to the login page.
    if (user.statusCode === 503) {
      return (
        <main className="flex min-h-svh items-center justify-center bg-paper px-4">
          <div className="flex max-w-md flex-col items-center gap-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <AlertTriangle className="size-7" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                Temporarily unavailable
              </p>
              <h1 className="text-2xl font-semibold tracking-tight">
                We couldn&apos;t reach the server
              </h1>
              <p className="text-sm text-muted-foreground">
                The service had a hiccup. Give it a moment and try again.
              </p>
            </div>
            <Button asChild>
              <Link href="/">
                <RefreshCw className="mr-2 size-4" />
                Back to home
              </Link>
            </Button>
          </div>
        </main>
      )
    }

    redirect("/login")
  }

  const navItems = getDashboardNavItems(user.data.role)

  return (
    <SidebarProvider>
      <DashboardSidebar navItems={navItems} />
      <SidebarInset className="bg-paper">
        <DashboardAppBar user={user.data} navItems={navItems} />
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 md:px-6 md:py-8 lg:px-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
