import Link from "next/link"
import Image from "next/image"
import { Clock } from "lucide-react"
import { generateSlug } from "@/lib/utils"

interface HorizontalCardProps {
    category: string
    title: string
    date: string
    image: string
    slug?: string
}

export function HorizontalCard({ category, title, date, image, slug }: HorizontalCardProps) {
    const finalSlug = slug || generateSlug(title)

    return (
        <Link
            href={`/noticia/${finalSlug}`}
            className="flex gap-4 group transition-all duration-300 py-4 border-b border-border/50 last:border-0"
        >
            <div className="w-24 h-24 md:w-32 md:h-24 shrink-0 overflow-hidden rounded-lg bg-surface-dark relative">
                <Image
                    src={image || "/placeholder.svg"}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
            </div>
            <div className="flex-1 min-w-0">
                <span className="text-primary text-[10px] font-black uppercase tracking-widest mb-1.5 block">
                    {category}
                </span>
                <h4 className="font-bold text-foreground text-sm md:text-base leading-tight line-clamp-2 md:line-clamp-3 mb-2 font-display">
                    {title}
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
                    <Clock className="h-3 w-3 text-primary/60" />
                    <time className="uppercase tracking-widest">{date}</time>
                </div>
            </div>
        </Link>
    )
}
