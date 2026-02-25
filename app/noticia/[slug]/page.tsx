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
      next: { tags: [`news-${slug}`], revalidate: 3600 }
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

  const jsonLd = generateArticleJSONLD({
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    image: article.mainImageUrl || "/placeholder.svg",
    url: `/noticia/${slug}`,
    publishedTime: article.publishedAt,
    author: article.author?.name || "Redacción NDI",
    category: article.category?.name || "Actualidad",
  })

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <StickyArticleHeader title={article.title} category={article.category?.name || "Actualidad"} />
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
          <article className="lg:col-span-8 w-full min-w-0 overflow-hidden" lang="es">
            {/* Header del artículo */}
            <div className="mb-8">
              {article.category && (
                <Badge variant="default" className="mb-4 bg-primary text-primary-foreground">
                  {article.category.name}
                </Badge>
              )}
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-pretty leading-tight">
                {article.title}
              </h1>
              {article.excerpt && (
                <p className="text-xl text-muted-foreground leading-relaxed mb-8 text-pretty">{article.excerpt}</p>
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
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-border">
                  <Image
                    src={article.mainImageUrl}
                    alt={article.mainImageCaption || article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                {article.mainImageCaption && (
                  <figcaption className="text-sm text-muted-foreground italic mt-3 text-center px-4">
                    {article.mainImageCaption}
                  </figcaption>
                )}
              </figure>
            )}

            {/* Contenido del artículo Premium Typography */}
            <div
              className="prose prose-lg md:prose-xl max-w-none dark:prose-invert prose-slate prose-headings:font-serif prose-headings:font-bold prose-p:leading-relaxed prose-p:text-pretty prose-img:rounded-lg"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Ad in content */}
            <div className="my-10 w-full">
              <AdBanner position="CONTENT" className="h-[120px] md:h-[200px] w-full rounded-lg" />
            </div>

            {/* Galería de Imágenes Premium */}
            {article.images && article.images.length > 0 && (
              <div className="mt-16 pt-12 border-t border-border/50">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-8 w-1 bg-primary rounded-full" />
                  <h3 className="font-serif text-3xl font-bold flex items-center gap-2">
                    <ImageIcon className="h-6 w-6 text-primary" /> Galería de Imágenes
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {article.images.map((img: any, i: number) => (
                    <figure key={i}>
                      <div className="group relative overflow-hidden rounded-xl border border-border bg-muted aspect-video shadow-sm hover:shadow-xl transition-all duration-500">
                        <Image
                          src={img.url}
                          alt={img.caption || `Galería ${i + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                      {img.caption && (
                        <figcaption className="text-sm text-muted-foreground italic mt-3 text-center px-2">
                          {img.caption}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
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
