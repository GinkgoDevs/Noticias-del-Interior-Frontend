import { Header } from "@/components/header"
import { HeroNews } from "@/components/hero-news"
import { FeaturedCard } from "@/components/featured-card"
import { ArticleCard } from "@/components/article-card"
import { ListArticle } from "@/components/list-article"
import { GamesSection } from "@/components/games-section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchApi } from "@/lib/api-client"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function Home() {
  // Fetch news from NestJS API
  let news = [];
  let trending = [];
  try {
    const response = await fetchApi("/news?limit=10");
    if (response.success && response.data?.data) {
      news = response.data.data;
    }

    const trendingResponse = await fetchApi("/news/trending");
    if (trendingResponse.success && trendingResponse.data) {
      trending = trendingResponse.data;
    }
  } catch (error) {
    console.error("Error fetching news:", error);
  }

  // Distribute news
  const heroItem = news[0];
  const featuredItems = news.slice(1, 3);
  const remainingArticles = news.slice(3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <section className="mb-12 md:mb-16">
          {heroItem ? (
            <HeroNews
              category={heroItem.category?.name || "Actualidad"}
              title={heroItem.title}
              excerpt={heroItem.excerpt}
              image={heroItem.mainImageUrl || "/placeholder.svg"}
              date={formatDate(heroItem.publishedAt)}
              author={heroItem.author?.name || "Redacción NDI"}
              slug={heroItem.slug}
            />
          ) : (
            <div className="h-[500px] flex items-center justify-center bg-muted">
              <p className="text-muted-foreground">No hay noticias destacadas</p>
            </div>
          )}
        </section>

        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <section className="mb-16 md:mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {featuredItems.map((article: any, index: number) => (
                <FeaturedCard
                  key={article.id || index}
                  category={article.category?.name || "Actualidad"}
                  title={article.title}
                  excerpt={article.excerpt}
                  image={article.mainImageUrl || "/placeholder.svg"}
                  date={formatDate(article.publishedAt)}
                  author={article.author?.name || "Redacción NDI"}
                  slug={article.slug}
                  size="large"
                />
              ))}
            </div>
          </section>

          <GamesSection />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 mb-16 md:mb-20">
            {/* Contenido principal */}
            <section className="lg:col-span-8">
              <div className="mb-6 md:mb-8 flex items-center justify-between border-b-2 border-primary/20 pb-4">
                <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">Últimas Noticias</h2>
                <Button
                  variant="link"
                  asChild
                  className="text-xs md:text-sm font-medium uppercase tracking-wider text-primary hover:text-primary/80"
                >
                  <Link href="/buscar">Ver todas →</Link>
                </Button>
              </div>

              {remainingArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-8 md:gap-y-12 mb-10 md:mb-12">
                  {remainingArticles.map((article: any, index: number) => (
                    <ArticleCard
                      key={article.id || index}
                      category={article.category?.name || "Actualidad"}
                      title={article.title}
                      excerpt={article.excerpt}
                      image={article.mainImageUrl || "/placeholder.svg"}
                      date={formatDate(article.publishedAt)}
                      author={article.author?.name || "Redacción NDI"}
                      slug={article.slug}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground py-12 text-center">No hay más noticias disponibles</p>
              )}

              {remainingArticles.length >= 7 && (
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full px-8 bg-transparent text-sm md:text-base border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    Cargar más noticias
                  </Button>
                </div>
              )}
            </section>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 space-y-10 md:space-y-12">
                {/* Lo más leído */}
                <div>
                  <h3 className="font-serif text-xl md:text-2xl font-bold mb-5 md:mb-6 pb-3 border-b-2 border-primary/20">
                    Lo más leído
                  </h3>
                  <div>
                    {trending.length > 0 ? (
                      trending.map((item: any, index: number) => (
                        <ListArticle
                          key={item.id}
                          category={item.category?.name || "Actualidad"}
                          title={item.title}
                          date={formatDate(item.publishedAt)}
                          number={index + 1}
                          slug={item.slug}
                        />
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">Cargando noticias populares...</p>
                    )}
                  </div>
                </div>

                {/* Newsletter */}
                <div className="bg-accent/50 p-6 md:p-8 border border-border rounded-sm">
                  <h3 className="font-serif text-xl md:text-2xl font-bold mb-3 md:mb-4">Newsletter</h3>
                  <p className="text-sm text-muted-foreground leading-[1.6] mb-5 md:mb-6">
                    Recibe las noticias más importantes del interior argentino directamente en tu correo electrónico.
                  </p>
                  <div className="space-y-3">
                    <Input type="email" placeholder="tu@email.com" className="bg-background" />
                    <Button className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                      Suscribirme
                    </Button>
                  </div>
                </div>

                {/* Seguir */}
                <div>
                  <h3 className="font-serif text-lg md:text-xl font-bold mb-4">Síguenos</h3>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full bg-transparent hover:bg-primary hover:text-primary-foreground hover:border-primary"
                    >
                      <span className="sr-only">Facebook</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full bg-transparent hover:bg-primary hover:text-primary-foreground hover:border-primary"
                    >
                      <span className="sr-only">Twitter</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 11-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full bg-transparent hover:bg-primary hover:text-primary-foreground hover:border-primary"
                    >
                      <span className="sr-only">Instagram</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427a9.935 9.935 0 00-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <footer className="border-t border-border bg-muted/30 mt-20 md:mt-24">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-8 md:mb-12">
              <div className="md:col-span-12 lg:col-span-5">
                <h3 className="font-serif text-xl md:text-2xl font-bold mb-3 md:mb-4">Noticias del Interior</h3>
                <p className="text-sm text-muted-foreground leading-[1.6] max-w-md">
                  El portal de noticias más completo del interior argentino. Información verificada, actualizada y de
                  calidad sobre política, deportes, economía y más.
                </p>
              </div>
              <div className="md:col-span-4 lg:col-span-2">
                <h4 className="font-semibold mb-4 uppercase tracking-wider text-sm">Secciones</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>
                    <Link href="/deportes" className="hover:text-foreground transition-colors">
                      Deportes
                    </Link>
                  </li>
                  <li>
                    <Link href="/policiales" className="hover:text-foreground transition-colors">
                      Policiales
                    </Link>
                  </li>
                  <li>
                    <Link href="/politica" className="hover:text-foreground transition-colors">
                      Política
                    </Link>
                  </li>
                  <li>
                    <Link href="/espectaculo" className="hover:text-foreground transition-colors">
                      Espectáculo
                    </Link>
                  </li>
                  <li>
                    <Link href="/economia" className="hover:text-foreground transition-colors">
                      Economía
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="md:col-span-4 lg:col-span-2">
                <h4 className="font-semibold mb-4 uppercase tracking-wider text-sm">Información</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>
                    <Link href="#" className="hover:text-foreground transition-colors">
                      Sobre nosotros
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-foreground transition-colors">
                      Contacto
                    </Link>
                  </li>
                  <li>
                    <Link href="/login" className="hover:text-foreground transition-colors">
                      Panel de Administración
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="md:col-span-4 lg:col-span-3">
                <h4 className="font-semibold mb-4 uppercase tracking-wider text-sm">Contacto</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>Tucumán, Argentina</li>
                  <li>info@noticiasdelinterior.com.ar</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs md:text-sm text-muted-foreground text-center md:text-left">
                © 2025 Noticias del Interior. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
