import { fetchApi } from "@/lib/api-client"
import { ArticleCard } from "@/components/article-card"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface CategorySectionProps {
    title: string
    categorySlug: string
    href: string
}

export async function CategorySection({ title, categorySlug, href }: CategorySectionProps) {
    let articles: any[] = []

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
            day: "2-digit",
            month: "short",
        };

        if (date.getFullYear() !== now.getFullYear()) {
            options.year = "numeric";
        }

        return date.toLocaleDateString("es-ES", options).toUpperCase();
    }

    try {
        const response = await fetchApi(`/news?categorySlug=${categorySlug}&limit=2`, {
            revalidate: 300,
            tags: [`news-${categorySlug}`],
        })
        if (response.success && response.data?.data) {
            articles = response.data.data
        }
    } catch (error) {
        console.error(`Error fetching ${title}:`, error)
    }

    if (articles.length === 0) return null

    return (
        <div>
            <div className="flex items-center justify-between mb-8 border-l-4 border-primary pl-4">
                <h2 className="text-2xl font-bold uppercase tracking-tight font-display">{title}</h2>
                <Link
                    href={href}
                    className="text-primary font-bold text-sm flex items-center hover:translate-x-1 transition-transform"
                >
                    VER MÁS <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {articles.map((article: any, index: number) => (
                    <ArticleCard
                        key={article.id || index}
                        category={article.category?.name || title}
                        title={article.title}
                        excerpt={article.excerpt}
                        image={article.mainImageUrl || "/placeholder.svg"}
                        date={formatDate(article.publishedAt)}
                        author={article.author?.name || "Redacción NDI"}
                        slug={article.slug}
                    />
                ))}
            </div>
        </div>
    )
}
