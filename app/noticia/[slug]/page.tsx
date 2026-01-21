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
import { Bookmark, Clock, User, ChevronRight, Home, Image as ImageIcon } from "lucide-react"
import { fetchApi } from "@/lib/api-client"
import { notFound } from "next/navigation"
import { StickyArticleHeader } from "@/components/sticky-article-header"
import { AdBanner } from "@/components/ad-banner"
import { NewsletterForm } from "@/components/newsletter-form"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const response = await fetchApi(`/news/${slug}`);
    const article = response.data;

    return generateArticleMetadata({
      title: article.title,
      description: article.excerpt,
      image: article.mainImageUrl || "/placeholder.svg",
      url: `/noticia/${slug}`,
      publishedTime: article.publishedAt,
      author: article.author?.name || "Redacción NDI",
      category: article.category?.name || "Actualidad",
    })
  } catch (error) {
    return { title: "Noticia no encontrada" }
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let article: any;
  let relatedArticles: any[] = [];
  let trending: any[] = [];

  try {
    const response = await fetchApi(`/news/${slug}`);
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
      trending = trendingRes.data;
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
    title: article.title,
    description: article.excerpt,
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contenido principal */}
          <article className="lg:col-span-8">
            {/* Header del artículo */}
            <div className="mb-8">
              {article.category && (
                <Badge variant="default" className="mb-4 bg-primary text-primary-foreground">
                  {article.category.name}
                </Badge>
              )}
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance leading-tight">
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
                  <Button variant="outline" size="icon">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Imagen principal */}
            {(article.mainImageUrl) && (
              <div className="mb-10">
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-border">
                  <Image
                    src={article.mainImageUrl}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* Contenido del artículo Premium Typography */}
            <div
              className="prose prose-lg md:prose-xl max-w-none dark:prose-invert prose-slate prose-headings:font-serif prose-headings:font-bold prose-p:leading-[1.8] prose-p:text-pretty prose-img:rounded-lg prose-article:mx-auto"
              style={{
                fontSize: '1.2rem',
                lineHeight: '1.9',
              }}
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

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
                    <div key={i} className="group relative overflow-hidden rounded-xl border border-border bg-muted aspect-video shadow-sm hover:shadow-xl transition-all duration-500">
                      <Image
                        src={img.url}
                        alt={`Galería ${i + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
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
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-10">
              {/* Lo más leído */}
              <div>
                <h3 className="font-serif text-2xl font-bold mb-6 pb-3 border-b border-border">Lo más leído</h3>
                <div>
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

              {/* Banner publicitario Dinámico */}
              <AdBanner position="SIDEBAR" className="h-80 shadow-md" />

              {/* Newsletter Premium */}
              <div className="bg-primary/5 p-8 border-2 border-primary/10 rounded-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                  <Bookmark className="h-12 w-12 text-primary" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-4 relative z-10 text-primary">Newsletter</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Únete a más de 5.000 lectores y recibe lo mejor del interior en tu email.
                </p>
                <NewsletterForm />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
