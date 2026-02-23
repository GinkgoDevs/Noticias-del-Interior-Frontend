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
import { Trash2, Tag, Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

const ITEMS_PER_PAGE = 10;

interface TagsTableProps {
    tags: any[]
}

export function TagsTable({ tags }: TagsTableProps) {
    const router = useRouter()
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [deleting, setDeleting] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)

    // Filter tags based on search query
    const filteredTags = tags.filter((tag) => {
        const searchLower = searchQuery.toLowerCase()
        return (
            tag.name.toLowerCase().includes(searchLower) ||
            (tag.slug && tag.slug.toLowerCase().includes(searchLower))
        )
    })

    // Calculate pagination
    const totalPages = Math.ceil(filteredTags.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedTags = filteredTags.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    // Reset to page 1 when searching
    const handleSearchChange = (query: string) => {
        setSearchQuery(query)
        setCurrentPage(1)
    }

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

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar etiquetas por nombre o slug..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                />
            </div>

            {filteredTags.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-muted/10">
                    <Tag className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">No se encontraron etiquetas que coincidan.</p>
                </div>
            ) : (
                <>
                    <div className="rounded-md border overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[40%]">Nombre</TableHead>
                                    <TableHead className="w-[30%]">Slug</TableHead>
                                    <TableHead className="w-[15%] text-center">Estado</TableHead>
                                    <TableHead className="w-[15%] text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedTags.map((tag) => (
                                    <TableRow key={tag.id} className="animate-in fade-in duration-500">
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <Tag className="h-4 w-4 text-primary opacity-70" />
                                                <span className="truncate">{tag.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground break-all">
                                                {tag.slug}
                                            </code>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {tag.active ? (
                                                <Badge className="bg-green-500/10 text-green-600 border-none text-[10px]">Activa</Badge>
                                            ) : (
                                                <Badge variant="outline" className="opacity-50 text-[10px]">Inactiva</Badge>
                                            )}
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
                    </div>

                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
                            <p className="text-xs text-muted-foreground">
                                Mostrando {startIndex + 1} a {Math.min(startIndex + ITEMS_PER_PAGE, filteredTags.length)} de{" "}
                                {filteredTags.length} etiquetas
                            </p>
                            <Pagination className="mx-0 w-auto">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                if (currentPage > 1) setCurrentPage(currentPage - 1)
                                            }}
                                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>

                                    {Array.from({ length: totalPages }).map((_, i) => {
                                        const page = i + 1
                                        if (
                                            page === 1 ||
                                            page === totalPages ||
                                            (page >= currentPage - 1 && page <= currentPage + 1)
                                        ) {
                                            return (
                                                <PaginationItem key={page}>
                                                    <PaginationLink
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            setCurrentPage(page)
                                                        }}
                                                        isActive={currentPage === page}
                                                        className="cursor-pointer text-xs h-8 w-8"
                                                    >
                                                        {page}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            )
                                        } else if (
                                            page === currentPage - 2 ||
                                            page === currentPage + 2
                                        ) {
                                            return (
                                                <PaginationItem key={page}>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            )
                                        }
                                        return null
                                    })}

                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                                            }}
                                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </>
            )}

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
        </div>
    )
}
