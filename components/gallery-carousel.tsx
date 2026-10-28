'use client'

import * as React from 'react'
import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X, ChevronLeft, ChevronRight, Maximize2, Share2 } from "lucide-react"

import { parseImageCaption } from "@/lib/utils-images"
import { isVideoUrl } from "@/lib/media"
import { cn } from "@/lib/utils"

interface GalleryCarouselProps {
  images: any[]
}

export function GalleryCarousel({ images }: GalleryCarouselProps) {
  if (!images || images.length === 0) return null

  const [api, setApi] = React.useState<any>()
  const [modalApi, setModalApi] = React.useState<any>()
  const [current, setCurrent] = React.useState(0)
  const [modalCurrent, setModalCurrent] = React.useState(0)
  const [isOpen, setIsOpen] = React.useState(false)
  const mainRef = React.useRef<HTMLDivElement>(null)
  const modalRef = React.useRef<HTMLDivElement>(null)

  const pauseInactiveVideos = (container: HTMLElement | null, activeIndex: number) => {
    container?.querySelectorAll("video").forEach((video) => {
      const index = Number(video.closest("[data-slide]")?.getAttribute("data-slide"))
      if (index !== activeIndex) video.pause()
    })
  }

  React.useEffect(() => {
    pauseInactiveVideos(mainRef.current, isOpen ? -1 : current)
  }, [current, isOpen])

  React.useEffect(() => {
    pauseInactiveVideos(modalRef.current, isOpen ? modalCurrent : -1)
  }, [modalCurrent, isOpen])

  // Sync main carousel current slide
  React.useEffect(() => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  // Sync modal carousel current slide
  React.useEffect(() => {
    if (!modalApi) return
    setModalCurrent(modalApi.selectedScrollSnap())
    modalApi.on("select", () => {
      setModalCurrent(modalApi.selectedScrollSnap())
    })
  }, [modalApi])

  const openModal = (index: number) => {
    setModalCurrent(index)
    setIsOpen(true)
  }

  return (
    <div ref={mainRef} className="w-full relative px-4 md:px-12 group/main">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {images.map((img: any, i: number) => {
            const imgMeta = parseImageCaption(img.caption, 'gallery')
            const video = isVideoUrl(img.url)
            return (
              <CarouselItem key={i} data-slide={i} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/2">
                <figure className="flex flex-col h-full group">
                  <div 
                    onClick={() => {
                      if (!video) openModal(i)
                    }}
                    className={cn(
                      "relative overflow-hidden rounded-2xl border border-border bg-muted shadow-sm hover:shadow-2xl transition-all duration-500 flex items-center justify-center w-full group/img",
                      video ? "aspect-video bg-black cursor-default" : "cursor-zoom-in",
                      !video && imgMeta.fitMode === 'cover'
                        ? "aspect-[16/10]"
                        : !video && "py-4 min-h-[280px] h-[360px] sm:h-[400px] md:h-[480px]"
                    )}
                  >
                    {video ? (
                      <video
                        src={img.url}
                        controls
                        playsInline
                        preload="metadata"
                        className="h-full w-full object-contain bg-black"
                      />
                    ) : (
                      <Image
                        src={img.url}
                        alt={imgMeta.cleanCaption || `Galería ${i + 1}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className={cn(
                          "transition-all duration-1000",
                          imgMeta.fitMode === 'cover'
                            ? "object-cover group-hover/img:scale-110"
                            : "object-contain"
                        )}
                        style={{
                          objectPosition:
                            imgMeta.fitMode === 'cover'
                              ? imgMeta.position === 'top'
                                ? 'center top'
                                : imgMeta.position === 'bottom'
                                  ? 'center bottom'
                                  : 'center'
                              : 'center',
                        }}
                      />
                    )}
                    {video ? (
                      <button
                        type="button"
                        onClick={() => openModal(i)}
                        className="absolute top-3 right-3 z-10 p-2.5 bg-black/50 backdrop-blur-xl border border-white/20 rounded-full text-white shadow-2xl hover:bg-black/70"
                        aria-label="Ampliar video"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors duration-500 flex items-center justify-center">
                         <div className="opacity-0 group-hover/img:opacity-100 transition-all duration-500 translate-y-4 group-hover/img:translate-y-0 p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white shadow-2xl">
                            <Maximize2 className="w-5 h-5" />
                         </div>
                      </div>
                    )}
                  </div>
                  {imgMeta.cleanCaption && (
                    <figcaption className="text-xs md:text-sm text-muted-foreground italic mt-4 text-center px-4 line-clamp-2 leading-relaxed">
                      {imgMeta.cleanCaption}
                    </figcaption>
                  )}
                </figure>
              </CarouselItem>
            )
          })}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="-left-14 h-12 w-12 border-primary/20 text-primary hover:bg-primary/10 hover:text-primary transition-all opacity-0 group-hover/main:opacity-100 shadow-xl" />
          <CarouselNext className="-right-14 h-12 w-12 border-primary/20 text-primary hover:bg-primary/10 hover:text-primary transition-all opacity-0 group-hover/main:opacity-100 shadow-xl" />
        </div>
        
        {/* Mobile indicators */}
        <div className="flex justify-center gap-2 mt-8 md:hidden">
          {images.map((_, i) => (
             <div 
               key={i} 
               className={cn(
                 "h-1.5 transition-all duration-500 rounded-full",
                 current === i ? "w-10 bg-primary" : "w-2 bg-primary/20"
               )} 
             />
          ))}
        </div>
      </Carousel>

      {/* Lightbox Modal with Full Carousel - Premium Cinematic Design */}
      <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content 
            ref={modalRef}
            className="fixed inset-0 top-0 left-0 w-full h-full p-0 border-none bg-[#0e0e0e] flex flex-col items-center justify-center z-[1001] outline-none overflow-hidden select-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
            onOpenAutoFocus={(e: any) => e.preventDefault()}
          >
            <DialogPrimitive.Title className="sr-only">Galería completa</DialogPrimitive.Title>
            
            {/* Top Bar - Cinematic Navigation */}
            <nav className="fixed top-0 w-full z-[1010] bg-neutral-950/70 backdrop-blur-xl flex justify-between items-center px-4 md:px-12 h-16 md:h-20">
              <div className="flex items-center gap-4 md:gap-8">
                <DialogPrimitive.Close className="p-2 text-white/80 hover:text-white hover:bg-white/10 transition-all rounded-full flex items-center justify-center group">
                  <X className="w-6 h-6 md:w-7 md:h-7 group-hover:rotate-90 transition-transform duration-300" />
                </DialogPrimitive.Close>
                <span className="font-manrope font-medium tracking-[0.2em] text-[10px] md:text-xs uppercase text-white/90">
                  {modalCurrent + 1} / {images.length}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 transition-all rounded-full">
                  <Share2 className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
            </nav>

            <Carousel 
              setApi={setModalApi}
              opts={{
                startIndex: modalCurrent,
                loop: true,
              }}
              className="w-full h-full"
            >
              <CarouselContent className="h-full m-0 flex items-center">
                {images.map((img: any, i: number) => {
                  const imgMeta = parseImageCaption(img.caption, 'gallery')
                  const video = isVideoUrl(img.url)
                  return (
                    <CarouselItem key={i} data-slide={i} className="basis-full h-full min-w-0 p-0 flex flex-col items-center justify-center relative flex-shrink-0">
                      {!video && (
                        <div className="absolute inset-0 z-0 opacity-15 blur-3xl scale-125 overflow-hidden">
                          <Image
                            src={img.url}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4 md:p-12 lg:p-24 overflow-hidden">
                        {/* Media Display Area */}
                        <div className="relative w-full max-w-7xl h-full flex flex-col items-center justify-center">
                          <div className="relative w-full max-h-[70vh] flex justify-center group shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                            {video ? (
                              <video
                                src={img.url}
                                controls
                                playsInline
                                preload="metadata"
                                className="max-h-[70vh] w-full bg-black object-contain"
                              />
                            ) : (
                              <Image
                                src={img.url}
                                alt={imgMeta.cleanCaption || `Imagen ${i + 1}`}
                                width={1920}
                                height={1080}
                                className="max-w-full max-h-[70vh] object-contain"
                                priority={i === modalCurrent}
                              />
                            )}
                            {!video && (
                              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/20 opacity-40"></div>
                            )}
                          </div>

                          {/* Caption Area - Tonal Layering & Premium Typography */}
                          {imgMeta.cleanCaption && (
                            <div className="mt-8 md:mt-12 max-w-2xl w-full px-6 text-center md:text-left">
                              <div className="flex items-center justify-center md:justify-start gap-4 mb-3 md:mb-4">
                                <span className="font-sans text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-[#9d9e9e] uppercase bg-white/5 border border-white/10 px-3 py-1 rounded-sm">
                                  {video ? "Video" : "Galería de Fotos"}
                                </span>
                                <span className="font-sans text-[9px] md:text-[10px] font-medium tracking-[0.2em] text-[#e7e5e4]/60 uppercase">
                                  Noticias del Interior
                                </span>
                              </div>
                              <h2 className="font-manrope text-xl md:text-3xl font-bold tracking-tight text-[#e7e5e4] mb-3 leading-tight text-balance">
                                {imgMeta.cleanCaption.length > 80 ? imgMeta.cleanCaption.substring(0, 80) + '...' : imgMeta.cleanCaption}
                              </h2>
                              <p className="font-sans text-sm md:text-base text-[#acabaa] leading-relaxed opacity-90 max-w-xl text-balance">
                                {imgMeta.cleanCaption}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CarouselItem>
                  )
                })}
              </CarouselContent>

              {/* Navigation Controls - Desktop Arrows */}
              <div className="absolute inset-x-4 md:inset-x-8 lg:inset-x-12 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-[1020]">
                <button 
                  onClick={() => modalApi?.scrollPrev()}
                  className="p-3 md:p-5 lg:p-6 rounded-full bg-neutral-900/40 hover:bg-neutral-800/60 shadow-2xl backdrop-blur-md text-white/60 hover:text-white transition-all transform hover:scale-110 active:scale-95 pointer-events-auto border border-white/5"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
                </button>
                <button 
                  onClick={() => modalApi?.scrollNext()}
                  className="p-3 md:p-5 lg:p-6 rounded-full bg-neutral-900/40 hover:bg-neutral-800/60 shadow-2xl backdrop-blur-md text-white/60 hover:text-white transition-all transform hover:scale-110 active:scale-95 pointer-events-auto border border-white/5"
                  aria-label="Siguiente"
                >
                  <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
                </button>
              </div>
            </Carousel>

            {/* Bottom Progress Strip - Mobile Optimized */}
            <div className="fixed bottom-0 left-0 w-full h-[3px] bg-white/5 z-[1030]">
              <div 
                className="h-full bg-[#c6c6c7] transition-all duration-300 shadow-[0_0_10px_rgba(198,198,199,0.5)]" 
                style={{ width: `${((modalCurrent + 1) / images.length) * 100}%` }}
              />
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  )
}
