import Image from "next/image"
import Link from "next/link"
import { Clock, User } from "lucide-react"
import { generateSlug } from "@/lib/utils"

interface ArticleCardProps {
  category: string
  title: string
  excerpt?: string
  image: string
  date: string
  author?: string
  slug?: string
}

export function ArticleCard({ category, title, excerpt, image, date, author, slug }: ArticleCardProps) {
  const finalSlug = slug || generateSlug(title)

  return (
    <Link
      href={`/noticia/${finalSlug}`}
      className="group flex flex-col overflow-hidden relative"
    >
      <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-surface-dark relative">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-primary/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg uppercase">
            {category}
          </span>
        </div>
      </div>
      <h3 className="text-xl font-bold leading-tight mb-3 line-clamp-2 font-display">
        {title}
      </h3>
      {excerpt && (
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed font-light">
          {excerpt}
        </p>
      )}
      <div className="flex items-center text-[10px] text-muted-foreground mt-auto pt-2 font-medium border-t border-border/50">
        <Clock className="h-3 w-3 mr-1.5 text-primary/70" />
        <time className="uppercase tracking-[0.1em]">{date}</time>
      </div>
    </Link>
  )
}
