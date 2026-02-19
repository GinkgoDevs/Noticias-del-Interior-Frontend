"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, Search, Loader2, ArrowRight } from "lucide-react"
import { InfoBar } from "./info-bar"
import { BreakingNewsBanner } from "./breaking-news-banner"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "./mode-toggle"
import { ReadingProgress } from "./reading-progress"
import { ScrollToTop } from "./scroll-to-top"
import { Skeleton } from "@/components/ui/skeleton"

const navLinks = [
  { href: "/noticias", label: "Todas" },
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
  const [isMounted, setIsMounted] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 3) {
      setSearchResults([])
      return
    }

    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/v1'}/news?search=${encodeURIComponent(searchQuery)}&limit=5`)
        const json = await response.json()
        // Handle both wrapped and direct data
        const data = json.data?.data || (json.success ? json.data?.data : [])
        setSearchResults(data || [])
      } catch (error) {
        console.error("Live search error:", error)
      } finally {
        setIsSearching(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [searchQuery])

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
      <ReadingProgress />
      <ScrollToTop />
      <InfoBar />
      <BreakingNewsBanner />
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300 border-b border-primary/20 shadow-xl bg-background",
          isScrolled ? "py-0" : "py-0"
        )}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              {isMounted ? (
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden text-primary">
                      <Menu className="h-8 w-8" />
                      <span className="sr-only">Abrir menú</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                    <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
                    <div className="flex flex-col gap-6 mt-8">
                      <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3">
                        <Image
                          src="/logo-oscuro.png"
                          alt="Noticias del Interior"
                          width={180}
                          height={50}
                          className="h-10 w-auto dark:hidden"
                        />
                        <Image
                          src="/logo-claro.png"
                          alt="Noticias del Interior"
                          width={180}
                          height={50}
                          className="h-10 w-auto hidden dark:block"
                        />
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

                    </div>
                  </SheetContent>
                </Sheet>
              ) : (
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              )}

              <Link href="/" className="flex-shrink-0 flex items-center">
                <Image
                  src="/logo-claro.png"
                  alt="Noticias del Interior"
                  width={280}
                  height={70}
                  className="w-[160px] md:w-[220px] h-auto dark:hidden"
                  priority
                />
                <Image
                  src="/logo-oscuro.png"
                  alt="Noticias del Interior"
                  width={280}
                  height={70}
                  className="w-[160px] md:w-[220px] h-auto hidden dark:block"
                  priority
                />
              </Link>
            </div>

            <nav className="hidden lg:flex items-center space-x-8 text-sm font-semibold uppercase tracking-wider">
              {navLinks.slice(0, 6).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-primary transition-colors pb-1 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 md:gap-3">
              {isMounted && (
                <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-9 w-9 hover:bg-accent hover:text-primary transition-colors focus-visible:ring-0"
                    onClick={() => setSearchOpen(true)}
                  >
                    <Search className="h-5 w-5 md:h-4.5 md:w-4.5" />
                    <span className="sr-only">Buscar noticias</span>
                  </Button>
                  <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                      <DialogTitle>Buscar noticias</DialogTitle>
                      <DialogDescription>Ingresa palabras clave para encontrar noticias relacionadas</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSearch} className="mt-4">
                      <div className="relative">
                        <Input
                          placeholder="Escribe al menos 3 letras para buscar..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pr-10 h-12 text-lg"
                          autoFocus
                        />
                        {isSearching && (
                          <div className="absolute right-3 top-3.5">
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          </div>
                        )}
                      </div>
                    </form>

                    {/* Quick Results */}
                    <div className="mt-6 space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-none min-h-[100px]">
                      {isSearching ? (
                        <div className="space-y-4">
                          <Skeleton className="h-3 w-24" />
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-4 p-3 anim-pulse">
                              <Skeleton className="h-16 w-24 shrink-0 rounded-lg" />
                              <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-3 w-2/3" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : searchResults.length > 0 ? (
                        <>
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary pb-2 border-b border-border/50">
                            Mejores coincidencias
                          </p>
                          {searchResults.map((article: any) => (
                            <Link
                              key={article.id}
                              href={`/noticia/${article.slug}`}
                              onClick={() => setSearchOpen(false)}
                              className="group flex gap-4 items-start p-3 rounded-xl hover:bg-primary/5 glass-panel transition-all duration-300"
                            >
                              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-muted border border-border/10">
                                <Image
                                  src={article.mainImageUrl || "/placeholder.svg"}
                                  alt={article.title}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[9px] font-black text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-none">
                                    {article.category?.name}
                                  </span>
                                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                    {new Date(article.publishedAt).toLocaleDateString("es-AR", { month: 'short', day: 'numeric' })}
                                  </span>
                                </div>
                                <h4 className="font-serif font-bold text-sm line-clamp-2 group-hover:text-primary transition-colors leading-tight tracking-tight">
                                  {article.title}
                                </h4>
                              </div>
                              <ArrowRight className="h-4 w-4 text-primary self-center opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </Link>
                          ))}
                          <div className="pt-2">
                            <Button
                              variant="ghost"
                              className="w-full text-xs text-primary font-bold group hover:bg-primary/5 rounded-xl h-10"
                              onClick={handleSearch}
                            >
                              Ver todos los resultados <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
                            </Button>
                          </div>
                        </>
                      ) : searchQuery.length >= 3 ? (
                        <div className="py-12 text-center">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4 opacity-50">
                            <Search className="h-6 w-6" />
                          </div>
                          <p className="text-sm font-medium text-muted-foreground">No encontramos noticias para "{searchQuery}"</p>
                          <p className="text-[10px] text-muted-foreground/60 mt-1">Prueba con palabras más simples</p>
                        </div>
                      ) : (
                        <div className="py-12 text-center text-muted-foreground/40">
                          <p className="text-xs italic tracking-wide">Escribe para descubrir la actualidad del interior...</p>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              {!isMounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-9 w-9"
                >
                  <Search className="h-4.5 w-4.5" />
                  <span className="sr-only">Buscar noticias</span>
                </Button>
              )}
              <ModeToggle />

            </div>
          </div>

          {/* Trending Topics - Premium sub-header bar */}
          <div className={`hidden md:flex items-center gap-4 border-t border-border/40 overflow-hidden scrollbar-none transition-all duration-500 ease-in-out ${isScrolled ? 'max-h-0 py-0 opacity-0' : 'max-h-16 py-3 opacity-100'}`}>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary whitespace-nowrap">Temas:</span>
            <div className="flex items-center gap-2">
              {["#Elecciones", "#DólarBlue", "#Clima", "#FútbolArgentino", "#Turismo", "#Cultura"].map((tag) => (
                <Link
                  key={tag}
                  href={`/buscar?q=${tag.replace('#', '')}`}
                  className="text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors px-2 py-0.5 rounded-full border border-border/60 hover:border-primary/40 whitespace-nowrap"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
        {/* Mobile Category Bar */}
        <div className="lg:hidden bg-background/95 backdrop-blur-md border-t border-primary/10 overflow-x-auto scrollbar-none sticky top-20 shadow-sm">
          <div className="flex items-center px-4 py-3 min-w-max space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </header>
    </div>
  )
}
