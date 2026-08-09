import { redirect } from "next/navigation"
import { getDashboardNavItems } from "@/app/lib/dashboard-nav"
import { getUser } from "@/service/getUser"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import DashboardSidebar from "./_components/DashboardSidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user.success) {
    redirect("/login")
  }

  const navItems = getDashboardNavItems(user.data.role)

  return (
    <SidebarProvider>
      <DashboardSidebar navItems={navItems} />
      <SidebarInset>
        {/* <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:h-16 md:px-6">
          <SidebarTrigger className="-ml-1" aria-label="Toggle dashboard navigation" />
          <Separator orientation="vertical" className="h-5" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Dashboard</p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Keep your rental journey organized.
            </p>
          </div>
        </header> */}
        <main className="flex min-h-[calc(100svh-4rem)] flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
