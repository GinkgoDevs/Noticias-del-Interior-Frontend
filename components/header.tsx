"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, Search } from "lucide-react"
import { InfoBar } from "./info-bar"
import { BreakingNewsBanner } from "./breaking-news-banner"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

const navLinks = [
  { href: "/deportes", label: "Deportes" },
  { href: "/policiales", label: "Policiales" },
  { href: "/politica", label: "Política" },
  { href: "/espectaculo", label: "Espectáculo" },
  { href: "/economia", label: "Economía" },
  { href: "/juegos", label: "Juegos" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/buscar?q=${encodeURIComponent(searchQuery)}`
      setSearchOpen(false)
      setSearchQuery("")
    }
  }

  return (
    <div className="relative w-full">
      <InfoBar />
      <BreakingNewsBanner />
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-500 border-b border-border/50 
          ${isScrolled
            ? "bg-background/85 backdrop-blur-md shadow-lg py-1.5"
            : "bg-background py-2"
          }`}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className={`flex items-center justify-between gap-4 transition-all duration-500 ${isScrolled ? "h-12" : "h-14 md:h-16"}`}>
            <div className="flex items-center gap-4 md:gap-8">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Abrir menú</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
                  <div className="flex flex-col gap-6 mt-8">
                    <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3">
                      <Image
                        src="/logo.png"
                        alt="Noticias del Interior"
                        width={50}
                        height={50}
                        className="object-contain"
                      />
                      <span className="font-serif text-xl md:text-2xl font-bold tracking-tight text-foreground">
                        Noticias del Interior
                      </span>
                    </Link>
                    <nav className="flex flex-col gap-4">
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-lg font-medium tracking-wide uppercase text-muted-foreground transition-colors hover:text-primary py-2 border-b border-border/50"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </nav>
                    <Button className="w-full rounded-full px-6 mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                      Suscribirse
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <Link href="/" className="flex items-center gap-2 md:gap-3 group">
                <div className={`relative transition-all duration-500 ${isScrolled ? "scale-75" : "scale-90 md:scale-100"}`}>
                  <Image
                    src="/logo.png"
                    alt="Noticias del Interior"
                    width={55}
                    height={55}
                    className="object-contain hidden md:block"
                  />
                  <Image
                    src="/logo.png"
                    alt="Noticias del Interior"
                    width={40}
                    height={40}
                    className="object-contain md:hidden"
                  />
                </div>
                <span className={`font-serif font-bold tracking-tight text-foreground hidden sm:block transition-all duration-500 ${isScrolled ? "text-base md:text-lg" : "text-lg md:text-xl"}`}>
                  Noticias del Interior
                </span>
              </Link>
            </div>

            <nav className="hidden md:flex items-center gap-5 lg:gap-7">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[13px] font-bold tracking-[0.12em] uppercase text-muted-foreground transition-all hover:text-primary relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 md:gap-3">
              <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-9 w-9 hover:bg-accent hover:text-primary transition-colors"
                  onClick={() => setSearchOpen(true)}
                >
                  <Search className="h-4.5 w-4.5" />
                  <span className="sr-only">Buscar noticias</span>
                </Button>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Buscar noticias</DialogTitle>
                    <DialogDescription>Ingresa palabras clave para encontrar noticias relacionadas</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSearch} className="mt-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Buscar..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1"
                        autoFocus
                      />
                      <Button
                        type="submit"
                        disabled={!searchQuery.trim()}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Buscar
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              <Button className="hidden md:inline-flex rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90">
                Suscribirse
              </Button>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}
