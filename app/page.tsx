import { Suspense } from "react"
import { Header } from "@/components/header"
import { GamesSection } from "@/components/games-section"
import { AdBanner } from "@/components/ad-banner"
import { Button } from "@/components/ui/button"

import Link from "next/link"
import { HeroSection } from "@/components/home/hero-section"
import { LatestArticles } from "@/components/home/latest-articles"
import { TrendingNews } from "@/components/home/trending-news"
import { CategorySection } from "@/components/home/category-section"
import { CorresponsaliasWidget } from "@/components/home/corresponsalias-widget"
import { HeroCarouselSkeleton, ArticleCardSkeleton, ListArticleSkeleton, CategorySkeleton } from "@/components/loading-skeleton"
import Image from "next/image"
import { ChevronRight } from "lucide-react"

export const revalidate = 300 // Revalidate every 5 minutes

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header />

      <main>
        {/* Hero Section - Grid Layout */}
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-8">
          <Suspense fallback={<HeroCarouselSkeleton />}>
            <HeroSection />
          </Suspense>
        </div>

        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {/* Últimas Noticias */}
          <div className="flex items-center justify-between mb-8 border-l-4 border-primary pl-4">
            <h2 className="text-2xl font-bold uppercase tracking-tight font-display text-foreground">Últimas Noticias</h2>
            <Link
              href="/noticias"
              className="text-primary font-bold text-sm flex items-center hover:translate-x-1 transition-transform"
            >
              VER TODO <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
              <ArticleCardSkeleton />
              <ArticleCardSkeleton />
              <ArticleCardSkeleton />
              <ArticleCardSkeleton />
            </div>
          }>
            <LatestArticles />
          </Suspense>

          {/* Category Sections + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16 pt-16 border-t border-primary/10">
            {/* Main Content - Category Sections */}
            <div className="lg:col-span-8 space-y-16">
              {/* Política */}
              <Suspense fallback={<CategorySkeleton />}>
                <CategorySection
                  title="Política"
                  categorySlug="politica"
                  href="/politica"
                />
              </Suspense>

              {/* Economía */}
              <Suspense fallback={<CategorySkeleton />}>
                <CategorySection
                  title="Economía"
                  categorySlug="economia"
                  href="/economia"
                />
              </Suspense>

              {/* Ad between categories */}
              <div className="py-4">
                <AdBanner position="CONTENT" className="h-[120px] md:h-[200px] w-full rounded-lg" />
              </div>

              {/* Sociedad */}
              <Suspense fallback={<CategorySkeleton />}>
                <CategorySection
                  title="Sociedad"
                  categorySlug="sociedad"
                  href="/noticias"
                />
              </Suspense>

              {/* Policiales */}
              <Suspense fallback={<CategorySkeleton />}>
                <CategorySection
                  title="Policiales"
                  categorySlug="policiales"
                  href="/policiales"
                />
              </Suspense>

              {/* Deportes */}
              <Suspense fallback={<CategorySkeleton />}>
                <CategorySection
                  title="Deportes"
                  categorySlug="deportes"
                  href="/deportes"
                />
              </Suspense>

              {/* Cultura / Espectáculos */}
              <Suspense fallback={<CategorySkeleton />}>
                <CategorySection
                  title="Espectáculos"
                  categorySlug="espectaculo"
                  href="/espectaculo"
                />
              </Suspense>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-12 h-full">
              {/* Lo más leído */}
              <div className="bg-surface-dark rounded-xl p-6 border border-primary/10 shadow-xl shadow-black/5 dark:shadow-black/20">
                <h3 className="text-xl font-bold mb-6 flex items-center border-b border-primary/20 pb-4 font-display text-foreground">
                  <span className="bg-primary w-2 h-6 mr-3 rounded-sm" />
                  Lo más leído
                </h3>
                <Suspense fallback={
                  <div className="space-y-6">
                    <ListArticleSkeleton />
                    <ListArticleSkeleton />
                    <ListArticleSkeleton />
                  </div>
                }>
                  <TrendingNews />
                </Suspense>
              </div>

              {/* Banner publicitario después de Lo más leído */}
              <div className="bg-surface-dark rounded-xl p-4 border border-primary/10 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Publicidad</span>
                  <Link href="/anunciar" className="text-[10px] text-primary/60 hover:text-primary transition-colors font-bold">ANUNCIÁ AQUÍ</Link>
                </div>
                <AdBanner position="SIDEBAR" className="h-[250px] md:h-[300px] w-full rounded-lg overflow-hidden border border-foreground/5" />
              </div>

              {/* Seguinos en Redes */}
              <div className="bg-surface-dark rounded-xl p-6 border border-primary/10 overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors" />
                <h3 className="text-xl font-bold mb-4 font-display text-foreground">Seguinos</h3>
                <p className="text-muted-foreground text-sm mb-6">Información actualizada al instante en nuestras redes sociales oficiales.</p>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="https://www.facebook.com/share/1CUvzUj37P/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-background/50 dark:bg-white/5 rounded-lg hover:bg-primary/20 transition-all border border-foreground/5 group/link">
                    <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center text-muted-foreground group-hover/link:text-primary">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                    </div>
                    <span className="text-xs font-bold text-foreground">Facebook</span>
                  </Link>
                  <Link href="https://tiktok.com/@julianrosznercki" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-background/50 dark:bg-white/5 rounded-lg hover:bg-primary/20 transition-all border border-foreground/5 group/link">
                    <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center text-muted-foreground group-hover/link:text-primary">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.22-1.15 4.41-2.9 5.81-1.74 1.41-4.08 2.1-6.32 1.83-2.31-.29-4.52-1.57-5.75-3.52-1.22-1.93-1.49-4.38-.68-6.49.81-2.09 2.5-3.8 4.62-4.53 2.15-.74 4.54-.58 6.54.46v4.11c-1.2-.68-2.61-.91-3.95-.61-1.34.31-2.51 1.25-3.09 2.47-.57 1.23-.55 2.7.07 3.91.61 1.22 1.86 2.12 3.2 2.42 1.34.29 2.78-.17 3.75-1.07.95-.91 1.4-2.22 1.38-3.54.02-3.1-.01-6.19-.01-9.29-.02-3.09.02-6.18.01-9.27z" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-foreground">TikTok</span>
                  </Link>
                  <Link href="https://www.instagram.com/noticiasdelinterior/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-background/50 dark:bg-white/5 rounded-lg hover:bg-primary/20 transition-all border border-foreground/5 group/link">
                    <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center text-muted-foreground group-hover/link:text-primary">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                    </div>
                    <span className="text-xs font-bold text-foreground">Instagram</span>
                  </Link>
                  <Link href="#" className="flex items-center gap-3 p-3 bg-background/50 dark:bg-white/5 rounded-lg hover:bg-primary/20 transition-all border border-foreground/5 group/link">
                    <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center text-muted-foreground group-hover/link:text-primary">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z" /></svg>
                    </div>
                    <span className="text-xs font-bold text-foreground">YouTube</span>
                  </Link>
                </div>
              </div>

              {/* Sticky Ad Banner */}
              <div className="sticky top-28 hidden md:block">
                <div className="bg-surface-dark rounded-xl p-4 border border-primary/10 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Publicidad</span>
                    <Link href="/anunciar" className="text-[10px] text-primary/60 hover:text-primary transition-colors font-bold">ANUNCIÁ AQUÍ</Link>
                  </div>
                  <AdBanner position="SIDEBAR" className="h-[500px] lg:h-[600px] w-full rounded-lg overflow-hidden border border-foreground/5" />
                </div>
              </div>
            </aside>
          </div>

          {/* Games Section */}
          <div className="mt-16">
            <GamesSection />
          </div>
        </div>

      </main>
    </div>
  )
}
