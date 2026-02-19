import { redirect } from "next/navigation"
import { getUserProfile } from "@/lib/auth"
import { fetchApi } from "@/lib/api-client"
import { NewsForm } from "@/components/admin/news-form"

export const dynamic = "force-dynamic"

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const profile = await getUserProfile()
  const { id } = await params

  if (!profile) return null;

  try {
    // Get the news item from NestJS
    const response = await fetchApi(`/admin/news/${id}`);
    const news = response.data;

    // Check permissions (only author or admin can edit)
    // In NestJS, authorId is used instead of author_id
    if (profile?.role !== "admin" && news?.author?.id !== profile?.id) {
      redirect("/admin/news")
    }

    // Get all categories and tags from NestJS
    const [catRes, tagsRes] = await Promise.all([
      fetchApi("/categories"),
      fetchApi("/admin/tags")
    ]);
    const categories = catRes.data || [];

    return (
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Noticia</h1>
          <p className="text-muted-foreground mt-1">Actualiza la información de tu noticia</p>
        </div>

        <NewsForm
          categories={categories}
          initialData={news}
          tags={tagsRes.success ? tagsRes.data : []}
        />
      </div>
    )
  } catch (error) {
    redirect("/admin/news")
  }
}
