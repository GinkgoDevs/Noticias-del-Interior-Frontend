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
      className="flex items-start group transition-all duration-300"
    >
      {number && (
        <span className="text-3xl font-black text-primary/30 group-hover:text-primary transition-colors mr-4 shrink-0">
          {number.toString().padStart(2, "0")}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <h4 className="font-bold hover:text-primary transition-colors text-sm leading-snug line-clamp-3">
          {title}
        </h4>
        <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground font-medium">
          <Clock className="h-3 w-3 text-primary/60" />
          <time className="uppercase tracking-widest">{date}</time>
        </div>
      </div>
    </Link>
  )
}
