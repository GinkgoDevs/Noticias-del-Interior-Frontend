"use client"

import { useEffect, useState } from "react"

export function ReadingProgress() {
    const [completion, setCompletion] = useState(0)

    useEffect(() => {
        const updateScrollCompletion = () => {
            const currentProgress = window.scrollY
            const scrollHeight = document.body.scrollHeight - window.innerHeight
            if (scrollHeight) {
                setCompletion(
                    Number((currentProgress / scrollHeight).toFixed(2)) * 100
                )
            }
        }

        window.addEventListener("scroll", updateScrollCompletion)

        return () => {
            window.removeEventListener("scroll", updateScrollCompletion)
        }
    }, [])

    return (
        <div className="fixed top-0 left-0 w-full h-[4px] bg-transparent z-[100] pointer-events-none">
            <div
                className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary transition-all duration-300 ease-out shadow-[0_0_15px_oklch(var(--primary)/0.6)] rounded-r-full"
                style={{
                    width: `${completion}%`,
                    boxShadow: completion > 0 ? "0 0 10px oklch(var(--primary) / 0.8), 0 0 20px oklch(var(--primary) / 0.4)" : "none"
                }}
            />
        </div>
    )
}
