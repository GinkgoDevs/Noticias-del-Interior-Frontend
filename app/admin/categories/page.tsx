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
  const response = await fetchApi("/categories/admin");
  const categories = response.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Categorías</h1>
          <p className="text-slate-600 mt-1">Organiza tus noticias por categorías</p>
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
