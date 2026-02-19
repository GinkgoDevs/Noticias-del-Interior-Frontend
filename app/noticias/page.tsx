import { Header } from "@/components/header"
import { CategoryView } from "@/components/category/category-view"
import { fetchApi } from "@/lib/api-client"

export const dynamic = "force-dynamic"

export default async function TodasLasNoticiasPage() {
    let news = [];

    try {
        const newsResponse = await fetchApi(`/news?limit=20`);
        if (newsResponse.success && newsResponse.data?.data) {
            news = newsResponse.data.data;
        }
    } catch (error) {
        console.error("Error fetching all news:", error);
    }

    const archvieCategory = {
        name: "Archivo",
        slug: "noticias",
        description: "Explora nuestra cobertura completa de la actualidad del interior argentino. Información de proximidad, sin filtros y en un solo lugar."
    }

    return (
        <>
            <Header />
            <CategoryView category={archvieCategory} initialNews={news} />
        </>
    )
}
