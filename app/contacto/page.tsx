import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import Link from "next/link"

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
                                            <p className="text-lg font-medium">Crosznercki@yahoo.com.ar</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                            <Phone className="text-primary h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold mb-1">Teléfono</p>
                                            <p className="text-lg font-medium">3865440662 &nbsp;/&nbsp; 3815558117</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                            <MapPin className="text-primary h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold mb-1">Redacción</p>
                                            <p className="text-lg font-medium">Juan Bautista Alberdi<br />Tucumán, Argentina</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 pt-8 border-t border-primary/10">
                                    <p className="text-sm text-muted-foreground mb-4">Seguinos en nuestras redes</p>
                                    <div className="flex gap-4">
                                        <Link href="https://www.facebook.com/share/1CUvzUj37P/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-background border border-primary/20 flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer">
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                        </Link>
                                        <Link href="https://tiktok.com/@julianrosznercki" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-background border border-primary/20 flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer">
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.22-1.15 4.41-2.9 5.81-1.74 1.41-4.08 2.1-6.32 1.83-2.31-.29-4.52-1.57-5.75-3.52-1.22-1.93-1.49-4.38-.68-6.49.81-2.09 2.5-3.8 4.62-4.53 2.15-.74 4.54-.58 6.54.46v4.11c-1.2-.68-2.61-.91-3.95-.61-1.34.31-2.51 1.25-3.09 2.47-.57 1.23-.55 2.7.07 3.91.61 1.22 1.86 2.12 3.2 2.42 1.34.29 2.78-.17 3.75-1.07.95-.91 1.4-2.22 1.38-3.54.02-3.1-.01-6.19-.01-9.29-.02-3.09.02-6.18.01-9.27z" /></svg>
                                        </Link>
                                        <Link href="https://www.instagram.com/noticiasdelinterior/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-background border border-primary/20 flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer">
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                                        </Link>
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
