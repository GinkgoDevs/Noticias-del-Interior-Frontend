import { fetchApi } from "@/lib/api-client"
import { HeroGrid } from "@/components/home/hero-grid"

export async function HeroSection() {
    let carouselItems = []
    try {
        const response = await fetchApi("/news?limit=5", { revalidate: 300, tags: ['news-latest'] })
        if (response.success && response.data?.data) {
            carouselItems = response.data.data
        }
    } catch (error) {
        console.error("Error fetching hero:", error)
    }

    if (carouselItems.length === 0) {
        return (
            <div className="h-[500px] flex items-center justify-center bg-muted">
                <p className="text-muted-foreground">No hay noticias hoy</p>
            </div>
        )
    }

    return <HeroGrid items={carouselItems} />
}
