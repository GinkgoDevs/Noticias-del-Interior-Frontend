"use client"

import { usePathname } from "next/navigation"
import { Footer } from "@/components/footer"

export function ConditionalFooter() {
  const pathname = usePathname()
  
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/login") || pathname?.startsWith("/register")) {
    return null
  }
  
  return <Footer />
}
