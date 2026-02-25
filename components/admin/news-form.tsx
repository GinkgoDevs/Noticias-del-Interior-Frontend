"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { fetchApi, API_URL } from "@/lib/api-client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Globe, FileText, Image as ImageIcon, Star, Clock, Trash2, Plus, Eye, Type } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import dynamic from "next/dynamic"
import "react-quill-new/dist/quill.snow.css"
import { SEOPreview } from "./seo-preview"
import { uploadImageAction } from "@/lib/actions"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, X } from "lucide-react"
import { toast } from "sonner"
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-muted animate-pulse rounded-md" />,
})

interface NewsFormProps {
  categories: any[]
  tags?: any[]
  initialData?: any
}

export function NewsForm({ categories, tags, initialData }: NewsFormProps) {
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
    mainImageCaption: initialData?.mainImageCaption || "",
    categoryId: initialData?.category?.id || initialData?.categoryId || "",
    status: (initialData?.status || "draft").toLowerCase(),
    featured: initialData?.featured || false,
    scheduledAt: initialData?.scheduledAt || "",
    seoTitle: initialData?.seoTitle || "",
    seoDescription: initialData?.seoDescription || "",
    tagIds: initialData?.tags?.map((t: any) => t.id) || [],
    images: initialData?.images || [],
  })
  const [isScheduled, setIsScheduled] = useState(!!initialData?.scheduledAt)
  const [showPreview, setShowPreview] = useState(false)
  const [availableTags, setAvailableTags] = useState<any[]>(tags || [])
  const [tagSearch, setTagSearch] = useState("")
  const [openTags, setOpenTags] = useState(false)
  const [availableCategories, setAvailableCategories] = useState<any[]>(categories || [])
  const [categorySearch, setCategorySearch] = useState("")
  const [openCategories, setOpenCategories] = useState(false)

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

  const handleToggleTag = (tagId: string) => {
    setFormData((prev) => {
      const newTagIds = prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id: string) => id !== tagId)
        : [...prev.tagIds, tagId]
      return { ...prev, tagIds: newTagIds }
    })
  }

  const handleCreateTag = async (tagName: string) => {
    if (!tagName.trim()) return

    try {
      setLoading(true)
      const slug = generateSlug(tagName)
      // Check if tag already exists
      const exists = availableTags.find(t => t.slug === slug || t.name.toLowerCase() === tagName.toLowerCase())
      if (exists) {
        if (!formData.tagIds.includes(exists.id)) {
          handleToggleTag(exists.id)
        }
        setTagSearch("")
        return
      }

      const res: any = await fetchApi("/admin/tags", {
        method: "POST",
        body: JSON.stringify({ name: tagName, slug, active: true }),
      })
      const newTag = res.data || res
      setAvailableTags(prev => [...prev, newTag])
      setFormData(prev => ({ ...prev, tagIds: [...prev.tagIds, newTag.id] }))
      setTagSearch("")
    } catch (err: any) {
      console.error(err)
      setError("Error al crear la etiqueta")
      toast.error("Error al crear la etiqueta", { position: "top-center" })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCategory = async (catName: string) => {
    if (!catName.trim()) return

    try {
      setLoading(true)
      const slug = generateSlug(catName)
      // Check if category already exists
      const exists = availableCategories.find(c => c.slug === slug || c.name.toLowerCase() === catName.toLowerCase())
      if (exists) {
        setFormData(prev => ({ ...prev, categoryId: exists.id }))
        setCategorySearch("")
        return
      }

      const res: any = await fetchApi("/categories", {
        method: "POST",
        body: JSON.stringify({ name: catName, description: "" }),
      })
      const newCat = res.data || res
      setAvailableCategories(prev => [...prev, newCat])
      setFormData(prev => ({ ...prev, categoryId: newCat.id }))
      setCategorySearch("")
      router.refresh() // Refrescar para que aparezca en otras partes
    } catch (err: any) {
      console.error(err)
      setError("Error al crear la categoría")
      toast.error("Error al crear la categoría", { position: "top-center" })
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const res = await uploadImageAction(formDataUpload);

      if (!res.success) throw new Error(res.message);

      setFormData((prev) => ({
        ...prev,
        mainImageUrl: res.data.url,
        mainImageId: res.data.publicId
      }));
    } catch (err: any) {
      const errorMsg = "Error al subir la imagen: " + (err.message || "")
      setError(errorMsg);
      toast.error(errorMsg, { position: "top-center" });
      console.error(err);
    } finally {
      setUploading(false);
    }
  }
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadedImages: any[] = [];
      for (let i = 0; i < files.length; i++) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', files[i]);

        const res = await uploadImageAction(formDataUpload);

        if (!res.success) throw new Error(res.message || 'Error al subir una de las imágenes');

        uploadedImages.push({
          url: res.data.url,
          publicId: res.data.publicId,
          position: formData.images.length + i
        });
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImages]
      }));
    } catch (err: any) {
      const errorMsg = "Error al subir imágenes a la galería: " + (err.message || "")
      setError(errorMsg)
      toast.error(errorMsg, { position: "top-center" })
    } finally {
      setUploading(false);
    }
  }

  const removeGalleryImage = (publicId: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img: any) => img.publicId !== publicId)
    }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error("El título es obligatorio.", { position: "top-center", duration: 3000 })
      return
    }

    const strippedContent = formData.content.replace(/<[^>]*>?/gm, '').trim()
    if (!strippedContent) {
      toast.error("El contenido de la noticia es obligatorio.", { position: "top-center", duration: 3000 })
      return
    }

    if (!formData.categoryId) {
      toast.error("Debes clasificar la noticia y elegir una categoría.", { position: "top-center", duration: 3000 })
      return
    }

    if (!formData.status) {
      toast.error("Debes asignar un estado a la noticia.", { position: "top-center", duration: 3000 })
      return
    }

    setLoading(true)
    setError(null)

    const payload: any = {
      ...formData,
      status: formData.status.toUpperCase(),
    }

    // Limpiar scheduledAt si no está activado el switch o si es una cadena vacía
    if (!isScheduled || !formData.scheduledAt) {
      payload.scheduledAt = null;
    } else {
      try {
        // Asegurar formato ISO 8601 completo
        payload.scheduledAt = new Date(formData.scheduledAt).toISOString();
      } catch (e) {
        const errorMsg = "Fecha de programación inválida";
        setError(errorMsg);
        toast.error(errorMsg, { position: "top-center" });
        setLoading(false);
        return;
      }
    }

    try {
      if (initialData) {
        // Update existing news
        await fetchApi(`/admin/news/${initialData.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        toast.success("Noticia actualizada exitosamente", { position: "top-center" })
      } else {
        // Create new news
        await fetchApi("/admin/news", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Noticia creada exitosamente", { position: "top-center" })
      }

      router.push("/admin/news")
      router.refresh()
    } catch (err: any) {
      const errorMsg = err.message || "Error al guardar la noticia"
      setError(errorMsg)
      toast.error(errorMsg, { position: "top-center", duration: 4000 })
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
            <Label>Contenido *</Label>
            <div className="min-h-[400px] border rounded-md overflow-hidden bg-white text-black">
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "image"],
                    ["clean"],
                  ],
                }}
                className="h-[350px]"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Usa el editor para dar formato a tu noticia.</p>
          </div>

          <Separator className="my-8" />

          <SEOPreview
            title={formData.title}
            slug={formData.slug}
            excerpt={formData.excerpt}
            seoTitle={formData.seoTitle}
            seoDescription={formData.seoDescription}
          />

          <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 space-y-4">
            <h4 className="text-sm font-bold flex items-center gap-2 text-primary">
              <Globe className="h-4 w-4" /> Personalización SEO (Opcional)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle" className="text-xs">Título SEO</Label>
                <Input
                  id="seoTitle"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  placeholder="Personaliza el título para buscadores"
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoDescription" className="text-xs">Descripción SEO</Label>
                <Textarea
                  id="seoDescription"
                  value={formData.seoDescription}
                  onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                  placeholder="Personaliza la meta-descripción"
                  className="min-h-[32px] text-sm py-1"
                  rows={1}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Imagen destacada principal</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="flex-1 cursor-pointer"
                  />
                  {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
                </div>
                <p className="text-xs text-muted-foreground">Esta imagen aparecerá en los listados y en la cabecera de la noticia.</p>
              </div>

              {formData.mainImageUrl && (
                <div className="space-y-2">
                  <div className="relative group rounded-lg border overflow-hidden bg-muted aspect-video">
                    <img
                      src={formData.mainImageUrl || "/placeholder.svg"}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => setFormData({ ...formData, mainImageUrl: '', mainImageId: '', mainImageCaption: '' })}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Type className="h-4 w-4 text-muted-foreground shrink-0" />
                    <Input
                      value={formData.mainImageCaption}
                      onChange={(e) => setFormData({ ...formData, mainImageCaption: e.target.value })}
                      placeholder="Pie de foto: Ej. Foto: Juan Pérez / Fuente"
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-bold flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" /> Galería de Imágenes
                </Label>
                <p className="text-xs text-muted-foreground">Añade fotos adicionales para crear una galería dentro de la nota.</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('gallery-upload')?.click()}
                disabled={uploading}
              >
                <Plus className="h-4 w-4 mr-2" /> Añadir Fotos
              </Button>
              <input
                id="gallery-upload"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleGalleryUpload}
              />
            </div>

            {formData.images.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formData.images.map((img: any, index: number) => (
                  <div key={img.publicId || index} className="space-y-2">
                    <div className="relative group rounded-lg border overflow-hidden aspect-square bg-muted">
                      <img
                        src={img.url}
                        alt={img.caption || `Gallery ${index}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removeGalleryImage(img.publicId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Input
                      value={img.caption || ""}
                      onChange={(e) => {
                        const newImages = [...formData.images];
                        newImages[index] = { ...newImages[index], caption: e.target.value };
                        setFormData({ ...formData, images: newImages });
                      }}
                      placeholder="Pie de foto..."
                      className="h-7 text-xs"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-muted-foreground bg-muted/20">
                <ImageIcon className="h-10 w-10 mb-2 opacity-20" />
                <p className="text-sm">No hay imágenes en la galería</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Popover open={openCategories} onOpenChange={setOpenCategories}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCategories}
                    className="w-full justify-between font-normal"
                  >
                    {formData.categoryId
                      ? availableCategories.find((cat) => cat.id === formData.categoryId)?.name
                      : "Seleccionar categoría..."}
                    <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Buscar o crear categoría..."
                      value={categorySearch}
                      onValueChange={setCategorySearch}
                    />
                    <CommandList>
                      <CommandEmpty>
                        {categorySearch.trim() !== "" ? (
                          <div
                            className="p-2 text-sm flex items-center gap-2 cursor-pointer hover:bg-muted text-primary font-medium"
                            onClick={() => {
                              handleCreateCategory(categorySearch)
                              setOpenCategories(false)
                            }}
                          >
                            <Plus className="h-4 w-4" /> Crear "{categorySearch}"
                          </div>
                        ) : (
                          "No se encontraron categorías."
                        )}
                      </CommandEmpty>
                      <CommandGroup className="max-h-[300px] overflow-auto">
                        {availableCategories.map((cat) => (
                          <CommandItem
                            key={cat.id}
                            value={cat.name}
                            onSelect={() => {
                              setFormData({ ...formData, categoryId: cat.id })
                              setOpenCategories(false)
                              setCategorySearch("")
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.categoryId === cat.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {cat.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
                disabled={isScheduled}
              >
                <SelectTrigger className={cn(isScheduled && "bg-muted cursor-not-allowed opacity-70")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Borrador</SelectItem>
                  <SelectItem value="published">Publicado</SelectItem>
                  <SelectItem value="archived">Archivado</SelectItem>
                </SelectContent>
              </Select>
              {isScheduled && (
                <p className="text-[10px] text-orange-600 font-medium">
                  Bloqueado en Borrador para programación.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4 border-t pt-6">
            <Label className="flex items-center gap-2">
              <Star className="h-4 w-4" /> Etiquetas (Tags)
            </Label>

            <div className="flex flex-col gap-3">
              <Popover open={openTags} onOpenChange={setOpenTags}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={openTags} className="w-full justify-between sm:max-w-[400px]">
                    Añadir etiquetas...
                    <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full sm:max-w-[400px] p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Buscar etiqueta existente..."
                      value={tagSearch}
                      onValueChange={setTagSearch}
                    />
                    <CommandList>
                      <CommandEmpty>
                        {tagSearch.trim() !== "" ? (
                          <div
                            className="p-2 text-sm flex items-center gap-2 cursor-pointer hover:bg-muted"
                            onClick={() => {
                              handleCreateTag(tagSearch)
                              setOpenTags(false)
                            }}
                          >
                            <Plus className="h-4 w-4" /> Crear "{tagSearch}"
                          </div>
                        ) : "No se encontraron etiquetas que coincidan."}
                      </CommandEmpty>
                      <CommandGroup className="max-h-[200px] overflow-auto">
                        {/* We filter matching available tags and the command input handles internal search, 
                            but we can also just let CommandItem do its default filtering */}
                        {availableTags.map((tag) => {
                          const isSelected = formData.tagIds.includes(tag.id)
                          return (
                            <CommandItem
                              key={tag.id}
                              value={tag.name}
                              onSelect={() => {
                                handleToggleTag(tag.id)
                                setTagSearch("")
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  isSelected ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {tag.name}
                            </CommandItem>
                          )
                        })}
                        {tagSearch.trim() !== "" && !availableTags.find(t => t.name.toLowerCase() === tagSearch.toLowerCase()) && (
                          <CommandItem
                            value={`Crear ${tagSearch}`}
                            onSelect={() => {
                              handleCreateTag(tagSearch)
                              setOpenTags(false)
                            }}
                            className="text-primary font-medium border-t rounded-none"
                          >
                            <Plus className="mr-2 h-4 w-4" /> Crear "{tagSearch}"
                          </CommandItem>
                        )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <div className="flex flex-wrap gap-2">
                {formData.tagIds.map((tagId: string) => {
                  const tag = availableTags.find(t => t.id === tagId)
                  if (!tag) return null
                  return (
                    <Badge
                      key={tag.id}
                      variant="default"
                      className="px-3 py-1 bg-primary/20 text-primary hover:bg-primary/30 border-primary/20 flex items-center gap-1 shadow-sm"
                    >
                      {tag.name}
                      <X
                        className="h-3.5 w-3.5 ml-1 cursor-pointer hover:text-red-500 transition-colors opacity-70 hover:opacity-100"
                        onClick={() => handleToggleTag(tag.id)}
                      />
                    </Badge>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 bg-primary/5 p-4 rounded-lg border border-primary/20">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
              />
              <div className="space-y-0.5">
                <Label htmlFor="featured" className="flex items-center gap-2 cursor-pointer">
                  <Star className={cn("h-4 w-4", formData.featured ? "fill-primary text-primary" : "text-muted-foreground")} />
                  Noticia Destacada (Hero)
                </Label>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  Aparecerá en el encabezado principal de la Home.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 p-4 rounded-lg bg-orange-50/50 border border-orange-200">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isScheduled"
                  checked={isScheduled}
                  onCheckedChange={(checked) => {
                    setIsScheduled(checked)
                    if (checked) {
                      setFormData({ ...formData, status: "draft" })
                    }
                  }}
                />
                <div className="space-y-0.5">
                  <Label htmlFor="isScheduled" className="flex items-center gap-2 cursor-pointer font-bold text-orange-700">
                    <Clock className="h-4 w-4" />
                    Programar Noticia
                  </Label>
                  <p className="text-xs text-orange-600 line-clamp-1">
                    Publicación automática en fecha/hora.
                  </p>
                </div>
              </div>

              {isScheduled && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  <Input
                    type="datetime-local"
                    value={formData.scheduledAt ? formData.scheduledAt.substring(0, 16) : ""}
                    onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                    className="bg-white border-orange-200 focus:ring-orange-500 h-8 text-xs"
                    min={new Date().toISOString().substring(0, 16)}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-4 border-t">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button type="submit" disabled={loading || uploading} className={cn("w-full sm:w-auto", isScheduled && "bg-orange-600 hover:bg-orange-700")}>
                {loading ? "Guardando..." :
                  isScheduled ? "Programar Noticia" :
                    initialData ? "Actualizar Noticia" : "Crear Noticia"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading} className="w-full sm:w-auto">
                Cancelar
              </Button>
            </div>

            <Button type="button" variant="secondary" onClick={() => setShowPreview(true)} className="flex items-center justify-center gap-2 w-full md:w-auto">
              <Eye className="h-4 w-4" /> Vista Previa
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Previsualización */}
      {showPreview && (
        <div className="fixed inset-0 z-[100] bg-background flex flex-col animate-in fade-in duration-300">
          <header className="h-16 border-b flex items-center justify-between px-6 bg-card shrink-0">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="uppercase tracking-widest text-[10px]">Previsualización</Badge>
              <h2 className="font-bold truncate max-w-[400px]">{formData.title || 'Sin título'}</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
              Cerrar Previsualización
            </Button>
          </header>

          <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
            <div className="max-w-4xl mx-auto bg-white dark:bg-card min-h-full shadow-xl p-6 md:p-12">
              <div className="space-y-6">
                <Badge className="bg-primary">{categories.find(c => c.id === formData.categoryId)?.name || 'Categoría'}</Badge>
                <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight">{formData.title || 'Título de la Noticia'}</h1>
                <p className="text-xl text-muted-foreground font-medium italic border-l-4 border-primary pl-4">{formData.excerpt}</p>

                {formData.mainImageUrl && (
                  <figure>
                    <img src={formData.mainImageUrl} className="w-full rounded-xl shadow-lg border" alt="Main" />
                    {formData.mainImageCaption && (
                      <figcaption className="text-sm text-muted-foreground italic mt-2 text-center">{formData.mainImageCaption}</figcaption>
                    )}
                  </figure>
                )}

                <div className="prose prose-lg dark:prose-invert max-w-none ql-editor !p-0" dangerouslySetInnerHTML={{ __html: formData.content }} />

                {formData.images.length > 0 && (
                  <div className="mt-12 space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-6 w-1 bg-primary rounded-full" />
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-primary" /> Galería de Imágenes
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.images.map((img: any, i: number) => (
                        <figure key={i}>
                          <div className="relative aspect-video rounded-lg overflow-hidden border shadow-sm bg-muted">
                            <img src={img.url} className="w-full h-full object-cover" alt={img.caption || "Gallery"} />
                          </div>
                          {img.caption && (
                            <figcaption className="text-sm text-muted-foreground italic mt-2 text-center">{img.caption}</figcaption>
                          )}
                        </figure>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}
