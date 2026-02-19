import { fetchApi } from "@/lib/api-client"
import { ArticleCard } from "@/components/article-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export async function LatestArticles() {
    let remainingArticles = []

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
            day: "2-digit",
            month: "short",
        };

        // Sólo mostrar el año si no es el actual
        if (date.getFullYear() !== now.getFullYear()) {
            options.year = "numeric";
        }

        return date.toLocaleDateString("es-ES", options).toUpperCase();
    };

    try {
        const response = await fetchApi("/news?limit=12", { revalidate: 300, tags: ['news-latest'] })
        if (response.success && response.data?.data) {
            // Skip the first 5 which are used by the hero grid
            remainingArticles = response.data.data.slice(5, 9)
        }
    } catch (error) {
        console.error("Error fetching latest articles:", error)
    }

    if (remainingArticles.length === 0) {
        return <p className="text-muted-foreground py-12 text-center">No hay más noticias disponibles</p>
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
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
        </>
    )
}
