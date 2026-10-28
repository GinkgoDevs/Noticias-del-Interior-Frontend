let registered = false

export function registerVideoFileBlot(Quill: any) {
  if (registered) return

  const BlockEmbed = Quill.import("blots/block/embed")

  class VideoFile extends BlockEmbed {
    static blotName = "videoFile"
    static tagName = "VIDEO"

    static create(url: string) {
      const node = super.create(url) as HTMLVideoElement
      node.setAttribute("src", url)
      node.setAttribute("controls", "true")
      node.setAttribute("playsinline", "true")
      node.setAttribute("preload", "metadata")
      node.classList.add("ql-video-file")
      return node
    }

    static value(node: HTMLElement) {
      return node.getAttribute("src")
    }
  }

  Quill.register(VideoFile, true)
  registered = true
}
