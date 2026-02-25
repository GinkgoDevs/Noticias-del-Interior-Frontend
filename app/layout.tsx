import type React from "react"
import type { Metadata } from "next"
import { Outfit, Playfair_Display, Work_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import Head from "next/head"
import Script from "next/script"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
})

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: {
    default: "Noticias del Interior - Información de calidad",
    template: "%s | Noticias del Interior"
  },
  description: "El portal de noticias más completo del interior argentino. Política, deportes, economía y más",
  metadataBase: new URL((process.env.NEXT_PUBLIC_SITE_URL || "https://noticiasdelinterior.site").replace(/\/$/, "")),
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "Noticias del Interior",
    description: "Información de calidad sobre todo lo que pasa en el interior argentino.",
    url: "./",
    siteName: "Noticias del Interior",
    images: [
      {
        url: "/logo-claro.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Noticias del Interior",
    description: "Información de calidad sobre todo lo que pasa en el interior argentino.",
    images: ["/logo-claro.png"],
  },
  icons: {
    icon: [
      {
        url: "/logo-claro.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/logo-claro.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/logo-claro.png",
        type: "image/png",
      },
    ],
    apple: "/logo-claro.png",
  },
  other: {},
  facebook: {
    appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "",
  },
}

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { ConditionalFooter } from "@/components/conditional-footer"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${outfit.variable} ${playfair.variable} ${workSans.variable}`} suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`font-sans antialiased text-foreground bg-background`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ConditionalFooter />
          <div id="fb-root" suppressHydrationWarning></div>
          <Toaster position="top-center" richColors />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
