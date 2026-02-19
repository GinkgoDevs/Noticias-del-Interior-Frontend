import { Skeleton } from "./ui/skeleton"

export function NewsSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="aspect-[16/10] w-full rounded-sm" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex gap-4 pt-4 border-t border-border/50">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
            </div>
        </div>
    )
}

export function FeaturedSkeleton() {
    return (
        <div className="relative h-[420px] w-full rounded-sm overflow-hidden">
            <Skeleton className="h-full w-full" />
            <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full space-y-4">
                <Skeleton className="h-6 w-24 bg-white/20" />
                <Skeleton className="h-10 w-3/4 bg-white/20" />
                <Skeleton className="h-4 w-full bg-white/20" />
            </div>
        </div>
    )
}

export function HeroSkeleton() {
    return (
        <div className="h-[calc(100vh-150px)] min-h-[600px] w-full relative">
            <Skeleton className="h-full w-full" />
            <div className="absolute inset-0 flex flex-col justify-center">
                <div className="container mx-auto px-4 space-y-6">
                    <Skeleton className="h-8 w-32 bg-white/10" />
                    <Skeleton className="h-20 w-3/4 bg-white/10" />
                    <Skeleton className="h-6 w-1/2 bg-white/10" />
                    <div className="flex gap-6">
                        <Skeleton className="h-10 w-40 bg-white/10" />
                        <Skeleton className="h-10 w-40 bg-white/10" />
                    </div>
                </div>
            </div>
        </div>
    )
}
