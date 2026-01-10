import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
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
      className="group flex flex-col overflow-hidden transition-all duration-300 hover:translate-y-[-2px] relative"
    >
      <div className="relative aspect-[16/10] overflow-hidden mb-4 md:mb-5 rounded-sm shadow-md group-hover:shadow-xl transition-shadow duration-300 bg-muted">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="flex flex-col flex-1">
        <Badge
          variant="outline"
          className="mb-2 md:mb-3 w-fit font-bold uppercase tracking-widest text-[10px] border-foreground/30 text-foreground px-3 py-1"
        >
          {category}
        </Badge>
        <h3 className="font-serif text-lg md:text-xl lg:text-2xl font-bold text-foreground leading-[1.3] mb-2 md:mb-3 text-balance group-hover:text-foreground/70 transition-colors">
          {title}
        </h3>
        {excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-3 leading-[1.6] flex-1 mb-3 md:mb-4 text-pretty">
            {excerpt}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs text-muted-foreground pt-3 border-t border-border/50">
          {author && (
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              <span className="font-semibold">Por {author}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <time className="uppercase tracking-wider font-medium">{date}</time>
          </div>
        </div>
      </div>
    </Link>
  )
}
