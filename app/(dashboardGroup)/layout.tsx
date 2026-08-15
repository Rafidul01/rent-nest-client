import { redirect } from "next/navigation"
import { getDashboardNavItems } from "@/app/lib/dashboard-nav"
import { getUser } from "@/service/getUser"
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
