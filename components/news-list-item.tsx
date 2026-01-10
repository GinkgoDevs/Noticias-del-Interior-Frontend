import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

interface NewsListItemProps {
  category: string
  title: string
  source: string
  date: string
}

export function NewsListItem({ category, title, source, date }: NewsListItemProps) {
  return (
    <Link
      href="#"
      className="group flex flex-col gap-3 border-b border-border pb-6 last:border-0 last:pb-0 hover:bg-accent/50 -mx-2 px-2 py-4 rounded-md transition-colors"
    >
      <div className="flex items-center gap-2">
        <time className="text-xs text-muted-foreground uppercase tracking-wider">{date}</time>
      </div>
      <h3 className="text-balance font-medium leading-relaxed text-foreground group-hover:text-primary transition-colors">
        {title}
      </h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
          <span className="text-xs text-muted-foreground">{source}</span>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  )
}
