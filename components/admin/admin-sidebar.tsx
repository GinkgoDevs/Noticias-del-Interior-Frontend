"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { LayoutDashboard, FileText, FolderOpen, Users, Newspaper, Megaphone, Star, Tag } from "lucide-react"

interface AdminSidebarProps {
  userProfile: {
    role: string
    full_name: string | null
    email: string
  }
  className?: string
  onNavClick?: () => void
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
    title: "Etiquetas",
    href: "/admin/tags",
    icon: Tag,
    roles: ["admin", "redactor"],
  },
  {
    title: "Usuarios",
    href: "/admin/users",
    icon: Users,
    roles: ["admin"],
  },
  {
    title: "Publicidad",
    href: "/admin/ads",
    icon: Megaphone,
    roles: ["admin"],
  },
]

export function AdminSidebar({ userProfile, className, onNavClick }: AdminSidebarProps) {
  const pathname = usePathname()

  const filteredNavItems = navItems.filter((item) => item.roles.includes(userProfile.role))

  return (
    <aside className={cn("w-64 bg-card border-r border-border flex flex-col h-full", className)}>
      <div className="p-6 border-b border-border">
        <Link href="/admin" className="flex items-center justify-center py-2">
          <Image
            src="/logo-claro.png"
            alt="Noticias del Interior"
            width={160}
            height={50}
            className="object-contain dark:hidden"
          />
          <Image
            src="/logo-oscuro.png"
            alt="Noticias del Interior"
            width={160}
            height={50}
            className="object-contain hidden dark:block"
          />
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
              onClick={onNavClick}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="px-4 py-2 text-xs text-muted-foreground">
          <p className="font-medium text-foreground mb-1">{userProfile.full_name || "Usuario"}</p>
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
