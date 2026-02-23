"use server"

import { revalidatePath } from "next/cache"
import { API_URL } from "./api-client"
import { z } from "zod"

const newsletterSchema = z.object({
    email: z.string().email("Email no válido"),
})

export type NewsletterState = {
    success: boolean;
    message: string;
    errors?: {
        email?: string[];
    };
}

export async function subscribeToNewsletter(prevState: NewsletterState, formData: FormData): Promise<NewsletterState> {
    const email = formData.get("email")?.toString()

    const validatedFields = newsletterSchema.safeParse({ email })

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Datos inválidos",
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    try {
        const res = await fetch(`${API_URL}/newsletter/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: validatedFields.data.email })
        })

        const data = await res.json()

        if (res.ok) {
            revalidatePath('/')
            return { success: true, message: data.message || "¡Suscripción exitosa!" }
        } else {
            return { success: false, message: data.message || "No se pudo realizar la suscripción" }
        }
    } catch (error) {
        return { success: false, message: "Error de conexión con el servidor" }
    }
}

const categorySchema = z.object({
    name: z.string().min(2, "El nombre es muy corto"),
    slug: z.string().min(2, "El slug es muy corto"),
    description: z.string().optional(),
})

export type CategoryState = {
    success: boolean;
    message: string;
    errors?: {
        name?: string[];
        slug?: string[];
    };
}

export async function createCategoryAction(prevState: CategoryState, formData: FormData): Promise<CategoryState> {
    const data = {
        name: formData.get("name")?.toString(),
        slug: formData.get("slug")?.toString(),
        description: formData.get("description")?.toString(),
    }

    const validatedFields = categorySchema.safeParse(data)

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Datos inválidos",
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    try {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        const { slug, ...payload } = validatedFields.data;
        const res = await fetch(`${API_URL}/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })

        const result = await res.json()

        if (res.ok) {
            revalidatePath('/admin/categories')
            return { success: true, message: "Categoría creada con éxito" }
        } else {
            return { success: false, message: result.message || "Error al crear categoría" }
        }
    } catch (error) {
        return { success: false, message: "Error de conexión" }
    }
}

export async function deleteCategoryAction(id: string) {
    try {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        const res = await fetch(`${API_URL}/categories/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (res.ok) {
            revalidatePath('/admin/categories')
            return { success: true, message: "Categoría eliminada" }
        } else {
            const data = await res.json()
            return { success: false, message: data.message || "Error al eliminar" }
        }
    } catch (error) {
        return { success: false, message: "Error de conexión" }
    }
}

/**
 * IMAGES
 */
export async function uploadImageAction(formData: FormData) {
    try {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        const res = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        })

        const result = await res.json()

        if (res.ok) {
            return { success: true, data: result.data }
        } else {
            return { success: false, message: result.message || "Error al subir imagen" }
        }
    } catch (error) {
        return { success: false, message: "Error de conexión" }
    }
}

/**
 * TAGS
 */
const tagSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
})

export async function createTagAction(prevState: any, formData: FormData) {
    const name = formData.get("name")?.toString()
    const validated = tagSchema.safeParse({ name })

    if (!validated.success) {
        return { success: false, message: "Nombre inválido", errors: validated.error.flatten().fieldErrors }
    }

    try {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        const res = await fetch(`${API_URL}/admin/tags`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(validated.data)
        })

        if (res.ok) {
            revalidatePath('/admin/tags')
            return { success: true, message: "Tag creado" }
        } else {
            const data = await res.json()
            return { success: false, message: data.message || "Error al crear tag" }
        }
    } catch (error) {
        return { success: false, message: "Error de conexión" }
    }
}

export async function deleteTagAction(id: string) {
    try {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        const res = await fetch(`${API_URL}/admin/tags/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (res.ok) {
            revalidatePath('/admin/tags')
            return { success: true, message: "Tag eliminado" }
        } else {
            return { success: false, message: "Error al eliminar" }
        }
    } catch (error) {
        return { success: false, message: "Error de conexión" }
    }
}
