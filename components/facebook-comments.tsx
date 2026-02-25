"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

interface FacebookCommentsProps {
  url: string
  numPosts?: number
}

// Keep track globally if FB init has been called
let isFbInitialized = false

export function FacebookComments({ url, numPosts = 10 }: FacebookCommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Wait for client to mount to read the current theme
  useEffect(() => {
    setMounted(true)
  }, [])

  const currentTheme = mounted ? (resolvedTheme || theme || "light") : "light"

  // The siteUrl calculation ensures comments always act as if they are in production
  // This helps prevent "localhost" issues with Facebook Comments.
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://noticiasdelinterior.site").replace(/\/$/, "")
  const fullUrl = url.startsWith('http') ? url : `${siteUrl}${url.startsWith('/') ? '' : '/'}${url}`

  useEffect(() => {
    if (!mounted) return

    // Ensure the fb-root div exists. Facebook needs this.
    if (!document.getElementById("fb-root")) {
      const fbRoot = document.createElement("div")
      fbRoot.id = "fb-root"
      document.body.appendChild(fbRoot)
    }

    const parseFB = () => {
      // @ts-ignore
      if (window.FB && containerRef.current) {
        try {
          // Initialize FB if it hasn't been initialized yet
          if (!isFbInitialized) {
            const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || undefined
            // @ts-ignore
            window.FB.init({
              appId: appId,
              autoLogAppEvents: !!appId,
              xfbml: false, // We use manual parse below
              version: 'v19.0'
            })
            isFbInitialized = true
          }

          // Tell FB to parse ONLY this specific element to avoid re-parsing the whole page
          // @ts-ignore
          window.FB.XFBML.parse(containerRef.current)
        } catch (e) {
          console.error("Facebook Parse Error Final:", e)
        }
      }
    }

    const loadSDK = () => {
      const scriptId = "facebook-jssdk"

      if (document.getElementById(scriptId)) {
        return Promise.resolve() // SDK already present in DOM
      }

      return new Promise<void>((resolve) => {
        const js = document.createElement("script")
        js.id = scriptId
        js.src = `https://connect.facebook.net/es_LA/sdk.js`
        js.async = true
        js.defer = true
        js.crossOrigin = "anonymous"
        js.onload = () => resolve()
        document.body.appendChild(js)
      })
    }

    loadSDK().then(() => {
      // Small timeout to let the DOM settle for the newly rendered fb-comments div
      setTimeout(() => {
        // @ts-ignore
        if (window.FB) {
          parseFB()
        } else {
          // Fallback polling in case the script loaded but FB object is delayed
          let attempts = 0
          const interval = setInterval(() => {
            // @ts-ignore
            if (window.FB) {
              parseFB()
              clearInterval(interval)
            }
            attempts++
            if (attempts > 50) clearInterval(interval) // Stop trying after 5 seconds
          }, 100)
        }
      }, 50)
    })

  }, [fullUrl, currentTheme, mounted])

  if (!mounted) {
    return <div className="min-h-[200px] w-full bg-muted/10 animate-pulse rounded-lg mt-4" />
  }

  return (
    <div className="w-full mt-4 flex flex-col items-center relative">
      <div
        key={`${fullUrl}-${currentTheme}`}
        ref={containerRef}
        className={`w-full relative min-h-[150px] ${currentTheme === "dark" ? "bg-[#18191a]" : "bg-white"} overflow-hidden rounded-lg`}
      >
        {/* Pre-loader state that gets overlapped by facebook iframe if it works */}
        <div className="absolute inset-0 flex items-center justify-center p-6 text-sm text-center text-muted-foreground opacity-60">
          Cargando comentarios...<br />
          Si utilizas un bloqueador de anuncios (AdBlock, Brave Guard), es posible que no puedas verlos.
        </div>

        <div
          className="fb-comments w-full relative z-10"
          data-href={fullUrl}
          data-width="100%"
          data-numposts={numPosts.toString()}
          data-colorscheme={currentTheme === "dark" ? "dark" : "light"}
        >
        </div>
      </div>
    </div>
  )
}

declare global {
  interface Window {
    FB?: {
      init: (params: { appId?: string; autoLogAppEvents: boolean; xfbml: boolean; version: string }) => void
      XFBML: {
        parse: (element?: HTMLElement) => void
      }
    }
    fbAsyncInit?: () => void
  }
}
