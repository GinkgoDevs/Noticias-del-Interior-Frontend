import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Send } from "lucide-react"

export default function ContactoPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-16 md:py-24">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 font-display">Contacto</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            ¿Tenés alguna consulta, reclamo o sugerencia? Queremos escucharte. Completá el formulario y nos pondremos en contacto con vos a la brevedad.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        {/* Contact Info */}
                        <div className="lg:col-span-5 space-y-8">
                            <div className="bg-surface-dark p-8 rounded-2xl border border-primary/10 shadow-xl">
                                <h2 className="text-2xl font-bold mb-8 font-display">Información de Contacto</h2>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                            <Mail className="text-primary h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold mb-1">Email</p>
                                            <p className="text-lg font-medium">contacto@noticiasinterior.com.ar</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                            <Phone className="text-primary h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold mb-1">Teléfono</p>
                                            <p className="text-lg font-medium">+54 (11) 4567-8900</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                            <MapPin className="text-primary h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold mb-1">Redacción</p>
                                            <p className="text-lg font-medium">Av. de Mayo 600, CABA<br />Buenos Aires, Argentina</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 pt-8 border-t border-primary/10">
                                    <p className="text-sm text-muted-foreground mb-4">Seguinos en nuestras redes</p>
                                    <div className="flex gap-4">
                                        {/* Placeholder social icons */}
                                        <div className="w-10 h-10 rounded-full bg-background border border-primary/20 flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer">F</div>
                                        <div className="w-10 h-10 rounded-full bg-background border border-primary/20 flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer">X</div>
                                        <div className="w-10 h-10 rounded-full bg-background border border-primary/20 flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer">I</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="lg:col-span-7">
                            <form className="bg-card p-8 md:p-10 rounded-2xl border border-border shadow-2xl space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Nombre Completo</label>
                                        <Input placeholder="Tu nombre" className="bg-background/50 border-border focus:border-primary" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Email</label>
                                        <Input type="email" placeholder="email@ejemplo.com" className="bg-background/50 border-border focus:border-primary" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Asunto</label>
                                    <Input placeholder="¿Sobre qué querés hablarnos?" className="bg-background/50 border-border focus:border-primary" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Mensaje</label>
                                    <Textarea placeholder="Escribí tu mensaje aquí..." className="min-h-[200px] bg-background/50 border-border focus:border-primary" />
                                </div>

                                <Button className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                                    <Send className="h-5 w-5" />
                                    Enviar Mensaje
                                </Button>

                                <p className="text-center text-xs text-muted-foreground pt-4">
                                    Al enviar este formulario, aceptás nuestros términos de privacidad.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
