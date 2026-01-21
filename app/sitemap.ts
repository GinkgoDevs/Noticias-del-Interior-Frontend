import { MetadataRoute } from 'next'
import { fetchApi } from '@/lib/api-client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://noticiasdelinterior.com.ar'

    // Rutas estáticas
    const routes = [
        '',
        '/juegos',
        '/juegos/wordle',
        '/juegos/sudoku',
        '/juegos/crucigrama',
        '/archivo',
        '/buscar',
    ].map((route) => ({
        url: `${siteUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Obtener categorías dinámicas
    let categoryRoutes: MetadataRoute.Sitemap = []
    try {
        const categoriesRes = await fetchApi('/categories')
        if (categoriesRes.success && Array.isArray(categoriesRes.data)) {
            categoryRoutes = categoriesRes.data.map((cat: any) => ({
                url: `${siteUrl}/${cat.slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            }))
        }
    } catch (error) {
        console.error('Error fetching categories for sitemap:', error)
    }

    // Obtener noticias recientes (ejemplo: últimas 100)
    let newsRoutes: MetadataRoute.Sitemap = []
    try {
        const newsRes = await fetchApi('/news?limit=100')
        if (newsRes.success && newsRes.data?.data) {
            newsRoutes = newsRes.data.data.map((post: any) => ({
                url: `${siteUrl}/noticia/${post.slug}`,
                lastModified: new Date(post.updatedAt || post.publishedAt || new Date()),
                changeFrequency: 'monthly' as const,
                priority: 0.6,
            }))
        }
    } catch (error) {
        console.error('Error fetching news for sitemap:', error)
    }

    return [...routes, ...categoryRoutes, ...newsRoutes]
}
