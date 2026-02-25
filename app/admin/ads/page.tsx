'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
    Plus,
    Trash2,
    ExternalLink,
    Eye,
    MousePointerClick,
    Image as ImageIcon,
    Loader2,
    MoreVertical,
    Check,
    X,
    Calendar,
    Clock,
    TrendingUp,
    Pencil
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Image from 'next/image'

interface Ad {
    id: string
    title: string
    imageUrl: string
    linkUrl: string
    position: string
    isActive: boolean
    views: number
    clicks: number
    startDate?: string
    endDate?: string
    createdAt: string
}

const POSITIONS = [
    { value: 'HEADER', label: 'Cabecera superior (Recomendado: 728×90 px o 970×90 px)' },
    { value: 'SIDEBAR', label: 'Barra lateral de Inicio (Recomendado: 300×250 o 300×600 px)' },
    { value: 'ARTICLE_SIDEBAR', label: 'Barra lateral de Noticia (Recomendado: 300×250 o 300×600 px)' },
    { value: 'NEWS_LIST', label: 'Lista de noticias (Recomendado: 728×90 px)' },
    { value: 'CONTENT', label: 'Dentro de la noticia (Recomendado: 728×90 o 300×250 px)' },
    { value: 'FOOTER', label: 'Pie de página (Recomendado: 728×90 px)' },
]

