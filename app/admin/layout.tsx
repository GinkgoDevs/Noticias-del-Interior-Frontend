import type React from "react"
import { redirect } from "next/navigation"
import { getUserProfile } from "@/lib/auth"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getUserProfile()

  if (!profile) {
    redirect("/login")
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AdminSidebar userProfile={profile} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader userProfile={profile} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background/50">{children}</main>
      </div>
    </div>
  )
}
