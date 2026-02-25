"use client"

import Link from "next/link"
import Image from "next/image"

export function Footer() {
    return (
        <footer className="bg-secondary text-secondary-foreground mt-20 pt-16 pb-8 border-t border-primary/20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
                    {/* Brand Column */}
                    <div>
                        <Link href="/" className="flex items-center mb-6">
                            <Image
                                src="/logo-oscuro.png"
                                alt="Noticias del Interior"
                                width={280}
                                height={70}
                                className="w-[160px] md:w-[220px] h-auto"
                            />
                        </Link>
                        <p className="text-secondary-foreground/60 text-sm leading-relaxed mb-6 font-light">
                            Desde 1992 conectando a todo el país con información veraz, plural e independiente. Somos la voz de las provincias.
                        </p>
                        <div className="flex space-x-4">
                            <SocialLink icon="facebook" href="https://www.facebook.com/share/1CUvzUj37P/" />
                            <SocialLink icon="tiktok" href="https://tiktok.com/@julianrosznercki" />
                            <SocialLink icon="instagram" href="https://www.instagram.com/noticiasdelinterior/" />
                        </div>
                    </div>

                    {/* Sections */}
                    <div>
                        <h4 className="font-bold mb-6 uppercase text-sm tracking-widest border-b border-primary/20 pb-2">Secciones</h4>
                        <ul className="space-y-3 text-secondary-foreground/70 text-sm font-light">
                            <li><Link href="/deportes" className="hover:text-primary transition-colors">Deportes</Link></li>
                            <li><Link href="/policiales" className="hover:text-primary transition-colors">Policiales</Link></li>
                            <li><Link href="/politica" className="hover:text-primary transition-colors">Política</Link></li>
                            <li><Link href="/espectaculo" className="hover:text-primary transition-colors">Espectáculos</Link></li>
                            <li><Link href="/economia" className="hover:text-primary transition-colors">Economía</Link></li>
                            <li><Link href="/juegos" className="hover:text-primary transition-colors">Juegos</Link></li>
                        </ul>
                    </div>

                    {/* Institutional */}
                    <div>
                        <h4 className="font-bold mb-6 uppercase text-sm tracking-widest border-b border-primary/20 pb-2">Institucional</h4>
                        <ul className="space-y-3 text-secondary-foreground/70 text-sm font-light">
                            <li><Link href="/contacto" className="hover:text-primary transition-colors">Contacto</Link></li>
                            <li><Link href="/terminos" className="hover:text-primary transition-colors">Términos y Condiciones</Link></li>
                            <li><Link href="/anunciar" className="hover:text-primary transition-colors">Anunciar con nosotros</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-secondary-foreground/50 gap-4">
                    <div className="md:w-1/3 text-center md:text-left">
                        <p>© {new Date().getFullYear()} Editorial El Interior S.A. Todos los derechos reservados.</p>
                    </div>

                    <div className="md:w-1/3 flex justify-center">
                        <Link
                            href="https://ginkgodevs.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:text-white transition-colors group"
                        >
                            <span>Diseñado por</span>
                            <div className="relative h-6 w-24">
                                <Image
                                    src="/logoGinkGo.png"
                                    alt="GinkGo Devs"
                                    fill
                                    className="object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                                />
                            </div>
                        </Link>
                    </div>

                    <div className="md:w-1/3 flex justify-center md:justify-end">
                        <span>Hecho con <span className="text-primary font-bold">♥</span> en Argentina</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

function SocialLink({ icon, href }: { icon: string, href?: string }) {
    const icons: Record<string, React.ReactNode> = {
        facebook: (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        ),
        x: <span className="font-bold text-sm">X</span>,
        tiktok: (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.22-1.15 4.41-2.9 5.81-1.74 1.41-4.08 2.1-6.32 1.83-2.31-.29-4.52-1.57-5.75-3.52-1.22-1.93-1.49-4.38-.68-6.49.81-2.09 2.5-3.8 4.62-4.53 2.15-.74 4.54-.58 6.54.46v4.11c-1.2-.68-2.61-.91-3.95-.61-1.34.31-2.51 1.25-3.09 2.47-.57 1.23-.55 2.7.07 3.91.61 1.22 1.86 2.12 3.2 2.42 1.34.29 2.78-.17 3.75-1.07.95-.91 1.4-2.22 1.38-3.54.02-3.1-.01-6.19-.01-9.29-.02-3.09.02-6.18.01-9.27z" />
            </svg>
        ),
        instagram: (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
        ),
    }

    return (
        <Link
            href={href || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-all text-white border border-white/10 hover:border-white/30"
        >
            {icons[icon]}
        </Link>
    )
}
