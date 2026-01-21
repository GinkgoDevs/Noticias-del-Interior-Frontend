"use client"

import { useEffect, useRef } from "react"

interface FacebookCommentsProps {
  url: string
  numPosts?: number
}

export function FacebookComments({ url, numPosts = 10 }: FacebookCommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load Facebook SDK
    if (typeof window !== "undefined" && !window.FB) {
      // Create script element
      const script = document.createElement("script")
      script.src = "https://connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v18.0"
      script.async = true
      script.defer = true
      script.crossOrigin = "anonymous"
      script.nonce = "random-nonce-value"

      // Append to document
      document.body.appendChild(script)

      // Initialize FB SDK when loaded
      script.onload = () => {
        if (window.FB) {
          window.FB.init({
            appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "",
            autoLogAppEvents: true,
            xfbml: true,
            version: "v18.0",
          })
        }
      }
    } else if (window.FB) {
      // If FB SDK already loaded, parse the comments plugin
      window.FB.XFBML.parse()
    }
  }, [])

  // Parse comments when URL changes
  useEffect(() => {
    if (window.FB && containerRef.current) {
      window.FB.XFBML.parse(containerRef.current)
    }
  }, [url])

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://noticiasdelinterior.com.ar"
  const fullUrl = `${siteUrl}${url}`

  return (
    <div ref={containerRef} className="fb-comments-container">
      <div id="fb-root"></div>
      <div
        className="fb-comments"
        data-href={fullUrl}
        data-width="100%"
        data-numposts={numPosts}
        data-colorscheme="light"
        data-lazy="true"
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
    fbAsyncInit?: () => void
  }
}
