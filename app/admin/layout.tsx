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
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar userProfile={profile} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader userProfile={profile} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
