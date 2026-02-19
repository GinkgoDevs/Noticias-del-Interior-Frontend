import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, BarChart3, Users, Target, Rocket } from "lucide-react"
import Link from "next/link"

export default function AnunciarPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main>
                {/* Hero Section */}
                <section className="relative py-20 md:py-32 bg-surface-dark overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-3xl">
                            <Badge variant="outline" className="mb-6 border-primary/40 text-primary px-4 py-1.5 uppercase tracking-widest font-bold">Publicidad & Media</Badge>
                            <h1 className="text-5xl md:text-7xl font-bold mb-8 font-display leading-tight">
                                Conectá tu marca con el <span className="text-primary italic">Interior Argentino</span>.
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl">
                                Llegamos donde otros no llegan. Somos el puente entre las marcas nacionales y los consumidores de todas las provincias del país.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button asChild size="lg" className="h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-bold rounded-xl shadow-xl shadow-primary/20">
                                    <Link href="/contacto">Solicitar Media Kit</Link>
                                </Button>
                                <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-bold border-white/10 hover:bg-white/5 rounded-xl">
                                    Ver Formatos
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>


                {/* Features */}
                <section className="py-24 container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <h2 className="text-4xl font-bold mb-6 font-display">¿Por qué elegirnos?</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Combinamos tecnología de vanguardia con un alcance federal único para asegurar que tu mensaje resuene en cada rincón del país.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="bg-card p-10 rounded-2xl border border-border hover:border-primary/40 transition-colors group">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                                <Users className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Segmentación Geográfica</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Podés dirigir tu pauta a provincias o regiones específicas para optimizar el retorno de tu inversión.
                            </p>
                        </div>

                        <div className="bg-card p-10 rounded-2xl border border-border hover:border-primary/40 transition-colors group">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                                <BarChart3 className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Métricas Transparentes</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Accedé a informes detallados sobre el rendimiento de tus campañas en tiempo real.
                            </p>
                        </div>

                        <div className="bg-card p-10 rounded-2xl border border-border hover:border-primary/40 transition-colors group">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                                <Target className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Formatos de Alto Impacto</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Banners dinámicos, branded content, patrocinios de juegos y coberturas especiales a medida.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 container mx-auto px-4 mb-24">
                    <div className="bg-primary rounded-[2rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl shadow-primary/40">
                        <div className="absolute top-0 right-0 p-10 opacity-10">
                            <Rocket className="w-64 h-64 rotate-12" />
                        </div>
                        <div className="max-w-2xl relative z-10">
                            <h2 className="text-4xl md:text-5xl font-bold mb-8 font-display">¿Listo para impulsar tu negocio?</h2>
                            <ul className="space-y-4 mb-10">
                                <li className="flex items-center gap-3 font-medium">
                                    <CheckCircle2 className="h-6 w-6 text-white/60" /> Atención personalizada
                                </li>
                                <li className="flex items-center gap-3 font-medium">
                                    <CheckCircle2 className="h-6 w-6 text-white/60" /> Asesoramiento creativo gratuito
                                </li>
                                <li className="flex items-center gap-3 font-medium">
                                    <CheckCircle2 className="h-6 w-6 text-white/60" /> Bonificación por primer pauta
                                </li>
                            </ul>
                            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 h-16 px-10 text-xl font-black rounded-2xl shadow-2xl">
                                <Link href="/contacto">Hablemos Hoy</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
