import { Crossword } from "@/components/games/crossword"
import { Calendar, Gamepad2, Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
    title: "Crucigrama Diario | Noticias del Interior",
    description: "Desafía tu mente con el crucigrama diario de Noticias del Interior. Palabras sobre actualidad, cultura y más.",
}

export default function CrucigramaPage() {
    const today = new Date().toLocaleDateString("es-AR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
            <div className="bg-primary/5 border-b border-primary/10">
                <div className="container mx-auto px-4 py-8 md:py-12">
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-2 text-primary font-medium mb-3">
                            <Gamepad2 className="h-5 w-5" />
                            <span>Juegos Diarios</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
                            Crucigrama Diario
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                            <div className="flex items-center gap-2 bg-card px-3 py-1 rounded-full shadow-sm border border-border">
                                <Calendar className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium capitalize">{today}</span>
                            </div>
                            <p className="text-sm italic">
                                Un nuevo desafío cada día, generado automáticamente para ti.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto space-y-12">
                    <Crossword />

                    <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-border">
                        <div className="space-y-4">
                            <h3 className="text-xl font-serif font-bold flex items-center gap-2">
                                <Info className="h-5 w-5 text-primary" />
                                Cómo jugar
                            </h3>
                            <ul className="space-y-2 text-muted-foreground">
                                <li className="flex gap-2">
                                    <span className="font-bold text-primary">•</span>
                                    Haz clic en cualquier celda para empezar a escribir.
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-bold text-primary">•</span>
                                    Usa las definiciones a la derecha para adivinar las palabras.
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-bold text-primary">•</span>
                                    Puedes usar el botón de "Pistas" si te quedas atascado (tienes 3 por día).
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-bold text-primary">•</span>
                                    El tablero se pondrá verde automáticamente cuando lo completes correctamente.
                                </li>
                            </ul>
                        </div>

                        <Card className="bg-slate-900 dark:bg-slate-900 text-white border-none shadow-2xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                                <Gamepad2 className="h-32 w-32" />
                            </div>
                            <CardContent className="p-8 space-y-4 relative z-10">
                                <h3 className="text-2xl font-serif font-bold">¿Buscas más desafíos?</h3>
                                <p className="text-slate-300">
                                    Cada medianoche publicamos nuevos sudokus y wordles para que nunca pares de entrenar tu cerebro.
                                </p>
                                <div className="flex gap-4 pt-2">
                                    <a href="/juegos" className="text-white font-bold underline underline-offset-4 hover:text-primary transition-colors">
                                        Ver todos los juegos →
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
