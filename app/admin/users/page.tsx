import { hasRole } from "@/lib/auth"
import { redirect } from "next/navigation"
import { fetchApi } from "@/lib/api-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UsersTable } from "@/components/admin/users-table"
import { InviteUserDialog } from "@/components/admin/invite-user-dialog"

export default async function UsersPage() {
  // Only admins can access this page
  const isAdmin = await hasRole("admin")
  if (!isAdmin) {
    redirect("/admin")
  }

  // Get all users from NestJS
  const response = await fetchApi("/users");
  const users = response.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
          <p className="text-muted-foreground mt-1">Gestiona los usuarios y sus roles</p>
        </div>
        <InviteUserDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos los Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <UsersTable users={users || []} />
        </CardContent>
      </Card>
    </div>
  )
}
