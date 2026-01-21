import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import { generateSlug } from "@/lib/utils"

interface ListArticleProps {
  category: string
  title: string
  date: string
  number?: number
  slug?: string
}

export function ListArticle({ category, title, date, number, slug }: ListArticleProps) {
  const finalSlug = slug || generateSlug(title)

  return (
    <Link
      href={`/noticia/${finalSlug}`}
      className="group flex gap-3 md:gap-4 py-4 md:py-5 border-b border-border/50 last:border-0 transition-all duration-500 hover:bg-primary/5 hover:translate-x-1 px-3 md:px-4 -mx-3 md:-mx-4 rounded-sm"
    >
      {number && (
        <div className="flex-shrink-0">
          <span className="font-serif text-3xl md:text-4xl font-black text-muted-foreground/20 group-hover:text-primary/40 transition-colors leading-none">
            {number.toString().padStart(2, "0")}
          </span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <Badge
          variant="outline"
          className="mb-2 font-bold uppercase tracking-widest text-[9px] border-foreground/20 px-2 py-0.5"
        >
          {category}
        </Badge>
        <h4 className="font-serif text-sm md:text-base lg:text-lg font-bold text-foreground leading-[1.3] mb-2 text-balance group-hover:text-primary transition-colors">
          {title}
        </h4>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <time className="uppercase tracking-wider font-medium">{date}</time>
        </div>
      </div>
    </Link>
  )
}
