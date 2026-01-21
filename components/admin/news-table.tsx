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
import { Edit, Trash2, Eye, Star, Plus } from "lucide-react"

interface NewsTableProps {
  news: any[]
  showDeleted?: boolean
}

export function NewsTable({ news, showDeleted = false }: NewsTableProps) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [restoreId, setRestoreId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [restoring, setRestoring] = useState(false)

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

  const handleRestore = async (id: string) => {
    setRestoring(true)
    try {
      await fetchApi(`/admin/news/${id}/restore`, {
        method: "PATCH",
      });
      router.refresh()
    } catch (err) {
      console.error("Error restoring news:", err)
    } finally {
      setRestoring(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
      case "published":
        return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-none transition-colors">Publicado</Badge>
      case "DRAFT":
      case "draft":
        return <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 border-none">Borrador</Badge>
      case "ARCHIVED":
      case "archived":
        return <Badge variant="outline" className="opacity-70">Archivado</Badge>
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
            <TableHead>Home</TableHead>
            <TableHead>Vistas</TableHead>
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
              <TableCell>
                {item.featured ? (
                  <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-none flex items-center gap-1 w-fit">
                    <Star className="h-3 w-3 fill-amber-600" />
                    Hero
                  </Badge>
                ) : (
                  <span className="text-muted-foreground/30">—</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5 font-medium">
                  <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                  {(item.views || 0).toLocaleString()}
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(item.createdAt).toLocaleDateString("es-ES")}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {item.deletedAt ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestore(item.id)}
                      disabled={restoring}
                      title="Restaurar"
                      className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Restaurar
                    </Button>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Enviar a la papelera?</AlertDialogTitle>
            <AlertDialogDescription>
              La noticia será movida a la papelera. Podrás restaurarla más tarde si lo necesitas.
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
