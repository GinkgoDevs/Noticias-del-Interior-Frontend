"use client"

import { useState, useTransition, useOptimistic } from "react"
import { useRouter } from "next/navigation"
import { deleteCategoryAction } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Edit, Trash2, Loader2 } from "lucide-react"
import { EditCategoryDialog } from "./edit-category-dialog"
import { toast } from "sonner"

interface CategoriesTableProps {
  categories: any[]
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [editCategory, setEditCategory] = useState<any>(null)

  const [optimisticCategories, removeOptimisticCategory] = useOptimistic(
    categories,
    (state, categoryId: string) => state.filter((c) => c.id !== categoryId)
  )

  const handleDelete = () => {
    if (!deleteId) return

    startTransition(async () => {
      // Update UI immediately
      removeOptimisticCategory(deleteId)

      const result = await deleteCategoryAction(deleteId)

      if (result.success) {
        toast.success(result.message)
        setDeleteId(null)
        router.refresh()
      } else {
        toast.error(result.message)
      }
    })
  }

  if (optimisticCategories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No hay categorías todavía</p>
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Noticias</TableHead>
            <TableHead>Creada</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {optimisticCategories.map((category) => (
            <TableRow key={category.id} className="animate-in fade-in duration-500">
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell>
                <Badge variant="secondary">{category.slug}</Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground max-w-md truncate">
                {category.description || "—"}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{category.newsCount || category.news?.length || 0}</Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(category.createdAt).toLocaleDateString("es-ES")}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setEditCategory(category)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteId(category.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La categoría será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isPending ? "Eliminando..." : "Eliminar ahora"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {editCategory && <EditCategoryDialog category={editCategory} onClose={() => setEditCategory(null)} />}
    </>
  )
}
