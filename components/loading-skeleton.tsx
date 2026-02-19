import { Skeleton } from "@/components/ui/skeleton"

export function ArticleCardSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="aspect-video w-full rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
        </div>
    )
}

export function HeroCarouselSkeleton() {
    return (
        <div className="relative h-[500px] md:h-[650px] w-full bg-muted animate-pulse overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl h-full flex flex-col justify-end pb-12 md:pb-24">
                <Skeleton className="h-6 w-32 mb-6 bg-white/10" />
                <Skeleton className="h-16 w-3/4 mb-6 bg-white/10" />
                <Skeleton className="h-8 w-1/2 mb-8 bg-white/10" />
                <div className="flex gap-4">
                    <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
                    <Skeleton className="h-10 w-32 bg-white/10" />
                </div>
            </div>
        </div>
    )
}

export function ListArticleSkeleton() {
    return (
        <div className="flex gap-4 items-center">
            <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-24" />
            </div>
        </div>
    )
}

export function CategorySkeleton() {
    return (
        <div className="space-y-8">
            <Skeleton className="h-8 w-48 mb-4 border-l-4 border-primary pl-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ArticleCardSkeleton />
                <ArticleCardSkeleton />
            </div>
        </div>
    )
}
