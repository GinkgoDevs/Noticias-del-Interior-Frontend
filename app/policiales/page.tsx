import { Header } from "@/components/header"
import { ArticleCard } from "@/components/article-card"
import { ListArticle } from "@/components/list-article"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { fetchApi } from "@/lib/api-client"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function PolicialesPage() {
  const categorySlug = "policiales"

  let category;
  let news = [];

  try {
    const catResponse = await fetchApi(`/categories/slug/${categorySlug}`);
    if (catResponse.success) {
      category = catResponse.data;
    }

    if (!category) return notFound();

    const newsResponse = await fetchApi(`/news?categorySlug=${categorySlug}&limit=20`);
    if (newsResponse.success && newsResponse.data?.data) {
      news = newsResponse.data.data;
    }
  } catch (error) {
    console.error("Error fetching category news:", error);
    return notFound();
  }

  const featuredNews = news.slice(0, 3);
  const moreNews = news.slice(3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).toUpperCase();
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-6 lg:px-8 py-12">
          <div className="mb-8">
            <Badge className="mb-4 text-base px-4 py-2 bg-primary text-primary-foreground">
              {category.name}
            </Badge>
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-4">
              Información de {category.name.toLowerCase()}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {category.description || `Cobertura completa de seguridad y ${category.name.toLowerCase()} del interior`}
            </p>
          </div>

          <div className="mt-12">
            {featuredNews.length > 0 ? (
              <>
                <div className="grid lg:grid-cols-3 gap-8 mb-16">
                  {featuredNews.map((article: any) => (
                    <ArticleCard
                      key={article.id}
                      category={article.category?.name || category.name}
                      title={article.title}
                      excerpt={article.excerpt}
                      image={article.mainImageUrl || "/placeholder.svg"}
                      date={formatDate(article.publishedAt)}
                      author={article.author?.name || "Redacción NDI"}
                      slug={article.slug}
                    />
                  ))}
                </div>

                {moreNews.length > 0 && (
                  <div className="border-t border-border pt-12">
                    <h2 className="font-serif text-3xl font-bold mb-8">Más noticias de {category.name.toLowerCase()}</h2>
                    <div className="space-y-6">
                      {moreNews.map((article: any) => (
                        <ListArticle
                          key={article.id}
                          category={article.category?.name || category.name}
                          title={article.title}
                          date={formatDate(article.publishedAt)}
                          slug={article.slug}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {news.length >= 20 && (
                  <div className="flex justify-center mt-12">
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full px-8 bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      Cargar más noticias
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground mb-4">
                  No hay noticias disponibles en esta categoría actualmente.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
