"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { fetchApi, API_URL } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

interface NewsFormProps {
  categories: any[]
  initialData?: any
}

export function NewsForm({ categories, initialData }: NewsFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content || "",
    excerpt: initialData?.excerpt || "",
    mainImageUrl: initialData?.mainImageUrl || initialData?.main_image_url || "",
    mainImageId: initialData?.mainImageId || initialData?.main_image_id || "",
    categoryId: initialData?.category?.id || initialData?.categoryId || "",
    status: (initialData?.status || "draft").toLowerCase(),
  })

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      // Using the NestJS upload service
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataUpload
      });

      if (!response.ok) throw new Error('Error al subir la imagen');

      const res = await response.json();
      const payload = res.data; // { url, publicId } from ApiResponse

      setFormData((prev) => ({
        ...prev,
        mainImageUrl: payload.url,
        mainImageId: payload.publicId
      }));
    } catch (err: any) {
      setError("Error al subir la imagen: " + (err.message || ""));
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const payload = {
      ...formData,
      status: formData.status.toUpperCase(),
    }

    try {
      if (initialData) {
        // Update existing news
        await fetchApi(`/admin/news/${initialData.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        // Create new news
        await fetchApi("/admin/news", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      router.push("/admin/news")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Error al guardar la noticia")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6 space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Título de la noticia"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="url-de-la-noticia"
            />
            <p className="text-xs text-muted-foreground">Se genera automáticamente desde el título</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Extracto</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Breve descripción de la noticia"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenido *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Contenido completo de la noticia"
              rows={12}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Imagen destacada</Label>
            <div className="flex items-center gap-4">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="flex-1"
              />
              {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
            {formData.mainImageUrl && (
              <div className="mt-2">
                <img
                  src={formData.mainImageUrl || "/placeholder.svg"}
                  alt="Preview"
                  className="h-32 w-auto rounded-lg border"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Borrador</SelectItem>
                  <SelectItem value="published">Publicado</SelectItem>
                  <SelectItem value="archived">Archivado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Button type="submit" disabled={loading || uploading}>
              {loading ? "Guardando..." : initialData ? "Actualizar Noticia" : "Crear Noticia"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
