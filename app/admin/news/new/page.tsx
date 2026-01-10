import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NewsForm } from "@/components/admin/news-form"

export default async function NewNewsPage() {
  const supabase = await createServerSupabaseClient()

  // Get all categories
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Nueva Noticia</h1>
        <p className="text-slate-600 mt-1">Crea una nueva noticia para tu sitio</p>
      </div>

      <NewsForm categories={categories || []} />
    </div>
  )
}
