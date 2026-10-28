export const MAX_VIDEO_BYTES = 80 * 1024 * 1024

export const VIDEO_ACCEPT = "video/mp4,video/webm,video/quicktime,video/ogg,.mp4,.webm,.mov,.ogg"

const VIDEO_MIME = /^video\/(mp4|webm|quicktime|ogg|x-m4v)$/
const VIDEO_EXT = /\.(mp4|webm|mov|ogg|m4v)$/i

export function isVideoUrl(url?: string | null): boolean {
  if (!url) return false
  return /\/video\/upload\//i.test(url) || VIDEO_EXT.test(url.split("?")[0] || "")
}

export function validateVideoFile(file: File): string | null {
  const typeOk = VIDEO_MIME.test(file.type) || (!file.type && VIDEO_EXT.test(file.name))
  const extOk = VIDEO_EXT.test(file.name)
  if (!typeOk && !extOk) {
    return "El video tiene que ser MP4, WebM, MOV u OGG."
  }
  if (file.size > MAX_VIDEO_BYTES) {
    return "El video supera el máximo de 80 MB."
  }
  return null
}

export function validateGalleryFile(file: File): string | null {
  if (file.type.startsWith("image/")) return null
  if (file.type.startsWith("video/") || VIDEO_EXT.test(file.name)) {
    return validateVideoFile(file)
  }
  return "Solo se pueden subir fotos o videos (MP4, WebM, MOV u OGG)."
}
