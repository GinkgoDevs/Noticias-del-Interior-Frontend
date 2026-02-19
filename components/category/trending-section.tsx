import Link from "next/link"
import Image from "next/image"
import { generateSlug } from "@/lib/utils"

interface TrendingItem {
    id: string
    title: string
    image: string
    category: string
    slug: string
}

interface TrendingSectionProps {
    items: TrendingItem[]
}

export function TrendingSection({ items }: TrendingSectionProps) {
    if (items.length === 0) return null

    return (
        <div className="my-16">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black uppercase tracking-[0.2em] text-foreground border-l-4 border-primary pl-4">
                    Tendencias
                </h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {items.map((item) => (
                    <Link
                        key={item.id}
                        href={`/noticia/${item.slug || generateSlug(item.title)}`}
                        className="group relative h-48 md:h-64 overflow-hidden rounded-xl bg-card-dark"
                    >
                        <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-50"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-4">
                            <span className="inline-block bg-primary text-white text-[8px] font-black px-2 py-0.5 rounded mb-2 uppercase tracking-widest">
                                {item.category}
                            </span>
                            <h4 className="text-xs md:text-sm font-bold text-white line-clamp-2 leading-tight">
                                {item.title}
                            </h4>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
