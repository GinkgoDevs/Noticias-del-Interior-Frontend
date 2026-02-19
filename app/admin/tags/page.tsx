import { hasRole } from "@/lib/auth"
import { redirect } from "next/navigation"
import { fetchApi } from "@/lib/api-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TagsTable } from "@/components/admin/tags-table"
import { CreateTagDialog } from "@/components/admin/create-tag-dialog"

export const dynamic = "force-dynamic"

export default async function TagsPage() {
    // Admins and editors can access tags
    const allowed = await hasRole("admin") || await hasRole("redactor")
    if (!allowed) {
        redirect("/admin")
    }

    // Get all tags from NestJS
    const response = await fetchApi("/admin/tags");
    const tags = response.data || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Etiquetas</h1>
                    <p className="text-muted-foreground mt-1">Gestiona las etiquetas de tus noticias</p>
                </div>
                <CreateTagDialog />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Todas las Etiquetas</CardTitle>
                </CardHeader>
                <CardContent>
                    <TagsTable tags={tags || []} />
                </CardContent>
            </Card>
        </div>
    )
}
