import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface NewsCardProps {
  category: string
  title: string
  excerpt?: string
  image: string
  date: string
  featured?: boolean
}

export function NewsCard({ category, title, excerpt, image, date, featured = false }: NewsCardProps) {
  if (featured) {
    return (
      <Link href="#" className="group relative overflow-hidden rounded-lg">
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <Badge variant="secondary" className="mb-3 bg-secondary text-secondary-foreground">
            {category}
          </Badge>
          <h2 className="text-balance text-2xl font-bold text-white leading-tight mb-2">{title}</h2>
          {excerpt && <p className="text-sm text-white/80 line-clamp-2 leading-relaxed">{excerpt}</p>}
          <time className="mt-3 block text-xs text-white/60 uppercase tracking-wider">{date}</time>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href="#"
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:bg-accent"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <Badge variant="outline" className="mb-2 w-fit text-xs">
          {category}
        </Badge>
        <h3 className="text-balance font-semibold leading-tight text-card-foreground group-hover:text-foreground mb-2">
          {title}
        </h3>
        {excerpt && <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">{excerpt}</p>}
        <time className="mt-3 text-xs text-muted-foreground uppercase tracking-wider">{date}</time>
      </div>
    </Link>
  )
}
