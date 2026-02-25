"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useState } from "react"
import { LogOut, Eye, Menu } from "lucide-react"
import { signOut } from "@/lib/auth"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { AdminSidebar } from "./admin-sidebar"

interface AdminHeaderProps {
  userProfile: {
    role: string
    full_name: string | null
    email: string
  }
}

export function AdminHeader({ userProfile }: AdminHeaderProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
  }

  const initials = userProfile.full_name
    ? userProfile.full_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
    : userProfile.email[0].toUpperCase()

  return (
    <header className="h-16 shrink-0 border-b border-border bg-card flex items-center justify-between px-3 md:px-6">
      <div className="flex items-center gap-1 md:gap-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle mobile menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 flex flex-col w-64 border-r">
            <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
            <SheetDescription className="sr-only">Navigational menu</SheetDescription>
            <AdminSidebar userProfile={userProfile} className="border-none shadow-none" onNavClick={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <h2 className="text-base md:text-lg font-semibold truncate max-w-[150px] sm:max-w-none">Panel Admin</h2>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="outline" size="sm" asChild className="hidden sm:flex">
          <Link href="/">
            <Eye className="h-4 w-4 mr-2" />
            Ver Sitio
          </Link>
        </Button>
        <Button variant="outline" size="icon" asChild className="sm:hidden">
          <Link href="/">
            <Eye className="h-4 w-4" />
          </Link>
        </Button>

        <ModeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{userProfile.full_name || "Usuario"}</p>
                <p className="text-xs text-muted-foreground">{userProfile.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
