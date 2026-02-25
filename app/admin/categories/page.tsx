import { hasRole } from "@/lib/auth"
import { redirect } from "next/navigation"
import { fetchApi } from "@/lib/api-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CategoriesTable } from "@/components/admin/categories-table"
import { CreateCategoryDialog } from "@/components/admin/create-category-dialog"

export const dynamic = "force-dynamic"

export default async function CategoriesPage() {
  // Only admins can access this page
  const isAdmin = await hasRole("admin")
  if (!isAdmin) {
    redirect("/admin")
  }

  // Get all categories from NestJS
  const response = await fetchApi("/categories");
  const categories = response.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categorías</h1>
          <p className="text-muted-foreground mt-1">Organiza tus noticias por categorías</p>
        </div>
        <CreateCategoryDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas las Categorías</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoriesTable categories={categories || []} />
        </CardContent>
      </Card>
    </div>
  )
}
