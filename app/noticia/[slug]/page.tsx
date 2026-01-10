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
import { Bookmark, Clock, User } from "lucide-react"
import { fetchApi } from "@/lib/api-client"
import { notFound } from "next/navigation"

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

      <Header />

      <main className="container mx-auto px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">
            Inicio
          </Link>
          <span>/</span>
          {article.category && (
            <>
              <Link href={`/${article.category.slug}`} className="hover:text-foreground transition-colors">
                {article.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-foreground">Artículo</span>
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

            {/* Contenido del artículo */}
            <div
              className="prose prose-lg max-w-none prose-slate"
              dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }}
            />

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

              {/* Banner publicitario */}
              <div className="bg-muted/50 border border-border p-8 text-center rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">PUBLICIDAD</p>
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground">300x300</span>
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-accent/50 p-8 border border-border rounded-lg">
                <h3 className="font-serif text-2xl font-bold mb-4">Newsletter</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Recibe las noticias más importantes del interior argentino directamente en tu correo electrónico.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button className="w-full rounded-full">Suscribirme</Button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
