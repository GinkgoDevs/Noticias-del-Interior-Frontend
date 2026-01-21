"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function NewsletterForm() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        setLoading(true)
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
            const res = await fetch(`${apiUrl}/newsletter/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })
            const data = await res.json()

            if (res.ok) {
                toast.success(data.message || "¡Suscripción exitosa!")
                setEmail("")
            } else {
                toast.error(data.message || "No se pudo realizar la suscripción")
            }
        } catch (error) {
            toast.error("Error de conexión con el servidor")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <Input
                type="email"
                placeholder="tu@email.com"
                className="bg-background"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <Button
                type="submit"
                className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={loading}
            >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Suscribirme
            </Button>
        </form>
    )
}
