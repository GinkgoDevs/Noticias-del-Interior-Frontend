"use client"

import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { HeroNews } from "./hero-news"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface HeroCarouselProps {
    items: any[]
}

export function HeroCarousel({ items }: HeroCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
        Autoplay({ delay: 5000, stopOnInteraction: false })
    ])
    const [selectedIndex, setSelectedIndex] = React.useState(0)

    const onSelect = React.useCallback(() => {
        if (!emblaApi) return
        setSelectedIndex(emblaApi.selectedScrollSnap())
    }, [emblaApi])

    React.useEffect(() => {
        if (!emblaApi) return
        onSelect()
        emblaApi.on("select", onSelect)
    }, [emblaApi, onSelect])

    const scrollPrev = React.useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
    const scrollNext = React.useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

    if (!items || items.length === 0) return null

    // If only one item, don't show carousel controls
    if (items.length === 1) {
        const item = items[0]
        return (
            <HeroNews
                category={item.category?.name || "Actualidad"}
                title={item.title}
                excerpt={item.excerpt}
                image={item.mainImageUrl || "/placeholder.svg"}
                date={new Date(item.publishedAt).toLocaleDateString("es-ES", { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                author={item.author?.name || "Redacción NDI"}
                slug={item.slug}
            />
        )
    }

    return (
        <div className="relative group overflow-hidden">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {items.map((item, index) => (
                        <div className="flex-[0_0_100%] min-w-0 relative" key={item.id || index}>
                            <HeroNews
                                category={item.category?.name || "Actualidad"}
                                title={item.title}
                                excerpt={item.excerpt}
                                image={item.mainImageUrl || "/placeholder.svg"}
                                date={new Date(item.publishedAt).toLocaleDateString("es-ES", { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                                author={item.author?.name || "Redacción NDI"}
                                slug={item.slug}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows - Sides */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 z-20 flex justify-between pointer-events-none">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={scrollPrev}
                    className="rounded-full bg-black/20 backdrop-blur-md border-white/10 text-white hover:bg-primary hover:text-white transition-all pointer-events-auto h-10 w-10 md:h-12 md:w-12 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
                >
                    <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={scrollNext}
                    className="rounded-full bg-black/20 backdrop-blur-md border-white/10 text-white hover:bg-primary hover:text-white transition-all pointer-events-auto h-10 w-10 md:h-12 md:w-12 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
                >
                    <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
                </Button>
            </div>

            {/* Pagination Dots - Positioned to the right of metadata */}
            <div className="absolute bottom-10 md:bottom-20 left-0 right-0 z-20 pointer-events-none">
                <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl flex justify-end">
                    <div className="flex gap-2 pointer-events-auto">
                        {items.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => emblaApi?.scrollTo(index)}
                                className={`h-1.5 transition-all duration-500 rounded-full ${index === selectedIndex
                                        ? "w-10 bg-primary shadow-[0_0_15px_oklch(var(--primary))]"
                                        : "w-2 bg-white/20 hover:bg-white/50"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Visual background gradient for controls */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </div>
    )
}
