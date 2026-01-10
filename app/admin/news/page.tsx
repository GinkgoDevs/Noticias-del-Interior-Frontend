import Link from "next/link"
import { getUserProfile } from "@/lib/auth"
import { fetchApi } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { NewsTable } from "@/components/admin/news-table"

export default async function NewsPage() {
  const profile = await getUserProfile()

  if (!profile) return null;

  // Fetch news from NestJS API
  // If not admin, we might need a specific filter, but the backend NewsService.findAll 
  // currently takes a query object. Let's see if we should filter here or in backend.
  // The backend NewsService.findAll doesn't filter by authorId unless specified in query.

  const queryParams = new URLSearchParams();
  if (profile.role !== "admin") {
    queryParams.append("authorId", profile.id);
  }

  // Note: Backend findAll returns { data: { items, meta } }
  const response = await fetchApi(`/admin/news?${queryParams.toString()}`);
  const news = response.data?.items || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Noticias</h1>
          <p className="text-slate-600 mt-1">Gestiona todas tus noticias</p>
        </div>
        <Button asChild>
          <Link href="/admin/news/create">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Noticia
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas las Noticias</CardTitle>
        </CardHeader>
        <CardContent>
          <NewsTable news={news} />
        </CardContent>
      </Card>
    </div>
  )
}
