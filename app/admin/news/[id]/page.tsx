import { redirect } from "next/navigation"
import { getUserProfile } from "@/lib/auth"
import { NewsForm } from "@/components/admin/news-form"
import { fetchApi } from "@/lib/api-client"

async function getNewsItem(id: string) {
  try {
    const res = await fetchApi(`/news/${id}`);
    if (!res.success) return null;
    return res.data;
  } catch (error) {
    return null;
  }
}

async function getCategories() {
  try {
    const res = await fetchApi(`/categories`);
    if (!res.success) return [];
    return res.data;
  } catch (error) {
    return [];
  }
}

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const profile = await getUserProfile()
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // Get the news item
  const news = await getNewsItem(id);

  if (!news) {
    redirect("/admin/news")
  }

  // Check permissions (only author or admin can edit)
  if (profile?.role !== "ADMIN" && news.authorId !== profile?.id) {
    redirect("/admin/news")
  }

  // Get all categories
  const categories = await getCategories()

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Editar Noticia</h1>
        <p className="text-slate-600 mt-1">Actualiza la información de tu noticia</p>
      </div>

      <NewsForm categories={categories} initialData={news} />
    </div>
  )
}
