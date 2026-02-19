import { getUserProfile } from "@/lib/auth"
import { fetchApi } from "@/lib/api-client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FileText, FolderOpen, Eye, TrendingUp, BarChart3 } from "lucide-react"
import { DashboardCharts } from "@/components/admin/dashboard-charts"

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
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Bienvenido de vuelta, {profile?.full_name || profile?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Noticias</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <FileText className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">{isAdmin ? "Todas las noticias" : "Tus noticias"}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vistas</CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Eye className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.totalViews || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Interacción acumulada</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Borradores</CardTitle>
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <FileText className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draft || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">En proceso editorial</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorías</CardTitle>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <FolderOpen className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoriesCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Secciones activas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de vistas por categoría */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <CardTitle>Vistas por Categoría</CardTitle>
            </div>
            <CardDescription>Distribución de audiencia por sección</CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <DashboardCharts data={stats.viewsByCategory} />
          </CardContent>
        </Card>

        {/* Noticias más leídas */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle>Más Leídas</CardTitle>
            </div>
            <CardDescription>Top noticias con más impacto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.mostViewed && stats.mostViewed.length > 0 ? (
                stats.mostViewed.map((news: any) => (
                  <div key={news.id} className="flex items-center gap-3 border-b border-border pb-3 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{news.title}</p>
                      <p className="text-xs text-muted-foreground">{news.category?.name || "General"}</p>
                    </div>
                    <div className="text-xs font-bold bg-muted px-2 py-1 rounded">
                      {news.views}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-center text-muted-foreground py-10">Sin datos de vistas</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Últimas Noticias Creadas</CardTitle>
          <CardDescription>Actividad reciente en el portal</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recent && stats.recent.length > 0 ? (
            <div className="space-y-4">
              {stats.recent.map((news: any) => (
                <div key={news.id} className="flex items-start justify-between border-b border-border pb-4 last:border-0 hover:bg-muted/50 p-2 rounded-lg transition-colors">
                  <div className="space-y-1">
                    <h3 className="font-medium">{news.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FolderOpen className="h-3 w-3" />
                        {news.category?.name || "Sin categoría"}
                      </span>
                      <span>•</span>
                      <span>{news.author?.fullName || news.author?.email || "Autor desconocido"}</span>
                      <span>•</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${news.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-600' :
                        news.status === 'DRAFT' ? 'bg-orange-500/10 text-orange-600' : 'bg-muted text-muted-foreground'
                        }`}>
                        {news.status === 'PUBLISHED' ? 'Publicada' : news.status === 'DRAFT' ? 'Borrador' : news.status}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap bg-muted px-2 py-1 rounded">
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
