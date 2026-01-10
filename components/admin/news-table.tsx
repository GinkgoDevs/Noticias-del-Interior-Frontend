"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { fetchApi } from "@/lib/api-client"
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
import { Edit, Trash2, Eye } from "lucide-react"

interface NewsTableProps {
  news: any[]
}

export function NewsTable({ news }: NewsTableProps) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleting(true)
    try {
      await fetchApi(`/admin/news/${deleteId}`, {
        method: "DELETE",
      });

      router.refresh()
      setDeleteId(null)
    } catch (err) {
      console.error("Error deleting news:", err)
    } finally {
      setDeleting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
      case "published":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Publicado</Badge>
      case "DRAFT":
      case "draft":
        return <Badge variant="secondary">Borrador</Badge>
      case "ARCHIVED":
      case "archived":
        return <Badge variant="outline">Archivado</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No hay noticias todavía</p>
        <Button asChild>
          <Link href="/admin/news/create">Crear primera noticia</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Autor</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {news.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium max-w-[300px] truncate">{item.title}</TableCell>
              <TableCell>{item.category?.name || "Sin categoría"}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {item.author?.fullName || item.author?.name || item.author?.email}
              </TableCell>
              <TableCell>{getStatusBadge(item.status)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(item.createdAt).toLocaleDateString("es-ES")}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {item.status === "published" && (
                    <Button variant="ghost" size="sm" asChild title="Ver noticia">
                      <Link href={`/news/${item.slug}`} target="_blank">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" asChild title="Editar">
                    <Link href={`/admin/news/edit/${item.id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteId(item.id)} title="Eliminar">
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
              Esta acción no se puede deshacer. La noticia será eliminada permanentemente de la base de datos PostgreSQL.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
