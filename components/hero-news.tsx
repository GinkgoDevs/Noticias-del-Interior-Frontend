import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Clock, User } from "lucide-react"
import { generateSlug } from "@/lib/utils"

interface HeroNewsProps {
  category: string
  title: string
  excerpt: string
  image: string
  date: string
  author?: string
  context?: string
  slug?: string
}

export function HeroNews({ category, title, excerpt, image, date, author, context, slug }: HeroNewsProps) {
  const finalSlug = slug || generateSlug(title)

  return (
    <Link href={`/noticia/${finalSlug}`} className="group relative flex flex-col justify-end h-[500px] md:h-[650px] w-full overflow-hidden bg-black pb-12 md:pb-24">
      {/* Background Image - Absolute */}
      <Image
        src={image || "/placeholder.svg"}
        alt={title}
        fill
        className="object-cover transition-all duration-[2000ms] ease-out group-hover:scale-110 group-hover:opacity-80 group-hover:blur-[2px]"
        priority
      />

      {/* Gradients - Stronger at bottom for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />
      {/* Removed: <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent lg:from-black/70" /> */}

      {/* Content - Positioned at bottom with better spacing */}
      <div className="relative z-10 w-full mb-8 md:mb-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
          <div className="reveal-staggered">
            <Badge className="mb-4 md:mb-6 bg-primary text-primary-foreground font-black uppercase tracking-[0.3em] text-[9px] md:text-[10px] px-4 md:px-6 py-1.5 md:py-2 hover:bg-primary/90 shadow-2xl rounded-none border-none">
              {category}
            </Badge>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[0.95] mb-6 md:mb-8 text-pretty drop-shadow-2xl tracking-tighter">
              {title}
            </h1>
            {context && (
              <p className="hidden md:block text-base md:text-xl text-white/90 font-medium leading-relaxed mb-6 max-w-3xl text-pretty drop-shadow-lg border-l-2 border-primary pl-6">
                {context}
              </p>
            )}
            <p className="text-base md:text-xl lg:text-2xl text-white/80 leading-relaxed mb-8 md:mb-10 max-w-2xl text-pretty drop-shadow-lg line-clamp-2 md:line-clamp-3 font-light">
              {excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              {author && (
                <div className="flex items-center gap-3 glass-panel px-4 py-2 rounded-full">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-xs md:text-sm text-white/90">
                    Por <span className="font-bold">{author}</span>
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3 glass-panel px-4 py-2 rounded-full">
                <Clock className="h-4 w-4 text-primary" />
                <time className="text-xs md:text-sm text-white/90 uppercase tracking-widest font-medium">
                  {date}
                </time>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
