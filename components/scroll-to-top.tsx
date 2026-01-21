"use client"

import { useEffect, useState } from "react"
import { ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const toggleVisibility = () => {
            // Show when scrolling down more than 400px
            if (window.scrollY > 400) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        window.addEventListener("scroll", toggleVisibility)
        return () => window.removeEventListener("scroll", toggleVisibility)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }

    return (
        <div
            className={cn(
                "fixed bottom-8 right-8 z-[110] transition-all duration-700 transform",
                isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-16 opacity-0 scale-50 pointer-events-none"
            )}
        >
            <Button
                variant="default"
                size="icon"
                onClick={scrollToTop}
                className="h-14 w-14 rounded-full shadow-[0_10px_40px_-10px_oklch(var(--primary)/0.5)] bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-2 hover:shadow-[0_20px_50px_-10px_oklch(var(--primary)/0.6)] active:scale-95 transition-all duration-500 group relative overflow-hidden"
                title="Volver arriba"
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <ChevronUp className="h-7 w-7 transition-all duration-500 group-hover:scale-125" />
            </Button>
        </div>
    )
}
