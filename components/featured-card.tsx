import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Clock, User, ArrowUpRight } from "lucide-react"
import { generateSlug } from "@/lib/utils"

interface FeaturedCardProps {
  category: string
  title: string
  excerpt?: string
  image: string
  date: string
  author?: string
  size?: "large" | "medium" | "small"
  slug?: string
}

export function FeaturedCard({ category, title, excerpt, image, date, author, size = "medium", slug }: FeaturedCardProps) {
  const heightClass = size === "large" ? "h-[500px]" : size === "medium" ? "h-[420px]" : "h-[320px]"
  const titleSize =
    size === "large"
      ? "text-2xl md:text-3xl lg:text-4xl"
      : size === "medium"
        ? "text-xl md:text-2xl lg:text-3xl"
        : "text-lg md:text-xl"

  const finalSlug = slug || generateSlug(title)

  return (
    <Link
      href={`/noticia/${finalSlug}`}
      className="group relative block overflow-hidden rounded-sm shadow-lg hover:shadow-2xl transition-all duration-500"
    >
      <div className={`relative ${heightClass} overflow-hidden bg-black`}>
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
      </div>
      <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6 lg:p-8">
        <Badge className="mb-3 md:mb-4 w-fit bg-primary text-primary-foreground font-bold uppercase tracking-widest text-[10px] px-3 md:px-4 py-1.5 hover:bg-primary/95">
          {category}
        </Badge>
        <h3 className={`font-serif ${titleSize} font-bold text-white leading-[1.2] mb-3 text-balance drop-shadow-lg`}>
          {title}
        </h3>
        {excerpt && (
          <p className="text-sm lg:text-base text-white/95 line-clamp-2 leading-relaxed mb-4 text-pretty drop-shadow-md">
            {excerpt}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs text-white/90 bg-black/30 backdrop-blur-sm px-3 py-2 rounded w-fit">
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
        <div className="absolute top-4 md:top-6 right-4 md:right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="rounded-full bg-white/20 backdrop-blur-sm p-2">
            <ArrowUpRight className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>
    </Link>
  )
}
