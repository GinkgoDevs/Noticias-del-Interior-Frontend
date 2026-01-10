import { getUserProfile } from "@/lib/auth"
import { fetchApi } from "@/lib/api-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, FolderOpen, Eye } from "lucide-react"

export default async function AdminDashboard() {
  const profile = await getUserProfile()

  if (!profile) return null;

  const isAdmin = profile?.role === "admin"

  // Fetch all stats in one go from our new NestJS endpoint
  const response = await fetchApi("/admin/news/dashboard");
  const stats = response.data || {};

  // We also need categories count for admins
  let categoriesCount = 0;
  if (isAdmin) {
    const categoriesResponse = await fetchApi("/categories");
    categoriesCount = categoriesResponse.data?.length || 0;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Bienvenido de vuelta, {profile?.full_name || profile?.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Noticias</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total || 0}</div>
            <p className="text-xs text-muted-foreground">{isAdmin ? "Todas las noticias" : "Tus noticias"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publicadas</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.published || 0}</div>
            <p className="text-xs text-muted-foreground">Visibles al público</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Borradores</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draft || 0}</div>
            <p className="text-xs text-muted-foreground">En proceso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorías</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoriesCount || 0}</div>
            <p className="text-xs text-muted-foreground">Organizadas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Noticias Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recent && stats.recent.length > 0 ? (
            <div className="space-y-4">
              {stats.recent.map((news: any) => (
                <div key={news.id} className="flex items-start justify-between border-b pb-4 last:border-0">
                  <div className="space-y-1">
                    <h3 className="font-medium text-slate-900">{news.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{news.category?.name || "Sin categoría"}</span>
                      <span>•</span>
                      <span>{news.author?.fullName || news.author?.email || "Autor desconocido"}</span>
                      <span>•</span>
                      <span className="capitalize">{news.status}</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(news.createdAt).toLocaleDateString("es-ES")}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No hay noticias todavía</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
