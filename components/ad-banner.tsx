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

    if (!ad) return <>{fallback ? fallback : null}</>

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
