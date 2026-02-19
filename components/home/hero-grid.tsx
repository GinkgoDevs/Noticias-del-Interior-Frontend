import Image from "next/image"
import Link from "next/link"
import { Clock, User } from "lucide-react"
import { generateSlug, cn } from "@/lib/utils"

interface HeroGridProps {
    items: any[]
}

export function HeroGrid({ items }: HeroGridProps) {
    if (!items || items.length === 0) return null

    const mainArticle = items[0]
    const sideArticles = items.slice(1, 3)

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).toUpperCase()
    }

    const getTimeAgo = (dateString: string) => {
        const now = new Date()
        const date = new Date(dateString)
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        if (diffMins < 60) return `Hace ${diffMins} minutos`
        const diffHours = Math.floor(diffMins / 60)
        if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`
        const diffDays = Math.floor(diffHours / 24)
        return `Hace ${diffDays} día${diffDays > 1 ? "s" : ""}`
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
            {/* Main Featured Article */}
            <Link
                href={`/noticia/${mainArticle.slug || generateSlug(mainArticle.title)}`}
                className="lg:col-span-3 group relative overflow-hidden rounded-xl bg-secondary w-full h-[320px] md:h-[450px] lg:h-[600px]"
            >
                <Image
                    src={mainArticle.mainImageUrl || "/placeholder.svg"}
                    alt={mainArticle.title}
                    fill
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 md:p-8 lg:p-10 w-full lg:w-4/5 py-8 md:py-10">
                    <span className="inline-block bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest shadow-xl">
                        {mainArticle.category?.name || "Política Nacional"}
                    </span>
                    <h1 className="text-2xl min-[400px]:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-[1.1] font-display tracking-tight drop-shadow-xl">
                        {mainArticle.title}
                    </h1>
                    {mainArticle.excerpt && (
                        <p className="hidden md:line-clamp-2 text-white/80 text-lg mb-6 max-w-2xl font-light">
                            {mainArticle.excerpt}
                        </p>
                    )}
                    <div className="flex items-center text-[10px] lg:text-xs text-white/60 space-x-6 mt-2">
                        <span className="flex items-center gap-1.5 font-medium">
                            <User className="h-3 w-3 text-primary opacity-80" />
                            {mainArticle.author?.name || "Redacción Central"}
                        </span>
                        <span className="flex items-center gap-1.5 font-medium">
                            <Clock className="h-3 w-3 text-primary opacity-80" />
                            {getTimeAgo(mainArticle.publishedAt)}
                        </span>
                    </div>
                </div>
            </Link>

            {/* Side Articles - Visible on all screens now, but different layouts */}
            {sideArticles.length > 0 && (
                <div className="flex flex-col md:grid md:grid-cols-2 lg:flex lg:flex-col gap-6">
                    {sideArticles.map((article: any) => (
                        <Link
                            key={article.id}
                            href={`/noticia/${article.slug || generateSlug(article.title)}`}
                            className="bg-surface-dark rounded-xl overflow-hidden border border-primary/10 group flex flex-row lg:flex-col h-auto lg:flex-1 hover:bg-surface-dark/80 transition-all duration-300 w-full"
                        >
                            <div className="w-[40%] lg:w-full aspect-video overflow-hidden shrink-0">
                                <Image
                                    src={article.mainImageUrl || "/placeholder.svg"}
                                    alt={article.title}
                                    width={400}
                                    height={225}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-4 flex flex-col justify-center lg:justify-start flex-1 min-w-0">
                                <span className="text-primary text-[9px] font-bold uppercase tracking-widest mb-1.5">
                                    {article.category?.name || "Interior"}
                                </span>
                                <h3 className="text-sm md:text-md lg:text-lg font-bold leading-tight text-foreground line-clamp-2 font-display tracking-tight">
                                    {article.title}
                                </h3>
                                <div className="flex items-center text-[9px] text-muted-foreground mt-2.5 space-x-3">
                                    <span className="flex items-center">
                                        <Clock className="h-2.5 w-2.5 mr-1 text-primary/70" />
                                        {getTimeAgo(article.publishedAt)}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
