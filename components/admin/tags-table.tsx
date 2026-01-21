"use client"

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
import { Trash2, Tag } from "lucide-react"

interface TagsTableProps {
    tags: any[]
}

export function TagsTable({ tags }: TagsTableProps) {
    const router = useRouter()
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [deleting, setDeleting] = useState(false)

    const handleDelete = async () => {
        if (!deleteId) return

        setDeleting(true)
        try {
            // Assuming a DELETE endpoint exists or we handle it
            await fetchApi(`/admin/tags/${deleteId}`, {
                method: "DELETE",
            });

            router.refresh()
            setDeleteId(null)
        } catch (err) {
            console.error("Error deleting tag:", err)
        } finally {
            setDeleting(false)
        }
    }

    if (tags.length === 0) {
        return (
            <div className="text-center py-12">
                <Tag className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No hay etiquetas todavía</p>
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
                        <TableHead>Estado</TableHead>
                        <TableHead>Creada</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tags.map((tag) => (
                        <TableRow key={tag.id}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                    <Tag className="h-4 w-4 text-primary" />
                                    {tag.name}
                                </div>
                            </TableCell>
                            <TableCell>
                                <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                                    {tag.slug}
                                </code>
                            </TableCell>
                            <TableCell>
                                {tag.active ? (
                                    <Badge className="bg-green-500/10 text-green-600 border-none">Activa</Badge>
                                ) : (
                                    <Badge variant="outline" className="opacity-50">Inactiva</Badge>
                                )}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                                {new Date(tag.createdAt).toLocaleDateString("es-ES")}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="sm" onClick={() => setDeleteId(tag.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
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
                            Esta acción no se puede deshacer. La etiqueta será eliminada permanentemente.
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
