import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getUserProfile } from "@/lib/auth"
import { NewsForm } from "@/components/admin/news-form"

export default async function EditNewsPage({ params }: { params: { id: string } }) {
  const supabase = await createServerSupabaseClient()
  const profile = await getUserProfile()
  const { id } = await params

  // Get the news item
  const { data: news } = await supabase.from("news").select("*").eq("id", id).single()

  if (!news) {
    redirect("/admin/news")
  }

  // Check permissions (only author or admin can edit)
  if (profile?.role !== "admin" && news.author_id !== profile?.id) {
    redirect("/admin/news")
  }

  // Get all categories
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Editar Noticia</h1>
        <p className="text-slate-600 mt-1">Actualiza la información de tu noticia</p>
      </div>

      <NewsForm categories={categories || []} initialData={news} />
    </div>
  )
}
