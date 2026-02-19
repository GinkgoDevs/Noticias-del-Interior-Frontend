"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCcw, Home, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Aquí se podría enviar el error a un servicio como Sentry
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center space-y-8 p-8 border-2 border-primary/10 rounded-3xl bg-primary/5 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-primary/10 rounded-full blur-3xl" />

                <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-12">
                    <AlertTriangle className="h-10 w-10 text-primary transform -rotate-12" />
                </div>

                <div className="space-y-4 relative z-10">
                    <h2 className="text-3xl font-serif font-bold">Algo salió mal</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Hemos experimentado un error inesperado. Nuestro equipo técnico ha sido notificado y estamos trabajando para solucionarlo.
                    </p>
                    {error.digest && (
                        <p className="text-xs font-mono text-muted-foreground/50">ID: {error.digest}</p>
                    )}
                </div>

                <div className="flex flex-col gap-3 pt-4 relative z-10">
                    <Button
                        onClick={() => reset()}
                        size="lg"
                        className="rounded-xl h-12 gap-2 shadow-lg shadow-primary/20"
                    >
                        <RefreshCcw className="h-4 w-4" />
                        Reintentar ahora
                    </Button>
                    <Link href="/" className="w-full">
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full rounded-xl h-12 gap-2 border-2"
                        >
                            <Home className="h-4 w-4" />
                            Volver a la Portada
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
