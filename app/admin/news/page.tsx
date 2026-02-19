import Link from "next/link"
import { getUserProfile } from "@/lib/auth"
import { fetchApi } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { NewsTable } from "@/components/admin/news-table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash2, FileText } from "lucide-react"

export default async function NewsPage(props: {
  searchParams: Promise<{ deleted?: string }>
}) {
  const searchParams = await props.searchParams;
  const isTrash = searchParams.deleted === "true";
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

  if (isTrash) {
    queryParams.append("withDeleted", "true");
  }

  // Note: Backend findAll returns { data: { items, meta } }
  const response = await fetchApi(`/admin/news?${queryParams.toString()}`);
  const allNews = response.data?.items || [];

  // For the trash view, we only want to show the deleted items
  // For the active view, we only want to show the non-deleted items (default behavior)
  const news = isTrash
    ? allNews.filter((n: any) => n.deletedAt !== null)
    : allNews.filter((n: any) => n.deletedAt === null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Noticias</h1>
          <p className="text-muted-foreground mt-1">Gestiona todas tus noticias</p>
        </div>
        <Button asChild>
          <Link href="/admin/news/create">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Noticia
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Listado de Noticias</CardTitle>
            <Tabs defaultValue={isTrash ? "trash" : "active"} className="w-[400px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="active" asChild>
                  <Link href="/admin/news">
                    <FileText className="h-4 w-4 mr-2" />
                    Activas
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="trash" asChild>
                  <Link href="/admin/news?deleted=true">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Papelera
                  </Link>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <NewsTable news={news} showDeleted={isTrash} />
        </CardContent>
      </Card>
    </div>
  )
}
