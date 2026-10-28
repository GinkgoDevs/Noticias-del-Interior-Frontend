import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArticleCard } from "@/components/article-card"
import { ListArticle } from "@/components/list-article"
import { SocialShare } from "@/components/social-share"
import { FacebookComments } from "@/components/facebook-comments"
import { generateArticleMetadata, generateArticleJSONLD } from "@/components/article-metadata"
import { Clock, User, ChevronRight, Home, Image as ImageIcon } from "lucide-react"
import { fetchApi } from "@/lib/api-client"
import { notFound } from "next/navigation"
import { StickyArticleHeader } from "@/components/sticky-article-header"
import { AdBanner } from "@/components/ad-banner"
import { parseImageCaption } from "@/lib/utils-images"
import { cn } from "@/lib/utils"
import { GalleryCarousel } from "@/components/gallery-carousel"


export async function generateStaticParams() {
  try {
    const response = await fetchApi("/news?limit=20");
    if (response.success && response.data?.data) {
      return response.data.data.map((post: any) => ({
        slug: post.slug,
      }));
    }
  } catch (error) {
    console.error("Error generating static params:", error);
  }
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://noticiasdelinterior.site").replace(/\/$/, "")

  try {
    const response = await fetchApi(`/news/${slug}`, {
      // @ts-ignore
      next: { tags: [`news-${slug}`], revalidate: 3600 }
    });
    const article = response.data;

    if (!article) {
      return {
        title: "Noticia no encontrada",
        description: "Lo sentimos, no pudimos encontrar la noticia que estás buscando.",
        openGraph: {
          title: "Noticia no encontrada | Noticias del Interior",
          description: "Explora las últimas noticias del interior argentino.",
          images: [`${siteUrl}/logo-claro.png`],
        }
      };
    }

    return generateArticleMetadata({
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt,
      image: article.mainImageUrl || "/placeholder.svg",
      url: `/noticia/${slug}`,
      publishedTime: article.publishedAt,
      author: article.author?.name || "Redacción NDI",
      category: article.category?.name || "Actualidad",
    })
  } catch (error) {
    return {
      title: "Noticia no encontrada",
      description: "Lo sentimos, no pudimos encontrar la noticia que estás buscando.",
      openGraph: {
        title: "Noticia no encontrada | Noticias del Interior",
        description: "Explora las últimas noticias del interior argentino.",
        images: [`${siteUrl}/logo-claro.png`],
      }
    }
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let article: any;
  let relatedArticles: any[] = [];
  let trending: any[] = [];

  try {
    const response = await fetchApi(`/news/${slug}`, {
      // @ts-ignore
      next: { tags: [`news-${slug}`], revalidate: 0 }
    });
    article = response.data;

    if (!article) notFound();

    // Get related articles (same category)
    if (article.category?.slug) {
      const relatedRes = await fetchApi(`/news?categorySlug=${article.category.slug}&limit=4`);

      if (relatedRes.success && relatedRes.data?.data) {
        relatedArticles = relatedRes.data.data.filter((a: any) => a.id !== article.id).slice(0, 3);
      }
    }

    // Get trending news
    const trendingRes = await fetchApi("/news/trending");
    if (trendingRes.success && trendingRes.data) {
      // Filter out the current article by ID or slug and limit to 5
      trending = trendingRes.data
        .filter((a: any) => a.id !== article.id && a.slug !== slug)
        .slice(0, 5);
    }

  } catch (error) {
    console.error("Error fetching article:", error);
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /**
   * Limpia el texto de espacios no divisibles que impiden el salto de línea.
   */
  const cleanText = (text: string): string => {
    if (!text) return ""
    return text
      .replace(/&nbsp;/g, ' ')
      .replace(/\u00A0/g, ' ')
      .replace(/\u200B/g, ''); // Quitar zero-width spaces por las dudas
  }

  /**
   * Normaliza el contenido del artículo para asegurar que siempre se muestre
   * con párrafos correctos, independientemente de cómo fue ingresado.
   * - Si ya tiene etiquetas HTML (ej: <p>, <br>, <h2>), lo devuelve tal cual.
   * - Si es texto plano con saltos de línea, convierte cada bloque en un <p>.
   */
  const normalizeContent = (content: string): string => {
    if (!content) return ""

    // REPARACIÓN CRÍTICA: Los textos pegados desde PDF a veces traen "espacios no divisibles" (&nbsp; o \u00A0).
    // Esto engaña al navegador haciéndole creer que todo el párrafo es UNA SOLA palabra gigante.
    // Reemplazamos estos espacios invisibles problemáticos por espacios estándar.
    let cleanContent = cleanText(content);

    // Si el contenido ya tiene etiquetas HTML de bloque, renderizarlo directamente
    const hasBlockHtml = /<(p|br|h[1-6]|ul|ol|li|blockquote|div|table|video|iframe|img)\b/i.test(cleanContent)
    if (hasBlockHtml) return cleanContent

    // Si es texto plano, convertir saltos de línea en párrafos <p>
    return cleanContent
      .split(/\n\n+/) // Separar por doble salto de línea (párrafos)
      .map((block) =>
        block
          .split(/\n/) // Saltos de línea simples → <br> dentro del párrafo
          .join("<br>")
      )
      .filter((block) => block.trim().length > 0)
      .map((block) => `<p>${block}</p>`)
      .join("")
  }

  const jsonLd = generateArticleJSONLD({
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    image: article.mainImageUrl || "/placeholder.svg",
    url: `/noticia/${slug}`,
    publishedTime: article.publishedAt,
    author: article.author?.name || "Redacción NDI",
    category: article.category?.name || "Actualidad",
  })

  const mainImageMeta = parseImageCaption(article.mainImageCaption);

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <StickyArticleHeader title={cleanText(article.title)} category={article.category?.name || "Actualidad"} />
      <Header />

      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumbs Premium */}
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-8 md:mb-12 bg-muted/30 w-fit px-4 py-2 rounded-full border border-border/50">
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1.5">
            <Home className="h-3 w-3" />
            Inicio
          </Link>
          <ChevronRight className="h-3 w-3 text-border" />
          {article.category && (
            <>
              <Link href={`/${article.category.slug}`} className="hover:text-primary transition-colors">
                {article.category.name}
              </Link>
              <ChevronRight className="h-3 w-3 text-border" />
            </>
          )}
          <span className="text-primary truncate max-w-[150px] md:max-w-xs">Noticia</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
          {/* Contenido principal */}
          <article className="lg:col-span-8 w-full min-w-0 overflow-x-hidden" lang="es">
            {/* Header del artículo */}
            <div className="mb-10 max-w-4xl">
              {article.category && (
                <div className="flex items-center gap-2 mb-6">
                   <div className="w-1.5 h-6 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                   <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                    {article.category.name}
                   </span>
                </div>
              )}
              <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-8 text-pretty leading-[1.15] text-foreground">
                {cleanText(article.title)}
              </h1>
              {article.excerpt && (
                <p className="text-xl md:text-2xl text-muted-foreground/90 leading-relaxed mb-8 text-pretty font-light tracking-tight border-l-2 border-primary/20 pl-6 italic">
                  {cleanText(article.excerpt)}
                </p>
              )}

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{article.author?.name || "Redacción NDI"}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <time dateTime={article.publishedAt}>
                        {formatDate(article.publishedAt)} • {formatTime(article.publishedAt)}
                      </time>
                      <span>•</span>
                      <span>5 min de lectura</span>
                    </div>
                  </div>
                </div>

                <div className="ml-auto flex items-center gap-2">
                  <SocialShare
                    url={`/noticia/${slug}`}
                    title={article.title}
                    description={article.excerpt}
                  />
                </div>
              </div>
            </div>

            {/* Imagen principal */}
            {(article.mainImageUrl) && (
              <figure className="mb-10">
                <div 
                  className={cn(
                    "relative overflow-hidden rounded-lg border border-border bg-muted flex items-center justify-center w-full",
                    mainImageMeta.fitMode === 'contain' ? "aspect-auto max-h-[500px] md:max-h-[650px]" : ""
                  )}
                  style={{ 
                    aspectRatio: mainImageMeta.fitMode === 'contain' ? 'auto' : (mainImageMeta.aspectRatio || '16/9') 
                  }}
                >
                  <Image
                    src={article.mainImageUrl}
                    alt={mainImageMeta.cleanCaption || article.title}
                    fill={mainImageMeta.fitMode !== 'contain'}
                    width={mainImageMeta.fitMode === 'contain' ? 1200 : undefined}
                    height={mainImageMeta.fitMode === 'contain' ? 800 : undefined}
                    className={cn(
                      "transition-all duration-500",
                      mainImageMeta.fitMode === 'contain' ? "w-auto h-auto max-h-[500px] md:max-h-[650px] object-contain" : "object-cover"
                    )}
                    style={{ 
                      objectPosition: mainImageMeta.fitMode === 'contain' ? 'center' : mainImageMeta.position 
                    }}
                    priority
                  />
                </div>
                {mainImageMeta.cleanCaption && (
                  <figcaption className="text-sm text-muted-foreground italic mt-3 text-center px-4">
                    {mainImageMeta.cleanCaption}
                  </figcaption>
                )}
              </figure>
            )}

            {/* Contenido del artículo Premium Typography - Limited width for ergonomics */}
            <div className="max-w-[40rem] mx-auto lg:mx-0">
              <div
                className="prose max-w-none dark:prose-invert prose-headings:font-bold prose-img:rounded-3xl prose-img:max-h-[500px] md:prose-img:max-h-[650px] prose-img:w-auto prose-img:mx-auto prose-img:shadow-2xl prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:p-6 prose-blockquote:rounded-r-xl article-content"
                dangerouslySetInnerHTML={{ __html: normalizeContent(article.content) }}
              />
            </div>

            {/* Ad in content */}
            <div className="my-10 w-full">
              <AdBanner position="CONTENT" className="h-[120px] md:h-[200px] w-full rounded-lg" />
            </div>

            {/* Galería de Imágenes Premium */}
            {article.images && article?.images?.length > 0 && (
              <div className="mt-16 pt-12 border-t border-border/50">
                <div className="flex items-center gap-3 mb-10">
                  <div className="h-8 w-1 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                  <h3 className="font-serif text-3xl md:text-4xl font-bold flex items-center gap-3 tracking-tight">
                    <ImageIcon className="h-7 w-7 text-primary" /> Galería
                  </h3>
                </div>
                
                <GalleryCarousel images={article.images} />
              </div>
            )}

            {/* Compartir en redes */}
            <Separator className="my-12" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Compartir este artículo</h3>
                <p className="text-sm text-muted-foreground">Ayúdanos a difundir esta información</p>
              </div>
              <SocialShare
                url={`/noticia/${slug}`}
                title={article.title}
                description={article.excerpt}
                variant="icons"
              />
            </div>

            <Separator className="my-12" />

            {/* Sección de comentarios de Facebook */}
            <section className="mb-12">
              <h2 className="font-serif text-3xl font-bold mb-6">Comentarios</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Deja tu opinión y debate con otros lectores sobre esta noticia
              </p>
              <FacebookComments url={`/noticia/${slug}`} numPosts={10} />
            </section>

            <Separator className="my-12" />

            {/* Noticias relacionadas */}
            {relatedArticles.length > 0 && (
              <section>
                <h2 className="font-serif text-3xl font-bold mb-8">Noticias relacionadas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {relatedArticles.map((rel: any, index: number) => (
                    <ArticleCard
                      key={rel.id || index}
                      category={rel.category?.name || "Actualidad"}
                      title={rel.title}
                      excerpt={rel.excerpt}
                      image={rel.mainImageUrl || "/placeholder.svg"}
                      date={new Date(rel.publishedAt).toLocaleDateString("es-ES")}
                      author={rel.author?.name || "Redacción NDI"}
                      slug={rel.slug}
                    />
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 w-full min-w-0 space-y-10 h-full">
            {/* Lo más leído */}
            <div>
              <h3 className="font-serif text-2xl font-bold mb-6 pb-3 border-b border-border">Lo más leído</h3>
              <div className="space-y-6">
                {trending.map((item: any, index: number) => (
                  <ListArticle
                    key={item.id || index}
                    category={item.category?.name || "Actualidad"}
                    title={item.title}
                    date={new Date(item.publishedAt).toLocaleDateString("es-ES")}
                    number={index + 1}
                    slug={item.slug}
                  />
                ))}
              </div>
            </div>

            {/* Banner publicitario Dinámico - sticky */}
            <div className="sticky top-28 hidden md:block">
              <div className="bg-surface-dark rounded-xl p-4 border border-primary/10 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Publicidad</span>
                  <Link href="/anunciar" className="text-[10px] text-primary/60 hover:text-primary transition-colors font-bold">ANUNCIÁ AQUÍ</Link>
                </div>
                <AdBanner position="ARTICLE_SIDEBAR" className="h-[250px] lg:h-[300px] w-full rounded-lg overflow-hidden border border-foreground/5" />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
