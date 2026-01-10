"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FileText, FolderOpen, Users, Newspaper } from "lucide-react"

interface AdminSidebarProps {
  userProfile: {
    role: string
    full_name: string | null
    email: string
  }
}

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    roles: ["admin", "redactor", "viewer"],
  },
  {
    title: "Noticias",
    href: "/admin/news",
    icon: FileText,
    roles: ["admin", "redactor", "viewer"],
  },
  {
    title: "Categorías",
    href: "/admin/categories",
    icon: FolderOpen,
    roles: ["admin"],
  },
  {
    title: "Usuarios",
    href: "/admin/users",
    icon: Users,
    roles: ["admin"],
  },
]

export function AdminSidebar({ userProfile }: AdminSidebarProps) {
  const pathname = usePathname()

  const filteredNavItems = navItems.filter((item) => item.roles.includes(userProfile.role))

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
            <Newspaper className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Admin Panel</h1>
            <p className="text-xs text-muted-foreground">Gestión de noticias</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {filteredNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <div className="px-4 py-2 text-xs text-muted-foreground">
          <p className="font-medium text-slate-700 mb-1">{userProfile.full_name || "Usuario"}</p>
          <p className="truncate">{userProfile.email}</p>
          <p className="mt-1 capitalize">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              {userProfile.role}
            </span>
          </p>
        </div>
      </div>
    </aside>
  )
}
