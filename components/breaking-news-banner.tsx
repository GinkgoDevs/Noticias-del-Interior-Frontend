"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BreakingNews {
  id: string
  title: string
  slug: string
}

export function BreakingNewsBanner() {
  const [news, setNews] = useState<BreakingNews[]>([])
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const fetchBreakingNews = async () => {
      try {
        const response = await fetch("/api/breaking-news")

        // Verify that response is actually JSON
        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          console.error("[v0] Breaking news API did not return JSON")
          return
        }

        if (!response.ok) {
          console.error("[v0] Breaking news API returned error:", response.status)
          return
        }

        const data = await response.json()
        setNews(data)
      } catch (error) {
        console.error("[v0] Error fetching breaking news:", error)
      }
    }

    fetchBreakingNews()
    // Refresh every 2 minutes
    const interval = setInterval(fetchBreakingNews, 120000)
    return () => clearInterval(interval)
  }, [])

  if (!isVisible || news.length === 0) {
    return null
  }

  return (
    <div className="relative bg-primary text-primary-foreground overflow-hidden border-b border-primary/20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-3 py-2.5 md:py-3">
          <span className="font-bold text-xs md:text-sm uppercase tracking-wider whitespace-nowrap bg-primary-foreground text-primary px-2.5 py-1 rounded">
            Última Hora
          </span>

          <div className="flex-1 overflow-hidden">
            <div className="flex gap-8 animate-scroll-news">
              {[...news, ...news].map((item, index) => (
                <Link
                  key={`${item.id}-${index}`}
                  href={`/noticia/${item.slug}`}
                  className="whitespace-nowrap text-sm md:text-base hover:underline font-medium"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            className="shrink-0 h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Cerrar banner</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
