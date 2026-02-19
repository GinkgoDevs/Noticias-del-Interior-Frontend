import { fetchApi } from "@/lib/api-client"
import { NewsForm } from "@/components/admin/news-form"

export const dynamic = "force-dynamic"

export default async function CreateNewsPage() {
  // Get all categories and tags from NestJS API
  const [categories, tagsRes] = await Promise.all([
    fetchApi("/categories"),
    fetchApi("/admin/tags")
  ])

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nueva Noticia</h1>
        <p className="text-muted-foreground mt-1">Crea una nueva noticia para tu sitio</p>
      </div>

      <NewsForm
        categories={categories.data || []}
        tags={tagsRes.success ? tagsRes.data : []}
      />
    </div>
  )
}
