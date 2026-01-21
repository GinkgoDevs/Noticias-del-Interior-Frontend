import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search, ArrowLeft } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center space-y-8">
                <div className="relative">
                    <h1 className="text-[12rem] md:text-[16rem] font-serif font-bold text-primary/10 leading-none select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <h2 className="text-3xl md:text-5xl font-serif font-bold mb-2">Noticia no encontrada</h2>
                        <div className="h-1.5 w-24 bg-primary rounded-full" />
                    </div>
                </div>

                <p className="text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
                    Lo sentimos, la página que estás buscando no existe o ha sido movida.
                    ¿Quizás quieras volver al inicio o realizar una búsqueda?
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link href="/">
                        <Button size="lg" className="rounded-full px-8 gap-2 h-12 text-base shadow-lg shadow-primary/20">
                            <Home className="h-5 w-5" />
                            Ir al Inicio
                        </Button>
                    </Link>
                    <Link href="/buscar">
                        <Button size="lg" variant="outline" className="rounded-full px-8 gap-2 h-12 text-base border-2">
                            <Search className="h-5 w-5" />
                            Buscar Noticias
                        </Button>
                    </Link>
                </div>

                <div className="pt-12">
                    <Button variant="ghost" className="text-muted-foreground gap-2 hover:text-primary transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Vuelve sobre tus pasos
                    </Button>
                </div>
            </div>
        </div>
    )
}
