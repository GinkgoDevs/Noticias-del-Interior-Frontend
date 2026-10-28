/**
 * Utilidad para manejar metadatos en los pies de foto (captions).
 * Permite guardar preferencias de visualización sin cambiar la base de datos.
 */

export interface ParsedCaption {
    cleanCaption: string;
    fitMode: 'cover' | 'contain';
    position: 'top' | 'center' | 'bottom';
    aspectRatio: string;
    hasMetadata: boolean;
}

/**
 * Parsea un caption en busca de etiquetas de metadatos como [fit:contain], [pos:top], [ratio:4/3]
 * @param context `gallery`: por defecto muestra la foto entera (sin recorte). `article`: imagen principal, por defecto cover.
 */
export function parseImageCaption(
    caption: string | undefined | null,
    context: 'article' | 'gallery' = 'article',
): ParsedCaption {
    const defaultFit: 'cover' | 'contain' = context === 'gallery' ? 'contain' : 'cover';

    if (!caption) {
        return {
            cleanCaption: "",
            fitMode: defaultFit,
            position: 'center',
            aspectRatio: '16/9',
            hasMetadata: false
        };
    }

    const fitContain = caption.includes("[fit:contain]");
    const fitCover = caption.includes("[fit:cover]");
    
    // Position parsing
    let position: 'top' | 'center' | 'bottom' = 'center';
    if (caption.includes("[pos:top]")) position = 'top';
    else if (caption.includes("[pos:bottom]")) position = 'bottom';

    // Aspect ratio parsing
    let aspectRatio = '16/9';
    const ratioMatch = caption.match(/\[ratio:([\d/]+|auto)\]/);
    if (ratioMatch) aspectRatio = ratioMatch[1];

    // Limpiar el caption de cualquier tag [fit:...], [pos:...], [ratio:...]
    const cleanCaption = caption
        .replace(/\[fit:(contain|cover)\]/g, "")
        .replace(/\[pos:(top|center|bottom)\]/g, "")
        .replace(/\[ratio:([\d/]+|auto)\]/g, "")
        .trim();

    const hasMetadata = fitContain || fitCover || position !== 'center' || aspectRatio !== '16/9';

    return {
        cleanCaption,
        fitMode: fitCover ? 'cover' : fitContain ? 'contain' : defaultFit,
        position,
        aspectRatio,
        hasMetadata
    };
}
