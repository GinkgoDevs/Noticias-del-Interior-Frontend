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
        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) return
        if (!response.ok) return
        const data = await response.json()
        setNews(data)
      } catch (error) {
        console.error("[v0] Error fetching breaking news:", error)
      }
    }

    fetchBreakingNews()
    const interval = setInterval(fetchBreakingNews, 120000)
    return () => clearInterval(interval)
  }, [])

  if (!isVisible || news.length === 0) {
    return null
  }

  return (
    <div className="bg-primary/10 border-b border-primary/20 py-2 overflow-hidden whitespace-nowrap">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 flex items-center">
        <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded mr-4 uppercase flex-shrink-0">
          Urgente
        </span>
        <div className="flex-1 overflow-hidden">
          <div className="flex gap-8 animate-scroll-breaking-news">
            {[...news, ...news].map((item, index) => (
              <Link
                key={`${item.id}-${index}`}
                href={`/noticia/${item.slug}`}
                className="whitespace-nowrap text-sm font-medium hover:text-primary transition-colors"
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
          className="shrink-0 h-8 w-8 hover:bg-primary/20 ml-2"
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Cerrar banner</span>
        </Button>
      </div>
    </div>
  )
}
