"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { ArticleCard } from "@/components/article-card"
import { HorizontalCard } from "./horizontal-card"
import { TrendingSection } from "./trending-section"
import { Button } from "@/components/ui/button"
import { fetchApi } from "@/lib/api-client"
import { Loader2 } from "lucide-react"

interface CategoryViewProps {
    category: {
        name: string
        description?: string
        slug: string
    }
    initialNews: any[]
}

export function CategoryView({ category, initialNews }: CategoryViewProps) {
    const [news, setNews] = useState(initialNews)
    const [page, setPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [hasMore, setHasMore] = useState(initialNews.length >= 20)

    const featuredNews = news.slice(0, 3)
    const trendingNews = news.slice(3, 7)
    const listNews = news.slice(7)

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

    const loadMore = async () => {
        if (isLoading || !hasMore) return

        setIsLoading(true)
        try {
            const nextPage = page + 1
            // Use page parameter for pagination
            const endpoint = category.slug === "noticias"
                ? `/news?page=${nextPage}&limit=20`
                : `/news?categorySlug=${category.slug}&page=${nextPage}&limit=20`

            const response = await fetchApi(endpoint)

            if (response.success && response.data?.data) {
                const newArticles = response.data.data
                if (newArticles.length === 0) {
                    setHasMore(false)
                } else {
                    // Filter out duplicates to be safe
                    const existingIds = new Set(news.map(a => a.id))
                    const filteredNewArticles = newArticles.filter((a: any) => !existingIds.has(a.id))

                    if (filteredNewArticles.length > 0) {
                        setNews(prevNews => [...prevNews, ...filteredNewArticles])
                        setPage(nextPage)
                    }

                    // If the response returned fewer than limit, we reached the end
                    if (newArticles.length < 20) {
                        setHasMore(false)
                    }
                }
            } else {
                setHasMore(false)
            }
        } catch (error) {
            console.error("Error loading more news:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Minimal Section Header */}
            <div className="container mx-auto px-4 md:px-6 lg:px-8 pt-12 md:pt-16 pb-8 md:pb-12 border-b border-border/50 mb-12">
                <div className="max-w-4xl">
                    <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px] md:text-xs mb-4 block">
                        {category.name}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6 font-display tracking-tight leading-none uppercase">
                        Últimas noticias
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light max-w-2xl">
                        {category.description || `Cobertura exclusiva de eventos locales y relatos destacados del interior del país.`}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                {/* 1. Featured Grid (3 Columns) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {featuredNews.map((article) => (
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

                {/* 2. Tendencias (Grid overlay cards) */}
                {trendingNews.length > 0 && (
                    <TrendingSection
                        items={trendingNews.map(item => ({
                            id: item.id,
                            title: item.title,
                            image: item.mainImageUrl,
                            category: item.category?.name || category.name,
                            slug: item.slug
                        }))}
                    />
                )}

                {/* 3. List Section (Horizontal cards) */}
                {listNews.length > 0 && (
                    <div className="mt-20">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black uppercase tracking-tight font-display border-l-4 border-primary pl-4">
                                Más noticias de {category.name.toLowerCase()}
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-2">
                            {listNews.map((article) => (
                                <HorizontalCard
                                    key={article.id}
                                    category={article.category?.name || category.name}
                                    title={article.title}
                                    image={article.mainImageUrl || "/placeholder.svg"}
                                    date={formatDate(article.publishedAt)}
                                    slug={article.slug}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Load More Button */}
                {hasMore && (
                    <div className="flex justify-center mt-16 pt-8 border-t border-border/50">
                        <Button
                            onClick={loadMore}
                            disabled={isLoading}
                            variant="outline"
                            className="rounded-full px-12 py-6 uppercase font-black tracking-widest text-xs border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 min-w-[240px]"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Cargando noticias...
                                </>
                            ) : (
                                "Cargar más noticias"
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
