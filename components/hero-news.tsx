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
      <div className="relative z-10 w-full">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
          <div className="animate-fade-up">
            <Badge className="mb-4 md:mb-6 bg-primary text-primary-foreground font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs px-4 md:px-5 py-1.5 md:py-2 hover:bg-primary/90 shadow-2xl rounded-none">
              {category}
            </Badge>
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-4 md:mb-6 text-balance drop-shadow-2xl">
              {title}
            </h1>
            {context && (
              <p className="hidden md:block text-base md:text-lg text-white/90 font-medium leading-relaxed mb-4 max-w-3xl text-pretty drop-shadow-lg border-l-4 border-primary pl-5">
                {context}
              </p>
            )}
            <p className="text-sm md:text-lg lg:text-xl text-white/90 leading-relaxed mb-6 md:mb-8 max-w-2xl text-pretty drop-shadow-lg line-clamp-2 md:line-clamp-3">
              {excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs md:text-sm text-white/95">
              {author && (
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-white/10">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="font-normal tracking-wide">Por <span className="font-bold">{author}</span></span>
                </div>
              )}
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/10">
                  <Clock className="h-4 w-4" />
                </div>
                <time className="uppercase tracking-[0.1em] font-medium">{date}</time>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
