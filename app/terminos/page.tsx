import { Header } from "@/components/header"
import { Separator } from "@/components/ui/separator"

export default function TerminosPage() {
    const lastUpdate = "19 de Febrero de 2026";

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">Términos y Condiciones</h1>
                    <p className="text-muted-foreground uppercase tracking-widest text-sm font-bold">
                        Última actualización: {lastUpdate}
                    </p>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none space-y-8 text-pretty">
                    <section>
                        <h2 className="text-2xl font-bold text-foreground border-l-4 border-primary pl-4 mb-4">1. Aceptación de los Términos</h2>
                        <p>
                            Al acceder y utilizar el sitio web de Noticias del Interior, usted acepta cumplir y estar sujeto a los siguientes términos y condiciones de uso. Si no está de acuerdo con alguna parte de estos términos, le solicitamos que no utilice nuestro sitio.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground border-l-4 border-primary pl-4 mb-4">2. Propiedad Intelectual</h2>
                        <p>
                            Todo el contenido publicado en este sitio, incluyendo pero no limitado a textos, gráficos, logotipos, imágenes y clips de audio, es propiedad de Editorial El Interior S.A. o de sus proveedores de contenido y está protegido por las leyes de derechos de autor nacionales e internacionales.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground border-l-4 border-primary pl-4 mb-4">3. Uso de los Contenidos</h2>
                        <p>
                            Se autoriza la visualización, descarga e impresión de los contenidos del sitio únicamente para uso personal y no comercial. Queda estrictamente prohibida la reproducción, distribución, modificación o comunicación pública de cualquier contenido sin la autorización previa y por escrito de Editorial El Interior S.A.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground border-l-4 border-primary pl-4 mb-4">4. Responsabilidad por Comentarios</h2>
                        <p>
                            Noticias del Interior ofrece espacios de participación para los usuarios. No nos hacemos responsables por las opiniones vertidas por los usuarios en los comentarios. No obstante, nos reservamos el derecho de eliminar cualquier comentario que sea considerado ofensivo, ilegal o que viole las normas de convivencia digital.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground border-l-4 border-primary pl-4 mb-4">5. Enlaces a Terceros</h2>
                        <p>
                            Nuestro sitio puede contener enlaces a sitios web de terceros que no son propiedad ni están controlados por Noticias del Interior. No tenemos control ni asumimos responsabilidad por el contenido, las políticas de privacidad o las prácticas de cualquier sitio web de terceros.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground border-l-4 border-primary pl-4 mb-4">6. Modificaciones de los Términos</h2>
                        <p>
                            Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigencia inmediatamente después de su publicación en el sitio web. El uso continuo del sitio tras la publicación de cambios constituye la aceptación de los mismos.
                        </p>
                    </section>

                    <Separator className="my-12" />

                    <section className="bg-muted/30 p-8 rounded-xl border border-border italic text-sm text-center">
                        Para cualquier consulta legal o relacionada con estos términos, puede contactarnos a través de nuestra página de <a href="/contacto" className="text-primary font-bold hover:underline">Contacto</a>.
                    </section>
                </div>
            </main>
        </div>
    )
}