export default function AdsAdminPage() {
    const [ads, setAds] = useState<Ad[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [editingAdId, setEditingAdId] = useState<string | null>(null)
    const { toast } = useToast()

    const defaultForm = {
        title: '',
        imageUrl: '',
        linkUrl: '',
        position: 'NEWS_LIST' as any,
        isActive: true,
        startDate: '',
        endDate: ''
    }

    // Form state
    const [formData, setFormData] = useState(defaultForm)

    useEffect(() => {
        fetchAds()
    }, [])

    const fetchAds = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1'}/ads/admin/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()
            if (Array.isArray(data)) setAds(data)
        } catch (error) {
            console.error('Error fetching ads:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1'}/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            })
            const json = await res.json()
            const data = json.data || json; // Handle wrapped or raw response

            if (data.url) {
                setFormData(prev => ({ ...prev, imageUrl: data.url }))
                toast({ title: "Imagen subida", description: "La publicidad está lista." })
            }
        } catch (error) {
            toast({ title: "Error al subir", variant: "destructive" })
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.imageUrl) return toast({ title: "Sube una imagen primero", variant: "destructive" })

        setIsSubmitting(true)
        try {
            const token = localStorage.getItem('token')
            const url = editingAdId
                ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1'}/ads/${editingAdId}`
                : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1'}/ads`

            const method = editingAdId ? 'PATCH' : 'POST'

            const res = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                toast({ title: editingAdId ? "Publicidad actualizada" : "Publicidad creada exitosamente" })
                setIsModalOpen(false)
                setFormData(defaultForm)
                setEditingAdId(null)
                fetchAds()
            } else {
                const err = await res.json()
                toast({ title: err.message || "Error al guardar", variant: "destructive" })
            }
        } catch (error) {
            toast({ title: "Error al guardar", variant: "destructive" })
        } finally {
            setIsSubmitting(false)
        }
    }

    const toggleActive = async (id: string, currentStatus: boolean) => {
        try {
            const token = localStorage.getItem('token')
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1'}/ads/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isActive: !currentStatus })
            })
            fetchAds()
        } catch (error) {
            toast({ title: "Error al actualizar estado", variant: "destructive" })
        }
    }

    const deleteAd = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta publicidad?')) return
        try {
            const token = localStorage.getItem('token')
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1'}/ads/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            toast({ title: "Publicidad eliminada" })
            fetchAds()
        } catch (error) {
            toast({ title: "Error al eliminar", variant: "destructive" })
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight">Publicidad</h1>
                    <p className="text-muted-foreground">Gestiona los banners y anuncios de la web</p>
                </div>
                <Dialog open={isModalOpen} onOpenChange={(open) => {
                    setIsModalOpen(open)
                    if (!open) {
                        setEditingAdId(null)
                        setFormData(defaultForm)
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button className="gap-2" onClick={() => {
                            setEditingAdId(null)
                            setFormData(defaultForm)
                        }}>
                            <Plus className="h-4 w-4" />
                            Nueva Publicidad
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{editingAdId ? "Editar Anuncio" : "Añadir Anuncio"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Título interno (para rastreo)</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
                                    placeholder="Ej: Promo Verano Coca Cola"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Imagen del anuncio</Label>
                                <div className="flex items-center gap-4">
                                    {formData.imageUrl ? (
                                        <div className="relative w-24 h-24 rounded border overflow-hidden">
                                            <Image src={formData.imageUrl} alt="Preview" fill className="object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setFormData(f => ({ ...f, imageUrl: '' }))}
                                                className="absolute top-0 right-0 bg-destructive text-white p-0.5"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ) : (
                                        <Label
                                            htmlFor="image-upload"
                                            className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent transition-colors"
                                        >
                                            {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Plus className="h-6 w-6 text-muted-foreground" />}
                                            <span className="text-[10px] mt-1">Subir</span>
                                            <Input id="image-upload" type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                                        </Label>
                                    )}
                                    <p className="text-xs text-muted-foreground flex-1">
                                        Formatos recomendados: JPG o PNG. Tamaño según posición.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label>Posición</Label>
                                    <Select
                                        value={formData.position}
                                        onValueChange={v => setFormData(f => ({ ...f, position: v }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {POSITIONS.map(p => (
                                                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="link">Enlace (Opcional)</Label>
                                    <Input
                                        id="link"
                                        value={formData.linkUrl}
                                        onChange={e => setFormData(f => ({ ...f, linkUrl: e.target.value }))}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate">Fecha Inicio (Opcional)</Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={formData.startDate ? formData.startDate.split('T')[0] : ''}
                                        onChange={e => setFormData(f => ({ ...f, startDate: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate">Fecha Vencimiento (Opcional)</Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={formData.endDate ? formData.endDate.split('T')[0] : ''}
                                        onChange={e => setFormData(f => ({ ...f, endDate: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={e => setFormData(f => ({ ...f, isActive: e.target.checked }))}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <Label htmlFor="isActive" className="cursor-pointer">Anuncio habilitado</Label>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                                <Button type="submit" disabled={isSubmitting || uploading}>
                                    {isSubmitting ? "Guardando..." : "Guardar Anuncio"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="border-2 shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="w-[100px]">Imagen</TableHead>
                                <TableHead>Título / Posición</TableHead>
                                <TableHead>Rendimiento (CTR)</TableHead>
                                <TableHead>Programación</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                                    </TableCell>
                                </TableRow>
                            ) : ads.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                        No hay publicidades creadas aún
                                    </TableCell>
                                </TableRow>
                            ) : ads.map((ad) => (
                                <TableRow key={ad.id} className="group transition-colors">
                                    <TableCell>
                                        <div className="relative w-16 h-10 rounded border overflow-hidden bg-muted">
                                            <Image src={ad.imageUrl} alt={ad.title} fill className="object-cover" />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{ad.title}</span>
                                            <span className="text-[10px] text-muted-foreground uppercase">{ad.position}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1 text-xs">
                                                <Eye className="h-3 w-3" /> {ad.views.toLocaleString()} <span className="text-[10px] opacity-60">Vistas</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs">
                                                <MousePointerClick className="h-3 w-3" /> {ad.clicks.toLocaleString()} <span className="text-[10px] opacity-60">Clicks</span>
                                            </div>
                                            <div className="text-[10px] font-bold text-primary flex items-center gap-1">
                                                <TrendingUp className="h-3 w-3" />
                                                {ad.views > 0 ? ((ad.clicks / ad.views) * 100).toFixed(2) : '0'}% CTR
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {ad.startDate || ad.endDate ? (
                                            <div className="flex flex-col gap-1 text-[10px]">
                                                {ad.startDate && (
                                                    <div className="flex items-center gap-1 text-blue-600">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>Inicia: {new Date(ad.startDate).toLocaleDateString()}</span>
                                                    </div>
                                                )}
                                                {ad.endDate && (
                                                    <div className="flex items-center gap-1 text-orange-600">
                                                        <Clock className="h-3 w-3" />
                                                        <span>Vence: {new Date(ad.endDate).toLocaleDateString()}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">Siempre activo</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => toggleActive(ad.id, ad.isActive)}
                                            className={ad.isActive ? "text-green-600 hover:text-green-700 bg-green-50 dark:bg-green-500/10" : "text-muted-foreground bg-muted"}
                                        >
                                            {ad.isActive ? <Check className="h-4 w-4 mr-1" /> : <X className="h-4 w-4 mr-1" />}
                                            {ad.isActive ? "Activo" : "Pausado"}
                                        </Button>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="outline" size="icon" onClick={() => {
                                                setEditingAdId(ad.id)
                                                setFormData({
                                                    title: ad.title,
                                                    imageUrl: ad.imageUrl,
                                                    linkUrl: ad.linkUrl || '',
                                                    position: ad.position as any,
                                                    isActive: ad.isActive,
                                                    startDate: ad.startDate || '',
                                                    endDate: ad.endDate || ''
                                                })
                                                setIsModalOpen(true)
                                            }}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="destructive" size="icon" onClick={() => deleteAd(ad.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-primary/5 border-primary/10">
                    <CardHeader className="py-4">
                        <CardTitle className="text-sm font-medium">Total de Anunciantes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{ads.length}</div>
                    </CardContent>
                </Card>
                <Card className="bg-primary/5 border-primary/10">
                    <CardHeader className="py-4">
                        <CardTitle className="text-sm font-medium">Impresiones Totales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {ads.reduce((acc, ad) => acc + ad.views, 0).toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-primary/5 border-primary/10">
                    <CardHeader className="py-4">
                        <CardTitle className="text-sm font-medium">Clicks Totales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {ads.reduce((acc, ad) => acc + ad.clicks, 0).toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
