import { fetchApi } from "@/lib/api-client"
import { ListArticle } from "@/components/list-article"

export async function TrendingNews() {
    let trending = []

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).toUpperCase();
    };

    try {
        const response = await fetchApi("/news/trending", { revalidate: 3600, tags: ['news-trending'] })
        if (response.success && response.data) {
            trending = response.data
        }
    } catch (error) {
        console.error("Error fetching trending:", error)
    }

    if (trending.length === 0) {
        return <p className="text-muted-foreground text-sm italic">No hay noticias populares hoy</p>
    }

    return (
        <div className="space-y-6">
            {trending.map((item: any, index: number) => (
                <ListArticle
                    key={item.id}
                    category={item.category?.name || "Actualidad"}
                    title={item.title}
                    date={formatDate(item.publishedAt)}
                    number={index + 1}
                    slug={item.slug}
                />
            ))}
        </div>
    )
}
