"use client"

import { useState, useEffect } from "react"
import { Share2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface StickyArticleHeaderProps {
    title: string
    category: string
}

export function StickyArticleHeader({ title, category }: StickyArticleHeaderProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling past the main title area (approx 400px)
            setIsVisible(window.scrollY > 400)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <div
            className={cn(
                "fixed top-0 left-0 w-full bg-background/90 backdrop-blur-md border-b border-border z-[100] transition-all duration-500 transform",
                isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
            )}
        >
            <div className="container mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <Link href="/" className="shrink-0 p-2 hover:bg-muted rounded-full transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div className="h-8 w-px bg-border hidden sm:block" />
                    <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary truncate hidden sm:block">
                            {category}
                        </span>
                        <h2 className="text-sm md:text-base font-bold truncate">
                            {title}
                        </h2>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="default" size="sm" className="rounded-full px-4 gap-2">
                        <Share2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Compartir</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}
