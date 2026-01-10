import { Header } from "@/components/header"
import { ArticleCard } from "@/components/article-card"
import { ListArticle } from "@/components/list-article"
import { fetchApi } from "@/lib/api-client"
import { Metadata } from "next"

export const dynamic = "force-dynamic"

export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<{ q: string }>
}): Promise<Metadata> {
    const { q } = await searchParams
    return {
        title: `Resultados para "${q}" | Noticias del Interior`,
        description: `Resultados de búsqueda para ${q}`,
    }
}

export default async function BuscarPage({
    searchParams,
}: {
    searchParams: Promise<{ q: string }>
}) {
    const { q } = await searchParams
    let items = []
    let total = 0

    try {
        if (q) {
            const response = await fetchApi(`/news?search=${encodeURIComponent(q)}&limit=20`)
            if (response.success && response.data) {
                items = response.data.data || []
                total = response.data.meta?.total || 0
            }
        }
    } catch (error) {
        console.error("Error searching news:", error)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).toUpperCase()
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-background">
                <div className="container mx-auto px-6 lg:px-8 py-12">
                    <div className="mb-12">
                        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Resultados para: "{q || ""}"
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            {total > 0
                                ? `Encontramos ${total} noticias que coinciden con tu búsqueda.`
                                : "No se encontraron resultados para tu búsqueda."}
                        </p>
                    </div>

                    {items.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {items.map((article: any) => (
                                <ArticleCard
                                    key={article.id}
                                    category={article.category?.name || "Noticias"}
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
                        <div className="text-center py-20 bg-muted/30 rounded-3xl">
                            <p className="text-xl text-muted-foreground mb-4">
                                Prueba con otras palabras clave o busca en nuestras categorías.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </>
    )
}
