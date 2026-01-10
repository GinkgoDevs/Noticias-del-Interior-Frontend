import { fetchApi } from "@/lib/api-client"
import { NewsForm } from "@/components/admin/news-form"

export const dynamic = "force-dynamic"

export default async function CreateNewsPage() {
  // Get all categories from NestJS API
  const categories = await fetchApi("/categories")

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Nueva Noticia</h1>
        <p className="text-slate-600 mt-1">Crea una nueva noticia para tu sitio</p>
      </div>

      <NewsForm categories={categories.data || []} />
    </div>
  )
}
