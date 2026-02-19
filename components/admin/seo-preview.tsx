"use client"

import { Card, CardContent } from "@/components/ui/card"

interface SEOPreviewProps {
    title: string
    slug: string
    excerpt: string
    seoTitle?: string
    seoDescription?: string
}

export function SEOPreview({ title, slug, excerpt, seoTitle, seoDescription }: SEOPreviewProps) {
    const displayTitle = seoTitle || title || "Título de la noticia"
    const displaySlug = slug || "url-de-la-noticia"
    const displayExcerpt = seoDescription || excerpt || "Aquí aparecerá el extracto que verán los usuarios en los resultados de búsqueda de Google y redes sociales..."

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground bg-muted/50 w-fit px-2 py-1 rounded">
                Vista previa en Google
            </h3>
            <Card className="bg-white border-slate-200 shadow-sm overflow-hidden max-w-2xl">
                <CardContent className="p-4 space-y-1">
                    <div className="flex items-center gap-1 text-[12px] text-slate-600 truncate">
                        <span>https://noticiasdelinterior.com.ar</span>
                        <span className="text-slate-400">› noticia ›</span>
                        <span className="text-slate-600">{displaySlug}</span>
                    </div>
                    <h4 className="text-[20px] text-[#1a0dab] font-normal hover:underline cursor-pointer leading-tight truncate">
                        {displayTitle}
                    </h4>
                    <p className="text-[14px] text-[#4d5156] leading-relaxed line-clamp-2">
                        {displayExcerpt}
                    </p>
                </CardContent>
            </Card>
            <p className="text-[11px] text-muted-foreground italic">
                * Esta es una simulación de cómo se vería tu noticia en buscadores.
            </p>
        </div>
    )
}
