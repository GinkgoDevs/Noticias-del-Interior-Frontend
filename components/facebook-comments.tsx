"use client"

import { useEffect, useState, useRef } from "react"
import { useTheme } from "next-themes"

interface FacebookCommentsProps {
  url: string
  numPosts?: number
}

export function FacebookComments({ url, numPosts = 10 }: FacebookCommentsProps) {
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme, resolvedTheme } = useTheme()

  // Wait until mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const currentTheme = mounted ? (resolvedTheme || theme || "light") : "light"

  // Force re-render of FB comments when URL or Theme changes
  useEffect(() => {
    if (mounted && window.FB) {
      window.FB.XFBML.parse()
    }
  }, [url, currentTheme, mounted])

  if (!mounted) {
    return <div className="min-h-[200px] w-full bg-muted/20 animate-pulse rounded-lg" />
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://noticiasdelinterior.com.ar"
  const fullUrl = url.startsWith('http') ? url : `${siteUrl}${url.startsWith('/') ? '' : '/'}${url}`

  return (
    <div ref={containerRef} className="fb-comments-container w-full bg-white rounded-lg p-4" suppressHydrationWarning>
      <div
        className="fb-comments"
        data-href={fullUrl}
        data-width="100%"
        data-numposts={numPosts}
        data-colorscheme={currentTheme === "dark" ? "dark" : "light"}
        data-lazy="true"
        suppressHydrationWarning
      ></div>
    </div>
  )
}

// Type declaration for Facebook SDK
declare global {
  interface Window {
    FB?: {
      init: (params: { appId: string; autoLogAppEvents: boolean; xfbml: boolean; version: string }) => void
      XFBML: {
        parse: (element?: HTMLElement) => void
      }
    }
  }
}
