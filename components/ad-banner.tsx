'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Skeleton } from './ui/skeleton'

interface Ad {
    id: string
    title: string
    imageUrl: string
    linkUrl: string
    position: string
}

interface AdBannerProps {
    position: 'HEADER' | 'SIDEBAR' | 'ARTICLE_SIDEBAR' | 'NEWS_LIST' | 'CONTENT' | 'FOOTER'
    className?: string
    fallback?: React.ReactNode
}

export function AdBanner({ position, className, fallback }: AdBannerProps) {
    const [ad, setAd] = useState<Ad | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1'}/ads/active?position=${position}`)
                const data = await res.json()
                if (data && data.length > 0) {
                    // Select one randomly if there are multiple for this position
                    const selected = data[Math.floor(Math.random() * data.length)]
                    setAd(selected)

                    // Record view
                    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1'}/ads/${selected.id}/view`, { method: 'POST' })
                }
            } catch (error) {
                console.error('Error loading ad:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchAd()
    }, [position])

    const handleClick = () => {
        if (ad) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1'}/ads/${ad.id}/click`, { method: 'POST' })
        }
    }

    if (loading) {
        return <Skeleton className={`w-full bg-muted/20 animate-pulse ${className}`} />
    }

    if (!ad) {
        if (fallback) return <>{fallback}</>

        const message = "Hola, quiero publicitar mi marca en Noticias del Interior.";
        const waLink = `https://wa.me/5493815558117?text=${encodeURIComponent(message)}`;

        return (
            <div className={`w-full h-full min-h-[140px] bg-[#FFCE00] flex flex-wrap items-center justify-center content-center gap-x-12 gap-y-4 p-6 text-black relative group overflow-hidden ${className}`}>
                <div className="flex flex-col items-center justify-center text-center pb-2">
                    <span className="font-black text-2xl sm:text-3xl lg:text-4xl tracking-tighter uppercase leading-[1.1] text-black">Publicidad</span>
                    <span className="font-bold text-[10px] sm:text-[11px] tracking-[0.25em] text-black/70 uppercase mt-1">Espacio Disponible</span>
                </div>

                <Link href={waLink} target="_blank" rel="noopener noreferrer" className="shrink-0 z-10 active:scale-95 transition-transform">
                    <div className="border border-black/80 hover:bg-black hover:text-[#FFCE00] transition-all duration-300 px-4 py-2 sm:px-6 sm:py-3 flex flex-row items-center justify-center gap-4 uppercase font-bold text-[10px] sm:text-xs tracking-widest cursor-pointer rounded-sm">
                        <span className="text-left leading-tight">Anunciá<br />Aquí</span>
                        <svg className="w-5 h-5 opacity-90 -rotate-45 hidden sm:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
                            <path d="M13 5v2"></path>
                            <path d="M13 17v2"></path>
                            <path d="M13 11v2"></path>
                        </svg>
                        <svg className="w-4 h-4 opacity-90 -rotate-45 sm:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
                            <path d="M13 5v2"></path>
                            <path d="M13 17v2"></path>
                            <path d="M13 11v2"></path>
                        </svg>
                    </div>
                </Link>
            </div>
        )
    }

    const content = (
        <div
            className={`relative overflow-hidden rounded-lg border border-border/50 group hover:border-primary/50 transition-all ${className}`}
            onClick={handleClick}
        >
            <Image
                src={ad.imageUrl}
                alt={ad.title}
                width={1200}
                height={400}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md text-[10px] text-white px-1.5 py-0.5 rounded font-medium tracking-widest uppercase">
                Publicidad
            </div>
        </div>
    )

    if (ad.linkUrl) {
        return (
            <Link href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className={`block ${className}`}>
                {content}
            </Link>
        )
    }

    return content
}
