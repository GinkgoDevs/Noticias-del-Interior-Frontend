import { Header } from "@/components/header"
import { ArticleCard } from "@/components/article-card"
import { fetchApi } from "@/lib/api-client"
import { Metadata } from "next"

export const dynamic = "force-dynamic"

export async function generateMetadata({
    params,
}: {
    params: Promise<{ date: string }>
}): Promise<Metadata> {
    const { date } = await params
    return {
        title: `Archivo del ${date} | Noticias del Interior`,
        description: `Noticias publicadas el día ${date}`,
    }
}

export default async function ArchivoPage({
    params,
}: {
    params: Promise<{ date: string }>
}) {
    const { date } = await params
    let items = []
    let total = 0

    try {
        const response = await fetchApi(`/news?date=${date}&limit=50`)
        if (response.success && response.data) {
            items = response.data.data || []
            total = response.data.meta?.total || 0
        }
    } catch (error) {
        console.error("Error fetching archive news:", error)
    }

    const formatDateDisplay = (dateStr: string) => {
        return new Date(dateStr + "T12:00:00").toLocaleDateString("es-AR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        })
    }

    const formatArticleDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).toUpperCase()
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-background pt-12">
                <div className="container mx-auto px-6 lg:px-8 py-12">
                    <div className="mb-12 border-b border-border pb-8">
                        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 capitalize">
                            Archivo: {formatDateDisplay(date)}
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            {total > 0
                                ? `Mostrando ${total} noticias publicadas este día.`
                                : "No se encontraron noticias para esta fecha."}
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
                                    date={formatArticleDate(article.publishedAt)}
                                    author={article.author?.name || "Redacción NDI"}
                                    slug={article.slug}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-border">
                            <p className="text-xl text-muted-foreground mb-4">
                                No hay registros para este día. Prueba seleccionando otra fecha en la barra superior.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </>
    )
}
